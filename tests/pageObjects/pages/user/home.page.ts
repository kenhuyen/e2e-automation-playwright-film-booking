import { BasePage } from '../../base.page';

export default class HomePage extends BasePage {
  // --- Movie discovery -----------------------------------------------------
  // ASSUMPTION: search box has a visible placeholder containing "search" / "movie".
  readonly searchInput = this.page.locator(
    'input[placeholder="Search movies, genres, languages..."]'
  );

  readonly noResultsText = this.page.getByText(/no movies found|no results/i);
  // ASSUMPTION: movie cards are rendered as links/cards with the movie title as accessible text.
  readonly movieCards = this.page.locator(
    'div.cursor-pointer.group:has(img):has(h3)'
  );
  readonly nowShowingTab = this.page.getByRole('tab', { name: /now showing/i }).or(this.page.getByRole('button', { name: /now showing/i }));
  readonly comingSoonTab = this.page.getByRole('tab', { name: /coming soon/i }).or(this.page.getByRole('button', { name: /coming soon/i }));
  readonly genreFilter = this.page.getByRole('combobox', { name: /genre/i }).or(this.page.locator('select').first());

  // --- Header / navigation ---------------------------------------------
  readonly logo = this.page.getByRole('link', { name: /markmyseat/i }).or(this.page.locator('header a').first());
  readonly navMenuItems = this.page.locator('header nav a, nav a');
  readonly loginButton = this.page.getByRole('link', { name: /^login$/i }).or(this.page.getByRole('button', { name: /^login$/i }));
  readonly registerButton = this.page.getByRole('link', { name: /^register|sign up$/i }).or(this.page.getByRole('button', { name: /^register|sign up$/i }));
  readonly userAvatar = this.page.locator('header button, nav button').filter({ has: this.page.locator('div.rounded-full') }).first();

  // --- Footer --------------------------------------------------------------
  readonly footer = this.page.locator('footer');
  readonly footerLinks = this.page.locator('footer a');

  async open() {
    await super.open('/');
  }

  async goHomeViaLogo() {
    await this.logo.click();
  }

  async clickNavItemByText(text: string) {
    await this.navMenuItems.filter({ hasText: new RegExp(text, 'i') }).first().click();
  }

  async searchMovie(title: string) {
    await this.searchInput.waitFor({
      state: 'visible',
      timeout: 10000,
    });

    await this.searchInput.click();

    await this.searchInput.fill(title);
  }

  async openMovieByTitle(title: string) {
    await this.page.getByText(title, { exact: false }).first().click();
  }

  /** Clicks the first available "Book Now" button on a movie card (Home) or detail page. */
  async clickFirstBookNow() {
    await this.page.getByRole('button', { name: /book now|book ticket/i }).first().click();
  }
  async waitForMovies() {
    await this.movieCards.first().waitFor({
      state: 'visible',
      timeout: 15000,
    });
  }
  async clickFirstBookNow2() {
    const bookNow = this.page.getByText('Book Now', { exact: true }).first();

    await bookNow.waitFor({
      state: 'visible',
      timeout: 15000,
    });

    await bookNow.click();

    await this.page.waitForLoadState('domcontentloaded');

    console.log('URL after Book Now:', this.page.url());
  }
  async logout() {
    // Locate the user profile / avatar button in the header/navbar
    const userMenuBtn = this.page.locator('header button, nav button').filter({ has: this.page.locator('div.rounded-full') }).first();
    if (await userMenuBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await userMenuBtn.click();
      const signOutBtn = this.page.getByRole('button', { name: /sign out|logout/i });
      await signOutBtn.click();
    } else {
      // Fallback: search for direct logout button if visible
      const directLogoutBtn = this.page.getByRole('button', { name: /sign out|logout/i }).first();
      if (await directLogoutBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await directLogoutBtn.click();
      }
    }
  }
}

