---
kind: recipe
capabilities: [CAP-16-010]
---
# Git workflow assistance

Help with day-to-day git work in the repository's branching model:
branches, commits, rebases, conflict resolution, and history cleanup.
Explain each command and the resulting state, keep both sides' intended
changes when resolving conflicts, and confirm before any destructive or
shared-history operation.

## Inputs

- The current state: `git status`, the current branch, upstream tracking,
  and recent history.
- The repository's branching model (trunk-based, GitHub flow, GitFlow,
  release branches) and conventions (commit message format, branch names,
  merge or rebase policy).
- The user's goal.

## Procedure

1. **Read the state first** with read-only commands (`git status`,
   `git log --oneline --graph -20`, `git branch -vv`, `git stash list`), and
   say what you see.
2. **Plan the commands** to reach the goal, with what each does and the
   expected resulting state. Prefer non-destructive options (new commits,
   `revert`, `--force-with-lease` over `--force`).
3. **Classify each command:**
   - **safe locally:** status, log, diff, branch creation, commit, stash,
     fetch;
   - **rewrites local history:** rebase, amend, reset of unpushed commits;
   - **affects others:** push, force-push, deleting remote branches,
     rewriting pushed history.

   Commit and push only when the user asked for them. Confirm before
   history rewrites, `reset --hard`, `clean -fd`, and anything that affects
   others, and create a backup ref first (for example a branch at the
   current commit).
4. **Resolve conflicts carefully:** read both sides and the common ancestor,
   understand each side's intent (from commit messages and the code), keep
   both intended changes, build and run the affected tests, then continue
   the merge or rebase.
5. **Follow the conventions:** commit message format, sign-off or signing
   requirements, and hooks. Never skip hooks or signing unless the user
   asks.
6. **Report the final state** with `git status` and the log, and how to undo
   (reflog or the backup ref).

## Outputs

- Commands to run with explanations, and the resulting state.
- A confirmation request before force-push, reset, or history rewrite,
  with the backup and undo path.

## Technology considerations

| Stack | Consideration |
|---|---|
| Git | `git switch` and `restore` (newer, clearer than `checkout`), `rebase --onto`, `rerere` for repeated conflicts, `--force-with-lease`, and `reflog` for recovery. |
| Hosting platforms | Protected branches and required reviews on GitHub, Azure DevOps, or GitLab; squash or merge policy set by the platform. |
| Lock files | Conflicts in `package-lock.json`, `pnpm-lock.yaml`, or `packages.lock.json` are resolved by regenerating with the package manager after resolving the manifest. |
| Generated files | Regenerate rather than hand-merge (EF Core model snapshots need care: resolve the migrations, then regenerate the snapshot if the project's practice allows). |

## Verification

- On a fixture with a conflict, the conflict is resolved keeping both
  intended changes, and the build and affected tests run afterwards, or
  NOT_RUN with the reason.
- No force-push, reset, or history rewrite happens without approval, and a
  backup ref exists before any rewrite.
- The final state is shown with `git status` and the log.
