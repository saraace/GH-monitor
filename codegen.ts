import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://docs.github.com/public/fpt/schema.docs.graphql",
  documents: ["src/**/*.graphql", "pages/**/*.graphql"],
  overwrite: true,
  generates: {
    "./src/types/graphqlTypes.ts": {
      plugins: [
        {
          add: {
            content: `
              /* eslint-disable */

              /**
                * Hold up. This was auto-generated. You knew that.
                */
            `
          }
        },
        "typescript"
      ],
      config: {
        maybeValue: "T | null | undefined",
        preResolveTypes: false,
        scalars: {
          ISO8601DateTime: "string"
        },
        typesPrefix: "I",
        namingConvention: {
          enumValues: "keep"
        }
      }
    },
    "./src": {
      preset: "near-operation-file",
      presetConfig: {
        baseTypesPath: "types/graphqlTypes.ts",
        extension: ".ts"
      },
      plugins: [
        {
          add: {
            content: `/* eslint-disable */

              /**
               * This was auto-generated, girl. Don't touch it.
               */
            `
          }
        },
        "typescript-operations",
        "typescript-react-apollo"
      ],
      config: {
        maybeValue: "T | null | undefined",
        preResolveTypes: false,
        scalars: {
          ISO8601DateTime: "string"
        },
        typesPrefix: "I",
        namingConvention: {
          enumValues: "keep"
        },
        apolloReactCommonImportFrom: "@apollo/client/react",
        apolloReactHooksImportFrom: "@apollo/client/react",
        addDocBlocks: true,
        withHooks: true,
        withComponent: false,
        withHOC: false,
        withMutationFn: false,
        withRefetchFn: false,
        withSuspenseQuery: false
      }
    }
  },
  ignoreNoDocuments: true
};

export default config;
