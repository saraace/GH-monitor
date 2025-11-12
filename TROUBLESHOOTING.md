# Troubleshooting Guide

## Common Issues and Solutions

### Generated Files Have Import Errors

**Symptoms:**

- TypeScript errors in generated `.ts` files
- Errors like: `Module has no exported member 'QueryHookOptions'`
- Errors about `useQuery`, `useLazyQuery` not existing

**Cause:** The codegen was generating imports from `@apollo/client/core` instead of `@apollo/client/react`.

**Solution:** This has been fixed in the config. If you see these errors:

1. Delete generated files: `rm -f src/queries/*.ts`
2. Regenerate: `npm run codegen`

The config now includes:

```typescript
apolloReactCommonImportFrom: "@apollo/client/react",
apolloReactHooksImportFrom: "@apollo/client/react"
```

### Suspense Query Type Errors with Required Variables

**Symptoms:**

- Type errors in `useXxxSuspenseQuery` when query has required variables
- Errors about incompatible variable types

**Cause:** Known issue with `@graphql-codegen/typescript-react-apollo` and suspense queries that have required variables.

**Solution:** Two options:

1. **Use regular hooks instead**: Use `useXxxQuery` or `useXxxLazyQuery`
2. **Disable suspense generation**: Set `withSuspenseQuery: false` in config

Currently using option 1 - suspense queries are generated but may have type issues. Use the standard query hooks for production code.

### Duplicate Operation Name Errors

**Symptoms:**

- Error: `There can be only one operation named "TransfixPRs"`
- Codegen fails with validation errors
- Error shows the same file path twice

**Causes:**

1. **Duplicate `documents` configuration** - Having documents declared both at the top level AND inside a generate block causes the same file to be
   loaded twice
2. Old generated `.ts` files containing embedded GraphQL queries conflict with `.graphql` files

**Solution:**

**For duplicate documents configuration:**

Make sure you only have ONE `documents` declaration in your `codegen.ts`:

```typescript
// ✅ CORRECT - documents at top level only
const config: CodegenConfig = {
  schema: "...",
  documents: ["src/**/*.graphql", "pages/**/*.graphql"],
  generates: {
    "./src": {
      preset: "near-operation-file",
      // ❌ NO documents here!
      presetConfig: { ... }
    }
  }
}
```

**For old generated files:**

```bash
rm -f src/queries/*.ts
npm run codegen
```

The config now includes `overwrite: true` to automatically overwrite existing files on each run.

### 401 Authentication Errors

**Symptoms:**

- GraphQL queries return 401 Unauthorized
- Error in browser console about authentication

**Solution:**

1. Verify `.env.local` exists with your token:
   ```
   NEXT_PUBLIC_GITHUB_TOKEN=your_token_here
   ```
2. Restart the dev server: `npm run dev`
3. Check token permissions at https://github.com/settings/tokens
4. Ensure token has `repo` and `read:user` scopes

### Types Not Updated After Changing Queries

**Symptoms:**

- TypeScript errors after modifying `.graphql` files
- IntelliSense showing old types

**Solution:**

1. Run codegen: `npm run codegen`
2. Restart TypeScript server in your IDE
   - VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
   - Cursor: Same as VS Code

For automatic regeneration during development:

```bash
npm run codegen:watch
```

### Cannot Find Module Errors

**Symptoms:**

- `Cannot find module '../src/queries/GetViewer'`
- Import errors for generated files

**Cause:** Generated files don't exist yet.

**Solution:**

```bash
npm run codegen
```

Make sure to run this after:

- Cloning the repository
- Creating new `.graphql` files
- Pulling changes that add new queries

### Schema Download Failures

**Symptoms:**

- Codegen fails with network errors
- Cannot fetch schema from URL

**Cause:** Network issues or GitHub schema endpoint unavailable.

**Solution:** Use a local schema file instead:

1. Download the schema once:

   ```bash
   curl -o schema.graphql https://docs.github.com/public/fpt/schema.docs.graphql
   ```

2. Update `codegen.ts`:

   ```typescript
   schema: "./schema.graphql"; // instead of URL
   ```

3. Commit `schema.graphql` to git

**Trade-off:** You'll need to manually update the schema periodically.

### Type Prefix Confusion

**Symptoms:**

- Not sure when to use `IUser` vs `User`
- Import errors for types

**Explanation:** All GitHub GraphQL schema types are prefixed with `I` in the generated TypeScript:

- GraphQL `User` → TypeScript `IUser`
- GraphQL `Repository` → TypeScript `IRepository`

This is configured via `typesPrefix: "I"` in `codegen.ts`.

**Solution:** Always use the `I` prefix when importing types:

```typescript
import { IGetViewerQuery } from "../src/queries/GetViewer";
```

## Getting Help

If you encounter other issues:

1. Check the official docs:

   - [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
   - [Apollo Client](https://www.apollographql.com/docs/react/)
   - [GitHub GraphQL API](https://docs.github.com/en/graphql)

2. Clear generated files and regenerate:

   ```bash
   rm -rf src/__generated__ src/queries/*.ts src/types/graphqlTypes.ts
   npm run codegen
   ```

3. Check for updates:
   ```bash
   npm outdated
   npm update
   ```

## Debug Mode

To see more details about codegen:

```bash
DEBUG=* npm run codegen
```

Or add to `codegen.ts`:

```typescript
{
  // ... config
  verbose: true,
  debug: true
}
```
