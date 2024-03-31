import ButtonCreator from '../utils/button-creator';
import ElementCreator from '../utils/element-creator';
import InputCreator from '../utils/input-creator';

export default class CarEditor {
  private create: HTMLFormElement;

  private inputName: InputCreator;

  private inputColor: InputCreator;

  private buttonCreate: ButtonCreator;

  constructor(className: string, placeholder: string, text: string, state: boolean) {
    this.inputName = new InputCreator('car-name', 'text', placeholder, state, 'name', '');
    this.inputColor = new InputCreator('car-color', 'color', '', state, 'color', '');
    this.buttonCreate = new ButtonCreator('car-button', 'submit', text, state);
    this.create = this.carCreate(className);
  }

  private carCreate(className: string) {
    const wrapper = new ElementCreator('form', className, '');
    const name = this.inputName.getElement();
    const color = this.inputColor.getElement();
    const create = this.buttonCreate.getElement();
    const res = wrapper.getElement();
    res.append(name, color, create);

    return res as HTMLFormElement;
  }

  public setState(state: boolean) {
    this.inputName.setState(state);
    this.inputColor.setState(state);
    this.buttonCreate.setState(state);
  }

  public insertValues(name: string, color: string) {
    this.inputName.setValue(name);
    this.inputColor.setValue(color);
  }

  public getElement() {
    return this.create;
  }
}
