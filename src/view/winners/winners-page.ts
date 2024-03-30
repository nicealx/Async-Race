export default class WinnersPage {
  private container: HTMLElement;

  constructor(id: string, className: string) {
    this.container = document.createElement('section');
    this.container.id = id;
    this.container.className = className;
  }

  public getElement() {
    return this.container;
  }
}
