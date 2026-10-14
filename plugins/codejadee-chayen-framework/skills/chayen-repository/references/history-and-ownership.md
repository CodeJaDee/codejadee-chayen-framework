---
kind: recipe
capabilities: [CAP-01-005, CAP-01-006]
---
# History and ownership

Use git history, read-only, to explain when and why code changed, which areas
churn, and who declares or demonstrates knowledge of an area. Commit identity
is evidence of activity, not of ownership. Ownership is reported only as
declared or as observed activity, never invented.

## Inputs

- A repository with git history.
  - Check `git rev-parse --is-shallow-repository`.
  - A shallow clone limits every result, so report it.
- The question:
  - a behaviour or line whose history is wanted;
  - a churn or co-change question for an area and time window;
  - an ownership or reviewer question for a path.
- Ownership declarations, if present:
  - `CODEOWNERS` (in `.github/`, the root, or `docs/`);
  - `OWNERS` files;
  - team fields in package metadata.

## Procedure

1. **Check that history is available:** `git log -1`, and the shallow check
   above. If history is absent or shallow, report it and stop at what is
   available.
2. **"When or why did X change".** Locate the change with read-only commands:
   - `git log --follow --oneline -- <path>` for a file;
   - `git log -S'<literal>' --oneline` (or `-G'<regex>'`) for when text
     appeared or disappeared;
   - `git log -L '<start>,<end>:<path>'` or `git blame -w -C -C -L
     <start>,<end> <path>` for specific lines.

   Then read the relevant commits with `git show <hash>`. Report the
   commit's own message and any linked issue or PR reference. Never invent a
   reason the commit does not state. If the reason is absent, say so.
3. **Do not use `git bisect`, `checkout`, or `stash`.** They change the
   working tree. If bisecting is needed, propose it, and run it only with
   the user's approval.
4. **Churn and co-change.**
   - Churn per file:
     `git log --since='<window>' --format= --name-only -- <area> | sort | uniq -c | sort -rn`.
   - Co-change: compare files that appear together in commits.
   - State the window and the commit count.
5. **Declared ownership.**
   - Parse `CODEOWNERS`: the last matching pattern wins.
   - Map each requested path to its declared owners.
   - Report paths with no matching rule as "no declared owner".
6. **Observed activity:**
   `git shortlog -sne --since='<window>' -- <path>`. Report the top
   contributors with their commit counts and the window. Label this
   "activity", never "owner".
7. **Reconcile.**
   - When the declared owners differ from the active contributors, report
     both side by side.
   - Note a bus-factor risk when one identity has made most of the recent
     commits to an area.

## Outputs

- **Timeline,** for "when or why":

  ```text
  | Date | Commit | Author (as recorded) | Message / linked issue | Relevant change |
  Reason stated in history: <quote> | not stated
  ```

- **Churn table:** file or area, commit count, window. Co-change pairs with
  counts.
- **Ownership table:**

  ```text
  | Path / area | Declared owner (source) | Active contributors (window, commits) | Notes (no declared owner, bus factor) |
  ```

- **Limitations:** shallow clone, history rewritten, squash merges hiding
  detail, or mirrored history.

## Technology considerations

Stack-neutral. The procedure uses git only.

- **Generated files and lock files** (EF Core migrations' `*.Designer.cs`,
  `package-lock.json`, `pnpm-lock.yaml`, `poetry.lock`) inflate churn.
  Exclude them, and say so.
- **Renamed files** need `--follow`. Large reformat commits distort blame, so
  use `-w` and `-C`.
- A `.git-blame-ignore-revs` file, if present, should be honoured with
  `--ignore-revs-file`.

## Verification

- Every timeline row cites a commit hash, and every churn or activity figure
  states the command and the window.
- Ownership appears only as "declared (source file)" or "activity (window)".
  No row asserts ownership without a declaration.
- The stated reasons are quotes from commit messages or linked references,
  or "not stated".
- The working tree and HEAD are unchanged: `git status` and
  `git rev-parse HEAD` are the same before and after.
