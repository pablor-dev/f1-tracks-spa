# AGENTS.md

## Scope

These rules apply to the entire repository. Every agent or contributor working on this project must follow them.

## Product Context

- The product is a Single Page Application (SPA).
- The frontend is built with React and TypeScript.
- This is an experimental test project for evaluating an agile approach to web application development with artificial intelligence models.
- The application focuses on current Formula 1 circuits.
- Architecture, dependency, and project structure decisions must be compatible with this stack.

## Architecture and Organization

- Apply Screaming Architecture: the project structure must communicate the product domain and features rather than framework details.
- Organize code primarily by domain or feature. Avoid a global structure based only on technical categories such as `components`, `hooks`, `services`, or `utils`.
- Keep each feature's components, hooks, types, state, tests, and feature-specific utilities close together.
- Move code into shared areas only when it is genuinely reused across features.
- Design the interface with Atomic Thinking: build small, focused pieces that can be progressively composed into more complex components and views.
- Favor reusable and composable components with clear responsibilities and small, explicit prop APIs.
- Avoid premature abstractions. Do not create shared components or generic layers based only on possible future reuse.
- The project will use a component library. Do not select or install one until the project owner specifies which library to use.

## State and Data

- Use React's native APIs for state and basic contexts.
- Create a context only when state must be shared between distant components and props or composition are insufficient.
- Keep state as close as possible to the components that consume it.
- Do not add external state-management libraries without a demonstrated need and approval from the project owner.
- The application will not connect to a backend during its initial stage.
- Keep local data, mocks, and adapters separate from presentation code so a future integration can be added without coupling components to a specific data source.

## Responsive Design

- All development and design must follow a Mobile First approach.
- The experience must be fully responsive across the three primary device groups: mobile phones, tablets, and desktop computers.
- Define the experience for the smallest screen first, then enhance it progressively through breakpoints.
- Do not accept layouts that depend on fixed widths or cause horizontal overflow at supported sizes.
- Use flexible layout patterns and units, responsive images, and controls suitable for touch interaction.
- Verify representative mobile, tablet, and desktop states before considering a visual task complete.
- Preserve hierarchy, readability, navigation, and functionality at every size; responsiveness must not be limited to scaling elements.

## Interaction and Experience Design

- The SPA must provide a highly interactive, dynamic experience suited to exploring Formula 1 circuits.
- Interaction must support the content and user goals. Avoid animation, motion, or visual effects that do not add meaningful feedback or understanding.
- Every interactive element must provide clear default, hover, focus, active, disabled, loading, empty, and error states when applicable.
- Keep interactions predictable and provide immediate, understandable feedback after user actions.
- Prefer progressive disclosure over presenting all circuit information at once.
- Respect reduced-motion preferences and ensure that the experience remains fully usable without animation.
- When a relevant design skill or design-focused workflow is available, use it to guide interface work while still following the rules in this document.

## Design System and Tailwind CSS

- Tailwind CSS is the styling foundation for the application and its design system.
- Define and reuse design tokens for color, typography, spacing, sizing, radii, shadows, breakpoints, and motion.
- Store shared tokens in the Tailwind theme or the project's CSS token layer instead of scattering arbitrary values throughout components.
- Prefer established utilities and semantic component variants over arbitrary values and one-off styles.
- Build all components from the same visual language and interaction patterns.
- Reuse design-system primitives before creating feature-specific alternatives.
- Add a new token or variant only when an existing one cannot express a demonstrated product requirement.
- Keep styling colocated with component implementation where practical, while keeping global tokens and base styles centralized.
- Do not introduce another styling framework or competing component styling system without explicit approval from the project owner.
- Document reusable component variants and states as the design system evolves.

## Accessibility

- Treat accessibility as a completion requirement, not a later enhancement.
- Use semantic HTML and native browser behavior before adding custom roles or scripted interaction.
- Ensure that every interactive flow is fully operable with a keyboard.
- Provide visible focus indicators and a logical focus order.
- Give controls accessible names and provide text alternatives for meaningful non-text content.
- Maintain sufficient color contrast and never rely on color alone to communicate meaning or state.
- Associate form controls with labels and expose validation and error feedback to assistive technologies.
- Use ARIA only when native semantics are insufficient, and keep ARIA states synchronized with the interface.
- Preserve usability at browser zoom and across supported viewport sizes.
- Include relevant automated accessibility checks and perform keyboard-focused manual verification for interactive work.

## Clean Code and Engineering Quality

- Prefer clear, intention-revealing names and small units with a single responsibility.
- Keep domain logic separate from rendering and presentation concerns.
- Favor composition over complex conditional components and deep inheritance-like patterns.
- Avoid duplicated logic, hidden side effects, unnecessary dependencies, and speculative abstractions.
- Keep TypeScript types explicit at public boundaries and avoid `any` unless a documented constraint makes it unavoidable.
- Design classes, interfaces, type aliases, and domain models to be modular and reusable when they represent genuinely shared concepts.
- Keep feature-specific types inside their feature and promote them to shared modules only when multiple domains depend on the same contract.
- Prefer small, composable types over large multipurpose models, and derive related types from a single source of truth when practical.
- Avoid duplicating domain contracts or coupling reusable types to presentation details.
- Handle loading, empty, success, and error states explicitly whenever data or asynchronous behavior is involved.
- Add or update tests for behavior that is introduced or changed.
- Leave code easier to understand and maintain than it was before the change.

## Package Management

- Use `pnpm` as the only package manager for this repository.
- Do not use `npm`, `npx`, Yarn, or another package manager for installing dependencies or running project scripts.
- Commit and maintain `pnpm-lock.yaml` as the single dependency lockfile.
- Do not create or commit `package-lock.json`, `yarn.lock`, or lockfiles from other package managers.
- Run package binaries and one-off tools through `pnpm exec` or `pnpm dlx`, as appropriate.
- Keep the `packageManager` field in `package.json` aligned with the pnpm version adopted by the project.

## Testing and Quality Gates

- Add unit tests for business logic, hooks, utilities, and component behavior introduced or changed by a task.
- Test observable behavior and user outcomes rather than internal implementation details.
- Keep tests deterministic, isolated, readable, and colocated with the relevant feature when practical.
- Reuse test builders, fixtures, and helpers when they express genuinely shared testing concepts.
- Include accessibility-focused assertions for interactive components when supported by the selected testing tools.
- Before delivering any feature, run the complete unit test suite, the linter, and the production build.
- A feature is not ready for delivery if tests fail, the linter reports errors, or the production build fails.
- Do not suppress lint, type, test, or build errors merely to make a quality gate pass; fix the underlying cause or document a justified exception for owner approval.
- Report the exact checks executed and their results in the Pull Request.

## Continuous Learning

- When a task reveals a reusable project-specific lesson, constraint, convention, or best practice, add it to this `AGENTS.md` file.
- Record only guidance that is validated and broadly useful for future work; do not add temporary debugging notes or task-specific implementation details.
- Place new guidance in the most relevant existing section and avoid duplicating or contradicting current rules.
- If a new lesson would materially change architecture, dependencies, workflow, or product behavior, obtain approval from the project owner before adopting it as a rule.
- Keep this document in English whenever it is updated.

## Git Workflow

The repository uses an adaptation of Git Flow centered on the `main` and `dev` branches.

### Permanent Branches

- `main` represents the stable or production version.
- `dev` is the integration branch and the mandatory base for daily work.
- Do not create Pull Requests targeting `main` or integrate changes into `main` unless the project owner explicitly requests it.
- Do not commit or push directly to `main` or `dev`.

### Work Branches

- Create every feature, enhancement, fix, or task branch from an up-to-date `dev` branch.
- Use lowercase, descriptive branch names separated by hyphens.
- Use the prefix that corresponds to the type of work:
  - `feature/<description>` for new functionality.
  - `enhance/<description>` for improvements to existing functionality.
  - `fix/<description>` for bug fixes.
  - `delete/<description>` for the deliberate removal of code or functionality.
  - `refactor/<description>` for internal changes that do not alter expected behavior.
  - `docs/<description>` for documentation.
  - `test/<description>` for tests.
  - `chore/<description>` for maintenance, configuration, or supporting tasks.

### Commits

- Record changes in small, coherent, focused commits.
- Every commit message must follow the `<type>: <description>` format.
- Allowed types are `feat`, `enhance`, `fix`, `delete`, `refactor`, `docs`, `test`, `chore`, `build`, `ci`, and `perf`.
- Write the description in the imperative mood. Keep it specific and representative of the change.
- Do not mix unrelated changes in one commit.

Examples:

```text
feat: add circuit search
enhance: improve responsive navigation
fix: prevent duplicate race requests
delete: remove deprecated standings view
```

### Pull Requests

- Every change must enter through a Pull Request; direct integration is not allowed.
- The default target for every work branch is `dev`.
- Create a Pull Request targeting `main` only when the project owner explicitly requests it.
- Every Pull Request must explain its purpose, summarize the changes, and describe the checks performed.
- No agent may approve or merge a Pull Request.
- All Pull Requests must remain pending for the project owner's review, approval, and merge decision.
- If a Pull Request requires changes, continue working on the same branch and update it with additional commits.

## Task Completion Rule

A task is ready for review when:

1. The requested change is complete.
2. Unit tests pass.
3. The linter completes without errors.
4. The production build completes successfully.
5. Any other relevant checks pass.
6. Changes are organized into commits that follow the established naming convention.
7. The branch is published to the remote repository.
8. A Pull Request targeting `dev` has been created, unless explicitly instructed otherwise.
9. The Pull Request is available for the project owner to audit and decide whether to merge.
