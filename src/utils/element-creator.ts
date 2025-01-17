import { assertIsDefined } from '../types/types';

export default class ElementCreator {
  public element: HTMLElement;

  constructor(tag: string, className: string, text: string) {
    this.element = document.createElement(tag);
    this.createElement(className, text);
  }

  private createElement(className: string, text: string) {
    this.setClass(className);
    this.setTextContent(text);
  }

  public setTextContent(text: string) {
    assertIsDefined(this.element);
    this.element.textContent = text;
  }

  private setClass(className: string) {
    assertIsDefined(this.element);
    this.element.className = className;
  }

  public clearContent() {
    this.element.innerHTML = '';
  }

  public getElement() {
    return this.element;
  }
}
