import AppContainer from '../../components/app-container';
import ButtonCreator from '../../utils/button-creator';
import ElementCreator from '../../utils/element-creator';
import GaragePage from '../garage/garage-page';
import WinnersPage from '../winners/winners-page';

export default class HeaderView {
  private element: HTMLElement;

  private appContainer: AppContainer;

  private winnersPage: WinnersPage;

  private garagePage: GaragePage;

  constructor() {
    const header = new ElementCreator('header', 'header', '');
    this.element = header.getElement();
    this.appContainer = new AppContainer('div', 'app', '');
    this.garagePage = new GaragePage('garage', 'garage');
    this.winnersPage = new WinnersPage('winners', 'winners');
    this.createView();
  }

  private createView() {
    const garageButton = new ButtonCreator('garage', 'button', 'Garage', false);
    const winnersButton = new ButtonCreator('winners', 'button', 'Winners', false);
    const garage = garageButton.getElement();
    const winners = winnersButton.getElement();
    garage.addEventListener('click', (e) => {
      e.preventDefault();
      this.draw(this.garagePage.getElement());
    });

    winners.addEventListener('click', (e) => {
      e.preventDefault();
      this.draw(this.winnersPage.getElement());
    });
    this.draw(this.garagePage.getElement());
    this.element.append(garage, winners);
  }

  public draw(page: HTMLElement) {
    this.appContainer.setContent(page);
  }

  public getAppContainer() {
    return this.appContainer.getElement();
  }

  public getElement() {
    return this.element;
  }
}
