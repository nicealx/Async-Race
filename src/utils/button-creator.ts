import { assertIsDefined } from '../types/types';

export default class ButtonCreator {
  private element: HTMLButtonElement;

  constructor(className: string, type: 'submit' | 'reset' | 'button', text: string, state: boolean) {
    this.element = document.createElement('button');
    this.createElement(className, type, text, state);
  }

  private createElement(className: string, type: 'submit' | 'reset' | 'button', text: string, state: boolean) {
    this.setClass(className);
    this.setType(type);
    this.setTextContent(text);
    this.setState(state);
  }

  private setClass(className: string) {
    assertIsDefined(this.element);
    this.element.className = className;
  }

  private setType(type: 'submit' | 'reset' | 'button') {
    assertIsDefined(this.element);
    this.element.type = type;
  }

  private setTextContent(text: string) {
    assertIsDefined(this.element);
    this.element.textContent = text;
  }

  public setState(state: boolean) {
    this.element.disabled = state;
  }

  public getElement() {
    return this.element;
  }
}
