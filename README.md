# AI Trip Planner

A full-stack AI-powered trip planning web app that captures everything a traveler needs: costs, logistics, activities, weather, visa/passport requirements, currency conversion, packing lists, and more. Integrates with **Claude Desktop** via an MCP server so Claude can populate and react to trip data — no API key needed.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 6, TypeScript, Tailwind CSS 4, shadcn/ui, Framer Motion |
| **Backend** | Python, FastAPI, SQLAlchemy 2.0, Alembic, Pydantic v2 |
| **Database** | SQLite (local dev) / PostgreSQL (production) |
| **AI Integration** | MCP Server (Python, FastMCP) — Claude Desktop reads & writes trip data |
| **Deployment** | Render (static site + web service + Postgres) |

## Features

- **Trip Management** — Create, edit, and track trips with status (planning/booked/active/completed)
- **Activity Planning** — Add activities with type, duration, cost, difficulty, GPS coordinates, ratings
- **Budget Tracking** — Track expenses by category with multi-currency support and automatic USD conversion
- **Flight & Transport Logistics** — Log flights, accommodations, and transport legs between locations
- **Drag & Drop Itinerary** — Day-by-day timeline with drag-to-reorder support
- **Interactive Maps** — Leaflet maps with color-coded pins for activities and accommodations
- **Travel Intelligence** — Visa requirements, language phrases, electrical outlets, safety notes, emergency contacts
- **Weather Forecasts** — Day-by-day weather data with temperature, rain probability, UV index
- **Packing Checklist** — Categorized packing list with check-off, essential items highlighted
- **Budget Visualizations** — Donut charts by spending category, progress bars, expense breakdowns
- **Claude Desktop Integration** — 20 MCP tools for two-way sync (Claude populates data, sees your changes)
- **Progressive Disclosure UI** — Overview first, details on dive-in. Clean, welcoming design with animations

## Project Structure

```
trip-planner/
├── backend/                    # FastAPI + SQLAlchemy backend
│   ├── app/
│   │   ├── main.py            # FastAPI app with CORS
│   │   ├── config.py          # Environment settings
│   │   ├── database.py        # SQLAlchemy engine + session
│   │   ├── models/            # 10 SQLAlchemy ORM models
│   │   ├── schemas/           # Pydantic request/response models
│   │   ├── routers/           # FastAPI route modules
│   │   ├── crud/              # Database operations layer
│   │   └── utils.py           # Helpers + currency conversion
│   ├── alembic/               # Database migrations
│   └── pyproject.toml
├── mcp/                        # MCP server for Claude Desktop
│   └── server/
│       ├── main.py            # FastMCP entry point (stdio)
│       ├── client.py          # HTTP client for backend API
│       └── tools/             # 20 MCP tool definitions
│           ├── write_tools.py # 16 write tools (create, update, delete)
│           └── read_tools.py  # 4 read tools (summaries, status)
├── frontend/                   # React + Vite frontend
│   └── src/
│       ├── pages/             # Dashboard, TripCreate, TripDetail
│       ├── components/        # UI components + shadcn/ui
│       ├── hooks/             # TanStack Query hooks
│       ├── api/               # Axios client + endpoint modules
│       ├── types/             # TypeScript interfaces
│       └── lib/               # Utilities, constants, formatters
└── render.yaml                 # Render deployment blueprint
```

## Database Schema

10 tables with UUID primary keys and cascading deletes:

| Table | Description |
|-------|-------------|
| `trips` | Core trip data — destination, dates, budget, status |
| `activities` | Planned activities with type, cost, difficulty, GPS |
| `expenses` | Tracked expenses with category and multi-currency |
| `accommodations` | Hotels, Airbnbs, hostels with check-in/out dates |
| `flights` | Flight details — airline, times, seat, terminal |
| `transports` | Transport legs between locations (car, bus, train, etc.) |
| `itinerary_items` | Day-by-day ordered items with drag-drop position |
| `travel_info` | Visa, language, outlets, safety, timezone per trip |
| `weather_info` | Daily weather forecasts per trip |
| `packing_items` | Categorized packing checklist items |

## Getting Started

### Prerequisites

- **Python 3.11+** (with conda or pip)
- **Node.js 18+** (with npm)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/jivanb7/trip-planner.git
cd trip-planner
```

### 2. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -e .

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload --port 8000
```

The API is now running at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend is now running at `http://localhost:5173`.

### 4. MCP Server Setup (Claude Desktop Integration)

```bash
cd mcp

# Install dependencies
pip install -e .
```

Add the MCP server to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "trip-planner": {
      "command": "python",
      "args": ["-m", "server.main"],
      "cwd": "/path/to/trip-planner/mcp",
      "env": {
        "BACKEND_URL": "http://localhost:8000"
      }
    }
  }
}
```

Restart Claude Desktop. You can now tell Claude: *"Plan a 7-day trip to Tokyo with a $4000 budget"* and it will populate your trip planner automatically.

## API Reference

All endpoints are under `/api/v1`. Full interactive docs at `/docs` when the backend is running.

### Trips
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/trips` | List all trips |
| `POST` | `/trips` | Create a new trip |
| `GET` | `/trips/{id}` | Get trip details |
| `PUT` | `/trips/{id}` | Update a trip |
| `DELETE` | `/trips/{id}` | Delete trip (cascades to all children) |
| `GET` | `/trips/{id}/summary` | Full trip summary with counts and budget |
| `GET` | `/trips/{id}/budget` | Budget breakdown |
| `GET` | `/trips/{id}/currency` | Trip currency code |

### Resources (nested under `/trips/{trip_id}/`)
Full CRUD available for: `activities`, `expenses`, `accommodations`, `flights`, `transports`, `itinerary`, `packing`

Special endpoints:
- `GET /trips/{id}/expenses/summary` — Per-category expense totals
- `PUT /trips/{id}/itinerary/reorder` — Batch reorder itinerary items
- `GET/PUT /trips/{id}/travel-info` — Upsert visa, safety, language info
- `GET/POST /trips/{id}/weather` — Weather forecast data

## MCP Tools (Claude Desktop)

### Write Tools (Claude populates your data)
`create_trip`, `update_trip`, `delete_trip`, `list_trips`, `add_activity`, `suggest_activities`, `remove_activity`, `add_expense`, `set_budget`, `add_flight`, `add_accommodation`, `add_transport`, `set_travel_info`, `add_weather_forecast`, `add_packing_items`, `suggest_packing_list`

### Read Tools (Claude sees your changes)
`get_trip_summary`, `get_budget_remaining`, `get_recent_changes`, `get_packing_status`

### Two-Way Workflow
1. Tell Claude: *"Plan a 7-day trip to Tokyo, $4000 budget, I like outdoors and street food"*
2. Claude uses write tools to populate: trip, activities, flights, hotels, transport, visa info, weather, packing list
3. Open the web app — see everything organized with charts, maps, and timelines
4. Make changes in the web app (delete an activity, add an expense, check off packing items)
5. Tell Claude: *"I made some changes to the Tokyo trip, what do you think?"*
6. Claude calls `get_trip_summary` + `get_recent_changes` — sees your edits and responds

## Environment Variables

### Backend
| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `sqlite:///./trip_planner.db` | Database connection string |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | Comma-separated CORS origins |

### Frontend
| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Backend API URL |

### MCP Server
| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_URL` | `http://localhost:8000` | Backend API URL |

## Deployment (Render)

This project includes a `render.yaml` Blueprint for one-click deployment to Render:

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
3. Connect your GitHub repo and select `render.yaml`
4. Render will create:
   - **Frontend** — Static site from `frontend/dist`
   - **Backend** — Web service running FastAPI
   - **Database** — PostgreSQL instance

Set the environment variables in Render's dashboard for each service.

## Development

### Running Tests
```bash
cd backend
pytest
```

### Database Migrations
```bash
cd backend

# Create a new migration after model changes
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1
```

### Adding shadcn/ui Components
```bash
cd frontend
npx shadcn@latest add <component-name>
```

## License

MIT
