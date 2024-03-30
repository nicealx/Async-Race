import HeaderView from '../view/header/header-view';

export default class App {
  private container: HTMLElement;

  constructor() {
    this.container = document.body;
  }

  run() {
    const header = new HeaderView();
    const content = header.getAppContainer();
    this.container.append(header.getElement(), content);
  }
}
