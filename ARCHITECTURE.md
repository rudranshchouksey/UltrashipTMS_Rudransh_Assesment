# System Architecture

> The technical engine behind Ultraship TMS, focusing on a decoupled layout, high-performance data flow, and optimal rendering strategies.

## 📂 Decoupled Multi-Repo Layout

Ultraship TMS strictly enforces a boundary between the presentation UI and the underlying domain logic. By decoupling the architecture, both repositories can scale, deploy, and iterate independently.

```text
ultraship-tms/
├── frontend/                 # React UI Client
│   ├── src/
│   │   ├── components/       # Dumb/Presentational React components
│   │   ├── graphql/          # Apollo queries, mutations, fragments
│   │   ├── hooks/            # Custom logic and state abstractions
│   │   ├── pages/            # Routable view components
│   │   └── styles/           # Tailwind config and global CSS
│   └── package.json
└── backend/                  # Node.js / GraphQL API
    ├── src/
    │   ├── dataloaders/      # Batching functions for N+1 prevention
    │   ├── models/           # Database schemas and ORM mappings
    │   ├── resolvers/        # GraphQL query and mutation handlers
    │   └── typeDefs/         # GraphQL schema definitions
    └── package.json
```

## 🔄 Data Flow Cycle

Understanding the lifecycle of a mutation (e.g., Creating a new Shipment) from client interaction to database commit and back to the UI.

1. **User Interaction**: The user triggers a "Create Shipment" form drawer.
2. **Client Validation**: Zod/Yup schemas validate the form inputs locally.
3. **Optimistic UI (Cache Prepending)**: Before the network request finishes, Apollo Client artificially mutates the local cache, instantly injecting a "ghost" row at position #1 of the grid layout for immediate perceived performance.
4. **GraphQL Network Transmission**: The mutation payload is serialized and sent to the Vercel serverless backend.
5. **Resolver Invocation**: The Node.js GraphQL resolver receives the request, authorizes the token, and executes the business logic.
6. **Database Commit**: The ORM writes the new shipment record to the database.
7. **State Sync & Resolution**: The server responds with the finalized database object (including auto-generated IDs and timestamps). Apollo Client silently swaps the optimistic "ghost" row with the canonical data, resolving the cycle.

## ⚡ Performance Implementations

### Cursor-Based Pagination & Dynamic Sorting
To handle high-density datasets (tens of thousands of shipment rows), we utilize **cursor-based pagination** rather than offset limits. This prevents database scan degradation on deep pages and ensures stable data feeds even if new records are inserted concurrently. Sorting is handled server-side dynamically via index-optimized database queries.

### Mitigating N+1 Inefficiencies (DataLoaders)
GraphQL's graph-traversal nature inherently risks N+1 querying (e.g., fetching 50 shipments, then making 50 separate queries for their assigned drivers).
We implemented **DataLoaders** on the Node.js backend. Instead of executing queries immediately, the DataLoader batches all requested Driver IDs across the tick cycle and executes a single `WHERE id IN (...)` query, mapping the results back to their respective shipment nodes in memory.

### Apollo Client Local Cache State Mutations
We avoid heavy, global state managers (like Redux) for server state. Apollo Client acts as the single source of truth for all remote data. By leveraging `cache.modify` and `writeFragment`, UI components re-render instantaneously when data changes, avoiding unnecessary network roundtrips for data we already possess locally.
