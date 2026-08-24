# 🌿 RoadWatch - Git Workflow & Engineering Practices Guide

**Author:** Vidit Kochar  
**Project:** RoadWatch Civic Infrastructure System  
**Topic:** Version Control Protocols, Branching Strategy, Conventional Commits, and PR Review Cycles  

---

## 1. Branch Strategy (GitHub Flow + Feature Branching)

```
        +--------------------------------------------------------------------+
main    |  v1.0.0 (Release) ────────────────────────────────────────────────►|
        +-------▲────────────────────────────────────▲───────────────────────+
                │ Merge via PR                       │ Merge via PR
        +-------┴────────────────────────+   +-------┴───────────────────────+
feature |  feat/ai-structured-output     |   |  feat/postgres-sql-schema     |
branch  +--------------------------------+   +-------------------------------+
```

### Core Branch Conventions:
- `main`: Production-ready, deployed branch. Direct push is strictly blocked via branch protection.
- `develop` (Optional staging): Integration branch for testing pre-releases.
- `feat/<feature-name>`: Dedicated branch for new user-facing functionality (e.g. `feat/ai-triage`).
- `fix/<bug-description>`: Targeted bug fixes (e.g. `fix/multer-upload-error`).
- `docs/<doc-title>`: Documentation, architecture, and rubric files.
- `refactor/<module>`: Non-functional code architecture improvements.

---

## 2. Conventional Commits Standard

Every commit must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<optional scope>): <short imperative description>

[optional body]

[optional footer(s)]
```

### Commit Types:
| Type | Purpose | Example |
| :--- | :--- | :--- |
| `feat` | New feature or capability | `feat(ai): integrate openai structured json output triage` |
| `fix` | Bug fix in server or client | `fix(server): handle multer file size exception in errorHandler` |
| `docs` | Documentation and architecture changes | `docs(sql): add relational schema ER diagram and join catalog` |
| `refactor`| Code restructuring without behavior change | `refactor(client): convert createReport to use promisified gps` |
| `style` | Formatting, whitespace, UI tweaks | `style(badge): improve color contrast on dark backgrounds` |
| `test` | Adding or updating tests | `test(error): add unit test for AppError operational flag` |
| `chore` | Build scripts, dependencies, config | `chore(env): add centralized startup env validation module` |

---

## 3. Pull Request (PR) Lifecycle

1. **Create Branch**: `git checkout -b feat/your-feature-name`
2. **Commit Changes**: Use atomic, conventional commits with clear descriptions.
3. **Push to Remote**: `git push -u origin feat/your-feature-name`
4. **Open Pull Request**: Fill out the standardized Pull Request template with description, affected components, rubric traceability, and test verification.
5. **Review & Merge**: Require at least 1 peer approval and passing automated lint/build checks before squash-and-merging into `main`.
