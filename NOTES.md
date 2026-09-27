> **Merge note:** this file was merged from your uploaded, partially-hand-fixed zip (which already had real selector fixes in `admin/overview.page.ts` and `admin-specs/overview.spec.ts` — those were kept as-is, untouched) plus the pieces that were still missing: `movieDetail.page.ts`, `theatre/register.page.ts`, `theater-specs/register.spec.ts`, and the whole `user-specs/testcase-sheet/` folder (83 tests 1:1 mapped to `testcases_markmyseat_en.xlsx`). `pageFixture.ts`, `booking.page.ts`, `home.page.ts`, `login.page.ts` got additive-only patches (new locators appended, nothing removed or overwritten).

# NOTES — Newly Added Playwright Test Scripts

## What was added
- 21 new Page Objects: `tests/pageObjects/pages/customer/*`, `pages/theatre/*`, `pages/admin/*`
- 20 new spec files: `tests/specs/user-specs/*`, `specs/theater-specs/*`, `specs/admin-specs/*`
- 85 new tests, mapped to TC IDs from the test case sheet (USR-*, THR-*, SA-*)
- `login.page.ts` — added `loginAsUser()/loginAsTheatre()/loginAsAdmin()` helpers
- `home.page.ts` — added search/filter/movie-card/book-now helpers
- `pageFixture.ts` — rewritten to register all new page objects
- Removed `tests/example.spec.ts` (Playwright boilerplate, unrelated to this project)

## IMPORTANT BUG FOUND & FIXED (environment, not code)
Running `npx playwright test --list` failed with:
`"Playwright Test did not expect test.describe() to be called here... two different versions of @playwright/test"`
— **even on the original, untouched code** (just `login.spec.ts`).

Root cause: `npx playwright` was resolving to a **global** Playwright install
(`/home/claude/.npm-global/lib/node_modules/playwright`, v1.56.0) instead of the
**local** one in `node_modules` (v1.62.1) — likely because `node_modules/.bin/playwright`
lost its executable bit, or because there is a Playwright installed via `npm i -g` on
your machine too. Two different Playwright Test runtime instances load `@playwright/test`
independently → the "did not expect test.describe()" error.

**Fix / how to always run correctly:**
```bash
chmod +x node_modules/.bin/*
npx --no-install playwright test        # forces the local install
# or simply:
./node_modules/.bin/playwright test
```
If you still hit this on your machine, run `npx playwright --version` and compare it to
`cat node_modules/@playwright/test/package.json | grep version` — they must match.
Consider uninstalling the global copy: `npm uninstall -g playwright`.

## Why locators use role/text matching instead of exact selectors
The sandbox used to write this code has no network access and cannot render the live
JS app, so exact DOM structure (class names, `data-testid`s, exact button labels) could
not be inspected. Every locator that isn't 100% certain is written to be resilient
(`getByRole`, `getByText` with case-insensitive regex) and is flagged with
`// ASSUMPTION` in the source. **You have real test accounts — please run each spec file
against the live app and fix the flagged locators; that's the fastest path to green tests.**

## Route assumptions to verify
| Page | Assumed route | Where used |
|---|---|---|
| Register | `/register` | `register.page.ts` |
| Booking History | `/bookings` | `bookingHistory.page.ts` |
| Profile | `/profile` | `profile.page.ts` |
| Verify Booking | `/verify-booking` | `verifyBooking.page.ts` |
| Booking Detail | `/bookings/:id` | `bookingDetail.spec.ts` (access-control test) |
| Theatre dashboard | `${TB_BASE_URL_THEATRE}/dashboard` | matches pattern already used in `login.spec.ts` TC09 |
| Admin dashboard | `${TB_BASE_URL_ADMIN}/dashboard` | matches pattern already used in `login.spec.ts` TC08 |
| Theatre sub-pages (Movies/Bookings/Food Menu/Screens) | reached via sidebar **nav link click** from Overview, not a hardcoded URL | `overview.page.ts` → `nav.*` |
| Admin sub-pages (Users/Theatres/Bookings/Movies) | same — via sidebar nav link click from Overview | `overview.page.ts` → `nav.*` |
| Booking flow (Date/Showtime/Seat, Food/Summary/Payment) | **no URL assumed** — driven via UI: Home → click movie card → "Book Now" → ... | `booking.spec.ts`, `confirmBooking.spec.ts` |

## Tests marked `test.skip(...)` on purpose
Several tests skip themselves at runtime (not hard-coded skip) when the current data
doesn't support the scenario, e.g.:
- No booked/sold-out seat exists yet to test "click a booked seat"
- No pending theatre exists to test Approve/Reject
- `USR-VERIFY-01` needs a **real, valid booking code** — replace the placeholder
  `'REPLACE-WITH-REAL-CODE'` in `verifyBooking.spec.ts` and `theater-specs/bookings.spec.ts`
  once you have one from your seeded test data, then remove `test.skip(...)`.

## Suggested next steps
1. Run `./node_modules/.bin/playwright test --headed --debug` on one spec file at a time
   (start with `user-specs/register.spec.ts`, it's self-contained) to see the real DOM
   in the Playwright Inspector and correct locators quickly.
2. Once real `data-testid` attributes are confirmed (or added to the app), replace the
   guessed CSS/role selectors — they're all centralized in the Page Object files, so
   fixing them there fixes every test that uses them.
3. Consider adding a `tests/common/auth.ts` with Playwright's `storageState` pattern to
   log in once per role and reuse the session across tests (faster than logging in
   inside every `beforeEach`).

---

## UPDATE — 1:1 coverage of `testcases_markmyseat_en.xlsx` ("Automated: Yes" rows)

A full audit was run against the uploaded `testcases_markmyseat_en.xlsx`: every row with
`Automated = Yes` (83 rows total) is now implemented as its own `test()`, with the test
title starting with the exact TC ID from that file, under:

```
tests/specs/user-specs/testcase-sheet/
├── home.spec.ts            (19 tests — sheet "Home")
├── movieDetail.spec.ts     (11 tests — sheet "Movie Detail")
├── seatSelection.spec.ts   (12 tests — sheet "Seat Selection")
├── checkout.spec.ts        (14 tests — sheet "Checkout")
├── loginRegister.spec.ts   (13 tests — sheet "Login-Register")
├── profile.spec.ts         (10 tests — sheet "Profile")
└── crossCutting.spec.ts    (4 tests  — sheet "Cross-cutting")
```
**Total: 83/83 "Automated: Yes" test cases from the sheet now have a corresponding script.**

Rows with `Automated = No` in the sheet were intentionally **not** turned into
`test()` blocks (per the sheet's own classification — security/injection, timing-based,
concurrency, and cross-browser-matrix cases are meant for manual/exploratory testing).
Each spec file lists exactly which TC IDs were left out and why, in a comment at the top.

New supporting pieces added for this pass:
- `tests/pageObjects/pages/customer/movieDetail.page.ts` — new Page Object (Movie Detail
  sheet had no page object before).
- Extended `home.page.ts`: logo, nav menu, login/register buttons, user avatar, footer.
- Extended `login.page.ts`: show/hide password toggle, forgot-password link.
- Extended `booking.page.ts`: seat legend, back button.
- Registered `movieDetailPage` in `pageFixture.ts`.

### Note on the two spec "layers" now in the project
- `tests/specs/user-specs/*.spec.ts` (the ones without the `testcase-sheet/` folder) —
  hand-crafted around the **USER/THEATRE/SUPERADMIN sitemap** you gave earlier (uses IDs
  like `USR-HOME-01`), covering flows the older xlsx didn't include at all (Confirm
  Booking's Food step, Success/E-ticket, Booking History/Detail as dedicated pages, Verify
  Booking, and the entire THEATRE/SUPERADMIN admin panels).
- `tests/specs/user-specs/testcase-sheet/*.spec.ts` — **exact 1:1 mirror** of the xlsx you
  uploaded (uses the sheet's own IDs like `HOME-01`, `DETAIL-01`, `SEAT-01`, `PAY-01`,
  `AUTH-01`, `PROFILE-01`, `GEN-01`).

There's some intentional overlap between the two layers (e.g. both have a "search movie"
test) since the two source documents describe overlapping scope at different levels of
granularity. Once you've validated locators against the real app, feel free to delete
whichever layer you don't want to maintain long-term — keeping both is only useful as a
transition/cross-check step.

### Verified with (offline, no live browser — sandbox has no network access)
```bash
./node_modules/.bin/playwright test --list      # confirms 0 syntax/import errors
tsc --noEmit --noResolve ...                    # confirms 0 real TS parser errors (TS1xxx)
```
No test was actually **executed** against the live site (the environment used to write
this code has no network access). Please run the suite for real against
`https://markmyseat.netlify.app/` with your test accounts as the next step.


---

## UPDATE — Fixed real bug found from your test run + missing filter tests

You uploaded the project after actually running it (`test-results/`, `playwright-report/`
were present). Read the `error-context.md` files from your failed runs — these are gold,
they contain the **real accessibility-tree snapshot** of the live app at failure time.

### Root cause found (confirmed from your `admin/overview.page.ts` fix + failure logs)
1. **Theatre dashboard route was broken.** `TB_BASE_URL_THEATRE` in `.env` is
   `https://markmyseat.netlify.app/theatre/login`. The old `theatre/overview.page.ts`
   appended `/dashboard` to it → `.../theatre/login/dashboard` → real **404 "Scene not
   found"** page (confirmed via `test-results/*/error-context.md`). Every theatre-specs
   test timed out in `beforeEach` because of this. **Fixed**: `open()` now strips a
   trailing `/login` before appending `/dashboard`, and mirrors your verified
   `admin/overview.page.ts` pattern (inline login-gate fallback with real button text
   `/access dashboard|sign in|login/i`).
2. **Nav items are `<button>`, not `<a>` links**, and clicking them switches the visible
   dashboard section **in-place — the URL does not change**. Confirmed by your simplified
   `SA-OVERVIEW-03` test (asserts the button stays visible, not a URL change). Propagated
   this same button-first `.or(link)` pattern to `theatre/overview.page.ts`'s `nav` object,
   and removed/replaced the `toHaveURL(...)` assertions after row-clicks in
   `admin-specs/bookings.spec.ts` and `theatre-specs/bookings.spec.ts` (now check for a
   `dialog` role or URL change — whichever the real app actually does).

### Missing "filter" tests — found and added
Audited every locator named `*filter*`/`*Filter*` across all Page Objects and cross-checked
against every spec file: found **3 filter locators defined but never exercised by any
test** (likely what you meant by "thiếu test filter"):
- `adminBookingsPage.filter_theatre` / `filter_status` → added **SA-BOOKINGS-02** (Filter
  bookings by theatre, date range, or status) to `admin-specs/bookings.spec.ts`.
- `theatreBookingsPage.filter_status` → added **THR-BOOKINGS-02** (Filter bookings by date,
  movie, or status) to `theatre-specs/bookings.spec.ts`.
- `adminTheatresPage.filter_status` → added a new **SA-THEATRES-06** (Filter theatres by
  approval status) to `admin-specs/theatres.spec.ts`.

After this pass, every `filter_*`/`*Filter` locator in the project is used by at least one
test — ran a project-wide grep to confirm (see conversation for the exact command).

### Folder/naming changes you made — kept as-is
- `tests/pageObjects/pages/customer/` → renamed to `tests/pageObjects/pages/user/`
  (all imports in `pageFixture.ts` already updated to match).
- `tests/specs/theater-specs/` → renamed to `tests/specs/theatre-specs/` (consistent
  British spelling with the rest of the project).

### Verified again after this pass
```
tsc --noEmit --noResolve ...        # 0 real syntax errors (TS1xxx)
./node_modules/.bin/playwright test --list   # 172 tests in 28 files, 0 load errors
```
Still **not executed against the live site** from this side (no network access here) — the
theatre-dashboard route fix and button-nav pattern are inferred from your real failure logs,
not independently re-verified by me. Please re-run and see if `theatre-specs/*` now gets
past the `beforeEach` hook.
