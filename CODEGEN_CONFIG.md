# GraphQL Codegen Configuration

Your custom GraphQL Code Generator setup uses the **near-operation-file** preset with several customizations.

## Configuration Overview

### Two Generation Targets

#### 1. Base Types (`./src/types/graphqlTypes.ts`)

Generates TypeScript types for the entire GitHub GraphQL schema.

**Plugins:**

- `add` - Adds custom header comment
- `typescript` - Generates TypeScript types from schema

**Config:**

- `typesPrefix: "I"` - All types prefixed with `I` (e.g., `IUser`, `IRepository`)
- `maybeValue: "T | null | undefined"` - Explicit nullable handling
- `scalars.ISO8601DateTime: "string"` - Maps GitHub's datetime to string
- `namingConvention.enumValues: "keep"` - Preserves original enum values

#### 2. Operation Files (`./src`)

Generates operation-specific types and hooks next to your `.graphql` files.

**Preset:** `near-operation-file`

- Looks for `**/*.graphql` files
- Generates `.ts` file next to each `.graphql` file
- References base types from `types/graphqlTypes.ts`

**Plugins:**

- `add` - Custom header
- `typescript-operations` - Operation types
- `typescript-react-apollo` - React hooks

**Important Config:**

- `apolloReactCommonImportFrom: "@apollo/client/react"` - Import Apollo from React package
- `apolloReactHooksImportFrom: "@apollo/client/react"` - Import hooks from React package
- `withHooks: true` - Generate React hooks
- `withSuspenseQuery: false` - Disabled due to type conflicts with required variables

**Generated for each query:**

- Type definitions (e.g., `IGetViewerQuery`, `IGetViewerQueryVariables`)
- React hooks:
  - `useXxxQuery()` - Standard query hook
  - `useXxxLazyQuery()` - Lazy query hook
  - `useXxxSuspenseQuery()` - Suspense query hook (may have type issues with required variables)
- GraphQL document (e.g., `GetViewerDocument`)

## File Structure

```
src/
├── types/
│   └── graphqlTypes.ts          # Base types (all GitHub types)
└── queries/
    ├── GetViewer.graphql        # Your query definition
    ├── GetViewer.ts            # Generated hooks ⚡
    ├── GetRepository.graphql
    └── GetRepository.ts        # Generated hooks ⚡
```

## Usage Pattern

### 1. Write a `.graphql` file

```graphql
# src/queries/GetUserRepos.graphql
query GetUserRepos($login: String!) {
  user(login: $login) {
    repositories(first: 10) {
      nodes {
        name
        stargazerCount
      }
    }
  }
}
```

### 2. Run codegen

```bash
npm run codegen
```

### 3. Import and use the hook

```typescript
import { useGetUserReposQuery } from "../src/queries/GetUserRepos";

const { data, loading, error } = useGetUserReposQuery({
  variables: { login: "octocat" }
});
```

## Type Prefix Convention

All GitHub schema types are prefixed with `I`:

| Schema Type   | Generated Type |
| ------------- | -------------- |
| `User`        | `IUser`        |
| `Repository`  | `IRepository`  |
| `Issue`       | `IIssue`       |
| `PullRequest` | `IPullRequest` |

Query and mutation types also get the prefix:

- `GetViewerQuery` → `IGetViewerQuery`
- `GetViewerQueryVariables` → `IGetViewerQueryVariables`

## Custom Scalars

The configuration maps GitHub's custom scalars to TypeScript types:

- `ISO8601DateTime` → `string`

You can add more scalar mappings in the `config.scalars` section.

## Benefits of This Setup

✅ **Colocation**: Generated hooks live next to your queries ✅ **Type Safety**: Full TypeScript support with interface prefix ✅ **Multiple Hooks**:
Get standard, lazy, and suspense query hooks ✅ **Explicit Nullability**: Clear handling of nullable fields ✅ **Consistent Naming**: `I` prefix
distinguishes generated types

## Plugins Used

| Plugin                                        | Purpose         |
| --------------------------------------------- | --------------- |
| `@graphql-codegen/cli`                        | Core CLI        |
| `@graphql-codegen/typescript`                 | Schema types    |
| `@graphql-codegen/typescript-operations`      | Operation types |
| `@graphql-codegen/typescript-react-apollo`    | React hooks     |
| `@graphql-codegen/add`                        | Custom headers  |
| `@graphql-codegen/near-operation-file-preset` | File colocation |

## Customization

To modify the configuration, edit `codegen.ts`:

- Change type prefix: `typesPrefix: "T"` or `typesPrefix: ""`
- Add more scalars: `scalars: { DateTime: "Date", ... }`
- Change output location: `baseTypesPath: "..."`
- Modify naming: `namingConvention: { ... }`

After changes, run `npm run codegen` to regenerate.
