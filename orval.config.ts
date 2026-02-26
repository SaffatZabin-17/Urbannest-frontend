import { defineConfig } from 'orval';

export default defineConfig({
  urbannest: {
    input: {
      target: 'https://backend.urbannest.website/api/v3/api-docs',
    },
    output: {
      target: './src/api/generated.ts',
      schemas: './src/api/model',
      client: 'fetch',
      override: {
        mutator: {
          path: './src/api/custom-fetch.ts',
          name: 'customFetch',
        },
      },
    },
  },
});
