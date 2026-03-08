"""FastMCP entry point for the Trip Planner MCP server.

Run with:
    conda run -n ml python -m server.main

Or configure in Claude Desktop's config as:
    {
        "mcpServers": {
            "trip-planner": {
                "command": "conda",
                "args": ["run", "-n", "ml", "python", "-m", "server.main"],
                "cwd": "/path/to/trip-planner/mcp"
            }
        }
    }
"""

from __future__ import annotations

import asyncio
import sys

from mcp.server.fastmcp import FastMCP

from server.client import api
from server.tools.read_tools import register_read_tools
from server.tools.write_tools import register_write_tools

mcp = FastMCP(
    "Trip Planner",
    instructions=(
        "AI Trip Planner MCP server. Use these tools to create and manage trips, "
        "add activities, track expenses, manage flights and accommodations, "
        "create packing lists, and more. Start with list_trips to see existing "
        "trips, or create_trip to start a new one."
    ),
)

register_write_tools(mcp)
register_read_tools(mcp)


def main() -> None:
    """Run the MCP server with stdio transport."""
    mcp.run(transport="stdio")


if __name__ == "__main__":
    main()
