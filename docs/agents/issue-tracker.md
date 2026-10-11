# Issue tracker: GitHub

Issues and specs for this project live in GitHub Issues at https://github.com/Cemvegas/whitekeys-live12.

Use the `gh` CLI. Always specify `--repo Cemvegas/whitekeys-live12` for issue operations. White Keys is the single source checkout and Git root. Run source Git operations at this project root.

## Conventions

- Create an issue: `gh issue create --repo Cemvegas/whitekeys-live12 --title "..." --body-file <file>`.
- Read an issue: `gh issue view <number> --repo Cemvegas/whitekeys-live12 --comments --json number,title,body,labels,comments`.
- List issues: `gh issue list --repo Cemvegas/whitekeys-live12 --state open --json number,title,body,labels,comments`, with appropriate label/state filters.
- Comment: `gh issue comment <number> --repo Cemvegas/whitekeys-live12 --body-file <file>`.
- Apply/remove labels: `gh issue edit <number> --repo Cemvegas/whitekeys-live12 --add-label "..."` / `--remove-label "..."`.
- Close: `gh issue close <number> --repo Cemvegas/whitekeys-live12 --comment "..."`.
- For multiline bodies and comments, write exact text to a temporary file and pass `--body-file`.
- Link a child as a sub-issue through GitHub's API: fetch the child's numeric database id with `gh api repos/Cemvegas/whitekeys-live12/issues/<child> --jq .id`, then use `gh api --method POST repos/Cemvegas/whitekeys-live12/issues/<parent>/sub_issues -F sub_issue_id=<child-database-id>`. If unavailable, put `Part of #<parent>` at the top of the child body and add the child to a task list in the parent.

## Pull requests as a triage surface

**PRs as a request surface: no.**

GitHub issues and pull requests share a number space. Resolve a bare number as an issue or PR before applying workflow actions.

## When a skill says "publish to the issue tracker"

Create a GitHub issue in `Cemvegas/whitekeys-live12`.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --repo Cemvegas/whitekeys-live12 --comments`.

## Wayfinding operations

- Map: a single issue labelled `wayfinder:map`, holding the Notes / Decisions-so-far / Fog body.
- Child ticket: a GitHub sub-issue linked to the map. Where sub-issues are unavailable, use a task list in the map and `Part of #<map>` in the child. Labels are `wayfinder:<type>` (`research`, `prototype`, `grilling`, `task`). Assign a claimed ticket to the driving developer.
- Blocking: use native GitHub issue dependencies. Fetch the blocker's numeric database id, then `gh api --method POST repos/Cemvegas/whitekeys-live12/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-database-id>`. Use `issue_dependencies_summary.blocked_by` to count open blockers. If unavailable, use a `Blocked by: #<n>, #<n>` line; the ticket is unblocked when all blockers are closed.
- Frontier: list the map's open children, discard tickets with open blockers or an assignee; first in map order wins.
- Claim: `gh issue edit <number> --repo Cemvegas/whitekeys-live12 --add-assignee @me`, before starting ticket work.
- Resolve: comment with the answer, close the ticket, then append a context pointer (gist and link) to Decisions-so-far in the map.
