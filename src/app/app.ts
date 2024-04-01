import HeaderView from '../view/header/header-view';
import ModalView from '../view/modal/modal-view';

export default class App {
  private container: HTMLElement;

  constructor() {
    this.container = document.body;
    this.container.className = 'body';
  }

  run() {
    const header = new HeaderView();
    const content = header.getAppContainer();
    const modal = new ModalView('div', 'overlay', '');
    this.container.append(header.getElement(), content, modal.getElement());
  }
}
