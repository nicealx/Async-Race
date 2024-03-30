import ElementCreator from '../utils/element-creator';

export default class AppContainer extends ElementCreator {
  public setContent(page: Node) {
    this.element.innerHTML = '';
    this.element.append(page);
  }
}
