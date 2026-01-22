# blocksuite AGENTS

## OVERVIEW
Nested monorepo for BlockSuite packages and AFFiNE editor components.

## STRUCTURE
```
packages/blocksuite/
└── packages/           # multiple packages with local vitest configs
```

## WHERE TO LOOK
- AFFiNE widgets/components: `packages/affine/`
- Shared libs: `packages/affine/shared` and `packages/affine/components`

## CONVENTIONS
- Tests via Vitest in package-level configs.

## ANTI-PATTERNS
- Avoid editing generated build outputs.
