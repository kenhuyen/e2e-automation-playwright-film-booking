import { Locator, type Page } from '@playwright/test';
import NavBar from './components/navBar';
import AllowCookiesPopup from './components/allowCookiePopup';
import Filter from './components/filter';
import ModalComponent from './components/confirmation_modal';
import ToastMessage from './components/toastmessage';
// import AttributeModalComponent from './components/admin/attributeModalComponent';
import MenuBar from './components/menuBar';
import dotenv from 'dotenv';
dotenv.config();

export abstract class BasePage {
  public navBar: NavBar;
  public cookiePopup: AllowCookiesPopup;
  public filter: Filter;
  public modalConfirm: ModalComponent;
  public toastMessage: ToastMessage;
  public menuBar: MenuBar;
  public attributeModalComponent?: any;
  public baseUrl = (process.env.TB_BASE_URL || 'https://markmyseat.netlify.app').replace(/\/$/, '');

  constructor(readonly page: Page) {
    this.navBar = new NavBar(this.page);
    this.cookiePopup = new AllowCookiesPopup(this.page);
    this.filter = new Filter(this.page);
    this.modalConfirm = new ModalComponent(this.page);
    this.toastMessage = new ToastMessage(this.page);
    this.menuBar = new MenuBar(this.page);
    // this.attributeModalComponent = new AttributeModalComponent(this.page);
  }

  async open(path: string) {
    await this.page.goto(this.baseUrl + path, { waitUntil: 'domcontentloaded' });
  }

  async close() {
    await this.page.close();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
  }

  async pause_test() {
    await this.page.pause();
  }

  async reload_page() {
    await this.page.reload({ waitUntil: 'domcontentloaded' })
  }
}
