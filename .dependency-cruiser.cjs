module.exports = {
  forbidden: [
    {
      name: "production-cannot-import-experiments",
      severity: "error",
      from: { path: "^(apps/(api|web)/src|packages/)" },
      to: { path: "^apps/api/experiments/" },
    },
    {
      name: "browser-no-node",
      severity: "error",
      from: {
        path: "^(apps/web/src|packages/api-client/src|packages/contracts/src)",
      },
      to: { dependencyTypes: ["core"] },
    },
    { name: "no-cycles", severity: "error", from: {}, to: { circular: true } },
    {
      name: "browser-cannot-import-server",
      severity: "error",
      from: {
        path: "^(apps/web|packages/api-client|packages/contracts/src/health)",
      },
      to: {
        path: "^(apps/api)|node_modules/(?:\\.pnpm/)?(?:pg|drizzle-orm|@hono)(?:@|/)",
      },
    },
    {
      name: "contracts-independent",
      severity: "error",
      from: { path: "^packages/contracts" },
      to: { path: "^(apps/|packages/api-client)" },
    },
    {
      name: "backend-independent",
      severity: "error",
      from: { path: "^apps/api" },
      to: { path: "^(apps/web|packages/api-client)" },
    },
    {
      name: "contracts-no-node",
      severity: "error",
      from: { path: "^packages/contracts/src" },
      to: { dependencyTypes: ["core"] },
    },
    {
      name: "ui-independent",
      severity: "error",
      from: { path: "^apps/web/src/components/ui" },
      to: { path: "apps/web/src/(features|routes)|packages/api-client" },
    },
    {
      name: "domain-no-http",
      severity: "error",
      from: { path: "^apps/api/src/modules" },
      to: {
        path: "apps/api/src/http|node_modules/(?:\\.pnpm/)?(?:hono|@hono)(?:@|/)",
      },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: "(dist|routeTree.gen|schema.d.ts)",
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.boundaries.json" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["types", "import", "default"],
    },
  },
};
