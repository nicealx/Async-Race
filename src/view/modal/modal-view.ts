import ElementCreator from '../../utils/element-creator';
import './modal.css';

export default class ModalView extends ElementCreator {
  static overlay: HTMLElement;

  private modal: ElementCreator;

  static modalTitle: ElementCreator;

  private modalClose: ElementCreator;

  static modalTexContent: ElementCreator;

  constructor(tag: string, className: string, text: string) {
    super(tag, className, text);
    ModalView.overlay = this.getElement();
    this.modal = new ElementCreator('div', 'modal', '');
    ModalView.modalTitle = new ElementCreator('h3', 'modal__title', 'Modal title');
    this.modalClose = new ElementCreator('div', 'modal__close', '');
    ModalView.modalTexContent = new ElementCreator('p', 'modal__text', 'Some text');
    this.createView();
  }

  private createView() {
    const modal = this.modalView();
    ModalView.overlay.append(modal);
  }

  private modalView() {
    const modal = this.modal.getElement();
    const close = this.modalClose.getElement();
    const title = ModalView.modalTitle.getElement();
    const textContent = ModalView.modalTexContent.getElement();
    close.addEventListener('click', () => {
      ModalView.removeClass('show');
    });
    modal.append(close, title, textContent);

    return modal;
  }

  public static updateTitle(title: string) {
    ModalView.modalTitle.setTextContent(title);
  }

  public static updateTextContent(text: string) {
    ModalView.modalTexContent.setTextContent(text);
  }

  public static addClass(className: string) {
    ModalView.overlay.classList.add(className);
  }

  public static removeClass(className: string) {
    ModalView.overlay.classList.remove(className);
  }
}
