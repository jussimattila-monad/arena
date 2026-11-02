# arena

Browser-only game prototype. Aurelia 2 (`2.0.0-rc.2`) + TypeScript + Vite. No server
component. This is prototype code, so favour clarity and speed of iteration over
completeness, but keep the structure clean enough that the game can grow.

Live site: https://jussimattila-monad.github.io/arena/

## Commands

```bash
npm run dev        # dev server at http://localhost:9000/arena/
npm run lint       # eslint (ts) + stylelint (css)
npm run typecheck  # tsc --noEmit
npm run build      # typecheck + production build into dist/
npm run preview    # serve dist/ at http://localhost:4173/arena/
```

Run `npm run lint && npm run build` before every commit. Both must pass.

## Workflow

- Commit directly to `main`. Every push to `main` is built and deployed to GitHub
  Pages by `.github/workflows/deploy.yml`, and changes are tested against the live site.
- Do not write a test suite. Add a test only when it is the quickest way to confirm
  something works while developing (e.g. tricky game rules), and keep it small.
- Vite `base` is `/arena/` in every mode. Reference static assets through Vite
  (imports or `public/`), never with absolute paths like `/img/x.png`.

## Code structure

```
src/
  main.ts            # bootstrap only: register plugins/resources, start the app
  my-app.ts/.html    # root component: layout and top-level wiring, no game logic
  components/        # UI custom elements, one folder or file group per element
  game/              # pure TypeScript game logic: state, rules, simulation
  services/          # DI singletons bridging game and UI (game loop, input, audio, storage)
  assets/            # images, sounds, data imported through Vite
```

Create folders as they are needed; don't scaffold empty ones.

### Separate game logic from the UI

- `src/game/` has no Aurelia or DOM imports. It holds plain classes and functions
  that take state in and return state (or mutate a clearly owned model). This keeps
  the rules easy to reason about and easy to test in isolation if ever needed.
- Components render state and forward user intent. They don't decide game outcomes.
- Time-based updates (the game loop, `requestAnimationFrame`) live in one service,
  not scattered across components.

### Aurelia conventions

- Convention pairs: `foo-bar.ts` exports `class FooBar` and sits next to
  `foo-bar.html` (and optional `foo-bar.css`). The element is `<foo-bar>`.
- File and element names are kebab-case; classes are PascalCase.
- Use `resolve()` from `aurelia` for dependency injection in field initializers:
  `private readonly game = resolve(GameService);`
- Shared services are singletons via `DI.createInterface` or `@singleton()`.
- Pass data down with `@bindable`; pass events up with callbacks (`.call` / bound
  functions) or an `IEventAggregator`, not by reaching into parent components.
- Keep templates declarative. Move anything beyond simple expressions into getters
  or methods on the view model.
- Clean up in `detaching()`/`unbinding()`: cancel animation frames, timers and
  event listeners you created.

### TypeScript

- Prefer explicit types on public members and function signatures. Avoid `any`;
  use `unknown` and narrow it.
- Prefer `readonly` and `const`. Keep functions small and named for what they do.
- Use string literal unions or `const` objects instead of magic strings and numbers.
  Put tunable game constants (speeds, sizes, timings) in one place, e.g.
  `src/game/config.ts`.
- Keep comments for the *why*. Don't restate what the code says.

## Commit messages

Use a short imperative subject line, a blank line, then a body explaining *why*.

```
Add player movement with arrow keys

Movement is handled in the input service and applied to the game state
once per frame, so the rendering components stay free of input logic.
```

- Subject: imperative mood ("Add", "Fix", "Refactor", not "Added"/"Adds"),
  50 characters or fewer if possible, capitalised, no trailing period.
- Body: wrap at 72 characters. Explain the motivation and any non-obvious
  trade-offs. Skip the body only for trivial changes.
- One logical change per commit. Don't mix refactoring with behaviour changes.
- Reference issues where relevant: `Fixes #12`, `Refs #7`.
