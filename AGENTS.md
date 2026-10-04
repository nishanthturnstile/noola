# Noola agent instructions

Before scaffolding or creating, editing, moving or reviewing application source, tests, migrations or build/tooling configuration, load [noola-code-structure](.agents/skills/noola-code-structure/SKILL.md). Its conventions apply to this repository. Documentation-only work uses [the documentation guide](docs/README.md).

The [technology stack](docs/TECH-STACK.md) owns library selections and their status; [architecture](docs/ARCHITECTURE.md) owns system boundaries. Code placement and coding standards belong in the skill. Preserve existing user changes and keep work within the requested feature/phase.

## Development preferences

- Prefer Biome for supported languages. Pin `@biomejs/biome` and commit `biome.json` when setting up project tooling.
- Respect existing tooling unless a migration is requested. Use another tool for unsupported languages or necessary project rules; avoid multiple formatters on the same files.
- Run `python3 scripts/check_docs.py` after documentation edits. Discover application checks from actual manifests/configuration and report unavailable checks honestly.
