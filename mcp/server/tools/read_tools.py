"""Read tools for the Trip Planner MCP server.

These tools retrieve and summarize trip data from the backend API.
Claude Desktop reads the docstrings to understand what each tool does.
"""

from __future__ import annotations

from typing import Any

from mcp.server.fastmcp import FastMCP

from server.client import api


def register_read_tools(mcp: FastMCP) -> None:
    """Register all read tools on the given FastMCP server."""

    @mcp.tool()
    async def get_trip_summary(trip_id: str) -> str:
        """Get a comprehensive summary of a trip including all child counts, budget status, and key details.

        This is the best tool to call first when a user asks about a specific trip.

        Args:
            trip_id: The trip ID to summarize
        """
        summary = await api.get_trip_summary(trip_id)

        trip = summary if "name" in summary else summary.get("trip", summary)
        name = trip.get("name", "Unknown")
        dest = trip.get("destination", "Unknown")
        start = trip.get("start_date", "?")
        end = trip.get("end_date", "?")
        desc = trip.get("description", "")

        lines = [
            f"Trip: {name}",
            f"Destination: {dest}",
            f"Dates: {start} to {end}",
        ]
        if desc:
            lines.append(f"Description: {desc}")

        # Budget info
        budget = summary.get("budget") or trip.get("budget")
        currency = summary.get("currency") or trip.get("currency", "USD")
        total_spent = summary.get("total_spent", 0)
        remaining = summary.get("remaining")

        if budget:
            lines.append(f"\nBudget: ${budget:.2f} {currency}")
            lines.append(f"Spent: ${total_spent:.2f}")
            if remaining is not None:
                lines.append(f"Remaining: ${remaining:.2f}")
        else:
            lines.append("\nBudget: Not set")

        # Child counts
        counts = []
        for key, label in [
            ("activity_count", "Activities"),
            ("expense_count", "Expenses"),
            ("flight_count", "Flights"),
            ("accommodation_count", "Accommodations"),
            ("transport_count", "Transports"),
            ("packing_item_count", "Packing items"),
        ]:
            val = summary.get(key)
            if val is not None:
                counts.append(f"  {label}: {val}")

        if counts:
            lines.append("\nItems:")
            lines.extend(counts)

        return "\n".join(lines)

    @mcp.tool()
    async def get_budget_remaining(trip_id: str) -> str:
        """Get the current budget status for a trip: total budget, amount spent, and remaining.

        Args:
            trip_id: The trip ID to check budget for
        """
        budget_data = await api.get_trip_budget(trip_id)

        budget = budget_data.get("budget")
        currency = budget_data.get("currency", "USD")
        total_spent = budget_data.get("total_spent", 0)
        remaining = budget_data.get("remaining")

        if budget is None:
            return (
                "No budget has been set for this trip.\n"
                f"Total expenses so far: ${total_spent:.2f} {currency}\n"
                "Use set_budget to set a budget."
            )

        pct_used = (total_spent / budget * 100) if budget > 0 else 0
        status = "On track" if pct_used < 80 else "Warning" if pct_used < 100 else "Over budget!"

        return (
            f"Budget Status: {status}\n"
            f"  Total budget: ${budget:.2f} {currency}\n"
            f"  Total spent: ${total_spent:.2f} ({pct_used:.1f}%)\n"
            f"  Remaining: ${remaining:.2f}"
        )

    @mcp.tool()
    async def get_recent_changes(trip_id: str, since_timestamp: str | None = None) -> str:
        """Get recent changes to a trip — useful for seeing what was added or modified.

        Shows recently created/updated activities, expenses, flights, accommodations, etc.

        Args:
            trip_id: The trip ID to check
            since_timestamp: Optional ISO timestamp to filter changes after (e.g. "2026-03-01T00:00:00"). If not provided, shows the most recent items.
        """
        # Gather all child resources and sort by updated_at
        activities = await api.list_activities(trip_id)
        packing = await api.list_packing_items(trip_id)

        all_items: list[dict[str, Any]] = []
        for a in activities:
            all_items.append({
                "type": "Activity",
                "name": a.get("name", "?"),
                "updated_at": a.get("updated_at", a.get("created_at", "")),
            })
        for p in packing:
            all_items.append({
                "type": "Packing item",
                "name": p.get("name", "?"),
                "updated_at": p.get("updated_at", p.get("created_at", "")),
            })

        # Filter by timestamp if provided
        if since_timestamp:
            all_items = [
                item for item in all_items
                if item["updated_at"] >= since_timestamp
            ]

        # Sort by most recent first
        all_items.sort(key=lambda x: x["updated_at"], reverse=True)

        if not all_items:
            return "No recent changes found." + (
                f" (filtered since {since_timestamp})" if since_timestamp else ""
            )

        # Show up to 20 most recent
        items_to_show = all_items[:20]
        lines = [f"Recent changes ({len(items_to_show)} of {len(all_items)} total):\n"]
        for item in items_to_show:
            lines.append(f"  [{item['type']}] {item['name']} — updated {item['updated_at']}")

        return "\n".join(lines)

    @mcp.tool()
    async def get_packing_status(trip_id: str) -> str:
        """Get packing progress: how many items are packed vs total, organized by category.

        Args:
            trip_id: The trip ID to check packing status for
        """
        items = await api.list_packing_items(trip_id)

        if not items:
            return "No packing items added yet. Use add_packing_items or suggest_packing_list to create a list."

        # Group by category
        categories: dict[str, list[dict]] = {}
        for item in items:
            cat = item.get("category", "misc")
            categories.setdefault(cat, []).append(item)

        total = len(items)
        packed = sum(1 for i in items if i.get("packed", False))
        pct = (packed / total * 100) if total > 0 else 0

        lines = [
            f"Packing Progress: {packed}/{total} items packed ({pct:.0f}%)\n",
        ]

        for cat, cat_items in sorted(categories.items()):
            cat_packed = sum(1 for i in cat_items if i.get("packed", False))
            lines.append(f"  {cat.title()} ({cat_packed}/{len(cat_items)}):")
            for item in cat_items:
                check = "x" if item.get("packed") else " "
                qty = item.get("quantity", 1)
                qty_str = f" x{qty}" if qty > 1 else ""
                lines.append(f"    [{check}] {item['name']}{qty_str}")

        return "\n".join(lines)
