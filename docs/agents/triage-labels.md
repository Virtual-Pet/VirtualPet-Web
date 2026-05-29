# Triage labels

Label mapping for the `triage` skill state machine.

| Role | Label |
|------|-------|
| Maintainer needs to evaluate | `needs-triage` |
| Waiting on reporter | `needs-info` |
| Fully specified, AFK-agent ready | `ready-for-agent` |
| Needs human implementation | `ready-for-human` |
| Will not be actioned | `wontfix` |

## Creating labels in GitHub

If these labels don't exist yet, create them:

```bash
gh label create needs-triage    --color "#e4e669" --description "Maintainer needs to evaluate"
gh label create needs-info      --color "#d4c5f9" --description "Waiting on reporter"
gh label create ready-for-agent --color "#0075ca" --description "AFK-agent ready"
gh label create ready-for-human --color "#008672" --description "Needs human implementation"
gh label create wontfix         --color "#ffffff" --description "Will not be actioned"
```
