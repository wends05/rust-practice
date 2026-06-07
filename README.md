# Rust Practice

A monorepo for practicing Rust backend development with a TanStack Start frontend.

## Stack

- **Package Manager**: Bun 1.3.14
- **Build Orchestrator**: Turborepo
- **Linter/Formatter**: Biome
- **Frontend**: TanStack Start + React Query + redaxios (React 19)
- **Backend**: Rust

## Structure

```
.
├── apps/
│   ├── api/          # Rust backend
│   └── web/          # TanStack Start frontend
└── packages/         # (empty for now)
```

## Getting Started

```bash
# Install dependencies
bun install

# Run both apps in dev mode
bun run dev

# Build everything
bun run build

# Lint
bun run lint

# Format
bun run format
```

## Apps

### API (`apps/api`)

A Rust project. You'll wire up the backend yourself.

```bash
cd apps/api
cargo run    # dev
cargo build  # release
cargo test   # tests
```

### Web (`apps/web`)

TanStack Start with React Query for server state management.

```bash
cd apps/web
bun run dev    # dev server on port 3000
bun run build  # production build
```
