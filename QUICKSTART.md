# Quick Start Guide

Get your GitHub Monitor up and running in 3 steps!

## 1. Set up your GitHub Token

Create a `.env.local` file:

```bash
echo "NEXT_PUBLIC_GITHUB_TOKEN=your_token_here" > .env.local
```

Get your token from: https://github.com/settings/tokens (select `repo` and `read:user` scopes)

## 2. Generate TypeScript Types

```bash
npm run codegen
```

This will generate TypeScript types from the GitHub GraphQL schema and your queries.

## 3. Start the Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see your GitHub profile and repositories!

## What's Next?

### Create Custom Queries

Add your own GraphQL queries as `.graphql` files in `src/queries/`:

```graphql
# src/queries/MyQuery.graphql
query MyQuery {
  viewer {
    login
  }
}
```

Then run `npm run codegen` to generate:

- `src/queries/MyQuery.ts` with `useMyQueryQuery()` hook

### Use Generated Hooks

```typescript
import { useMyQueryQuery } from "../src/queries/MyQuery";

function MyComponent() {
  const { data, loading, error } = useMyQueryQuery();
  // Your component logic
}
```

### Explore the GitHub GraphQL API

- Browse the schema in `schema.graphql`
- Test queries at: https://docs.github.com/en/graphql/overview/explorer
- Read the full docs: https://docs.github.com/en/graphql

## Need Help?

Check out `SETUP.md` for detailed documentation and troubleshooting tips.
