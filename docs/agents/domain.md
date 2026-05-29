# Domain docs

Layout: **single-context** (one frontend repo of three — back, front, backoffice are separate repos).

## Files

| File | Purpose |
|------|---------|
| `CONTEXT.md` | Domain language, bounded contexts, key entities for VirtualPet-Web (frontend) |
| `docs/adr/` | Architectural Decision Records for this repo |

## Consumer rules

- Always read `CONTEXT.md` before making architectural suggestions or writing domain-facing code.
- Check `docs/adr/` for past decisions before proposing a change that touches architecture, routing, state management, or API integration.
- If `CONTEXT.md` doesn't exist yet, note that it's missing and suggest creating it before proceeding with architecture-sensitive tasks.
- This repo covers only the **frontend** (Next.js). Domain concepts for the backend or backoffice live in their respective repos.
