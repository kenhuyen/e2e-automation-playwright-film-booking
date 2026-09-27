import { test as base } from '@playwright/test';
import LoginPage from './pages/login.page';
import HomePage from './pages/user/home.page';
import RegisterPage from './pages/user/register.page';
import MovieDetailPage from './pages/user/movieDetail.page';
import BookingPage from './pages/user/booking.page';
import ConfirmBookingPage from './pages/user/confirmBooking.page';
import SuccessPage from './pages/user/success.page';
import BookingHistoryPage from './pages/user/bookingHistory.page';
import BookingDetailPage from './pages/user/bookingDetail.page';
import ProfilePage from './pages/user/profile.page';
import VerifyBookingPage from './pages/user/verifyBooking.page';

import TheatreOverviewPage from './pages/theatre/overview.page';
import TheatreRegisterPage from './pages/theatre/register.page';
import TheatreMoviesPage from './pages/theatre/movies.page';
import TheatreBookingsPage from './pages/theatre/bookings.page';
import TheatreFoodMenuPage from './pages/theatre/foodMenu.page';
import TheatreScreensPage from './pages/theatre/screens.page';

import AdminOverviewPage from './pages/admin/overview.page';
import AdminUsersPage from './pages/admin/users.page';
import AdminTheatresPage from './pages/admin/theatres.page';
import AdminBookingsPage from './pages/admin/bookings.page';
import AdminMoviesPage from './pages/admin/movies.page';

export type PageObjects = {
  // Shared
  homePage: HomePage;
  loginPage: LoginPage;

  // USER module
  registerPage: RegisterPage;
  movieDetailPage: MovieDetailPage;
  bookingPage: BookingPage;
  confirmBookingPage: ConfirmBookingPage;
  successPage: SuccessPage;
  bookingHistoryPage: BookingHistoryPage;
  bookingDetailPage: BookingDetailPage;
  profilePage: ProfilePage;
  verifyBookingPage: VerifyBookingPage;

  // THEATRE module
  theatreOverviewPage: TheatreOverviewPage;
  theatreRegisterPage: TheatreRegisterPage;
  theatreMoviesPage: TheatreMoviesPage;
  theatreBookingsPage: TheatreBookingsPage;
  theatreFoodMenuPage: TheatreFoodMenuPage;
  theatreScreensPage: TheatreScreensPage;

  // SUPERADMIN module
  adminOverviewPage: AdminOverviewPage;
  adminUsersPage: AdminUsersPage;
  adminTheatresPage: AdminTheatresPage;
  adminBookingsPage: AdminBookingsPage;
  adminMoviesPage: AdminMoviesPage;
};

export const test = base.extend<PageObjects>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  movieDetailPage: async ({ page }, use) => {
    await use(new MovieDetailPage(page));
  },
  bookingPage: async ({ page }, use) => {
    await use(new BookingPage(page));
  },
  confirmBookingPage: async ({ page }, use) => {
    await use(new ConfirmBookingPage(page));
  },
  successPage: async ({ page }, use) => {
    await use(new SuccessPage(page));
  },
  bookingHistoryPage: async ({ page }, use) => {
    await use(new BookingHistoryPage(page));
  },
  bookingDetailPage: async ({ page }, use) => {
    await use(new BookingDetailPage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  verifyBookingPage: async ({ page }, use) => {
    await use(new VerifyBookingPage(page));
  },

  theatreOverviewPage: async ({ page }, use) => {
    await use(new TheatreOverviewPage(page));
  },
  theatreRegisterPage: async ({ page }, use) => {
    await use(new TheatreRegisterPage(page));
  },
  theatreMoviesPage: async ({ page }, use) => {
    await use(new TheatreMoviesPage(page));
  },
  theatreBookingsPage: async ({ page }, use) => {
    await use(new TheatreBookingsPage(page));
  },
  theatreFoodMenuPage: async ({ page }, use) => {
    await use(new TheatreFoodMenuPage(page));
  },
  theatreScreensPage: async ({ page }, use) => {
    await use(new TheatreScreensPage(page));
  },

  adminOverviewPage: async ({ page }, use) => {
    await use(new AdminOverviewPage(page));
  },
  adminUsersPage: async ({ page }, use) => {
    await use(new AdminUsersPage(page));
  },
  adminTheatresPage: async ({ page }, use) => {
    await use(new AdminTheatresPage(page));
  },
  adminBookingsPage: async ({ page }, use) => {
    await use(new AdminBookingsPage(page));
  },
  adminMoviesPage: async ({ page }, use) => {
    await use(new AdminMoviesPage(page));
  },
});

export { expect, type Page, type Locator, type Response } from '@playwright/test';
