# GitHub Monitor - Setup Guide

This project is set up to use the GitHub GraphQL API with Apollo Client and auto-generated TypeScript types.

## Prerequisites

- Node.js (v20.15.0 or higher)
- A GitHub Personal Access Token

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure GitHub Token

1. Create a GitHub Personal Access Token:

   - Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Select the following scopes:
     - `repo` (Full control of private repositories)
     - `read:user` (Read user profile data)
   - Generate and copy the token

2. Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

3. Add your token to `.env.local`:

```env
NEXT_PUBLIC_GITHUB_TOKEN=your_github_personal_access_token_here
```

### 3. Generate TypeScript Types

The project includes the GitHub GraphQL schema (`schema.graphql`) and is configured to auto-generate TypeScript types from your GraphQL queries.

To generate types:

```bash
npm run codegen
```

To watch for changes and regenerate automatically:

```bash
npm run codegen:watch
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app.

## Project Structure

```
gh-monitor/
├── codegen.ts                  # GraphQL Code Generator config
├── src/
│   ├── apollo-client.ts        # Apollo Client configuration
│   ├── types/
│   │   └── graphqlTypes.ts     # Auto-generated base types (do not edit)
│   └── queries/
│       ├── GetViewer.graphql   # GraphQL query definition
│       └── GetViewer.ts        # Auto-generated hooks (do not edit)
└── pages/
    └── _app.tsx                # App with ApolloProvider
```

## How to Use

### Writing GraphQL Queries

1. Create your GraphQL queries as `.graphql` files in the `src/queries/` directory:

```graphql
# src/queries/GetUser.graphql
query GetUser($login: String!) {
  user(login: $login) {
    name
    bio
    avatarUrl
  }
}
```

2. Run code generation:

```bash
npm run codegen
```

This will generate:

- `src/types/graphqlTypes.ts` - Base types from the GitHub schema (prefixed with `I`)
- `src/queries/GetUser.ts` - Typed hooks and types for your query

3. Use the generated hooks in your components:

```typescript
// pages/user.tsx
import { useGetUserQuery } from "../src/queries/GetUser";

export default function UserPage() {
  const { data, loading, error } = useGetUserQuery({
    variables: { login: "octocat" }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>{data?.user?.name}</h1>
      <p>{data?.user?.bio}</p>
    </div>
  );
}
```

### Configuration Highlights

Your custom codegen setup includes:

- **Type prefix**: All GitHub types are prefixed with `I` (e.g., `IUser`, `IRepository`)
- **Near-operation-file**: Generated files live next to your `.graphql` files
- **Custom scalars**: `ISO8601DateTime` mapped to `string`
- **Nullable types**: Using `T | null | undefined` for maybe values

### Example Queries

The project includes example queries:

- `src/queries/GetViewer.graphql` - Get authenticated user's information
- `src/queries/GetRepository.graphql` - Get repository details

Each `.graphql` file will generate a corresponding `.ts` file with:

- Type definitions (e.g., `IGetViewerQuery`, `IGetViewerQueryVariables`)
- React hooks (e.g., `useGetViewerQuery`, `useGetViewerLazyQuery`)
- GraphQL document (e.g., `GetViewerDocument`)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run codegen` - Generate TypeScript types from GraphQL queries
- `npm run codegen:watch` - Watch mode for code generation

## Apollo Client Configuration

The Apollo Client is configured in `src/apollo-client.ts` with:

- GitHub GraphQL API endpoint: `https://api.github.com/graphql`
- Authentication via Bearer token from environment variable
- In-memory cache

## GraphQL Schema

The codegen configuration is set to fetch the GitHub GraphQL schema directly from the URL: https://docs.github.com/public/fpt/schema.docs.graphql

### Using Remote URL (Current Setup - Recommended)

**Pros:**

- Always get the latest schema
- No need to maintain a local copy
- Smaller repository size

**Cons:**

- Requires network connection
- Slightly slower codegen (downloads schema each time)

### Alternative: Local Schema File

If you prefer to use a local schema file:

1. Download the schema:

```bash
curl -o schema.graphql https://docs.github.com/public/fpt/schema.docs.graphql
```

2. Update `codegen.ts`:

```typescript
schema: "./schema.graphql",  // instead of the URL
```

**Pros:**

- Faster builds (no network request)
- Works offline
- Version control of schema
- Consistent builds

**Cons:**

- Need to manually update schema
- Larger repository size (~1.4MB file)

## Resources

- [GitHub GraphQL API Documentation](https://docs.github.com/en/graphql)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [GraphQL Code Generator Documentation](https://the-guild.dev/graphql/codegen)
- [GitHub GraphQL Explorer](https://docs.github.com/en/graphql/overview/explorer)

## Troubleshooting

### TypeScript Errors

If you see TypeScript errors after adding new queries:

1. Run `npm run codegen` to regenerate types
2. Restart your IDE/TypeScript server

### Authentication Errors

If you get 401 errors:

1. Verify your token is correctly set in `.env.local`
2. Ensure your token has the required scopes
3. Check that the token hasn't expired

### GraphQL Errors

To test your queries:

- Use the [GitHub GraphQL Explorer](https://docs.github.com/en/graphql/overview/explorer)
- Check query syntax in the schema documentation
