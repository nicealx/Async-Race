import { METHODS, URLs } from '../types/types';
import ButtonCreator from '../utils/button-creator';
import ElementCreator from '../utils/element-creator';
import CarView from '../view/car/car-view';

export default class RaceTrack {
  private name: string;

  private selectButton: ButtonCreator;

  private startButton: ButtonCreator;

  private stopButton: ButtonCreator;

  private deleteButton: ButtonCreator;

  private car: CarView;

  private element: HTMLElement;

  constructor(id: string, name: string, color: string) {
    this.name = name;
    this.selectButton = new ButtonCreator('select btn', 'button', 'select', false);
    this.startButton = new ButtonCreator('start btn', 'button', 'start', false);
    this.stopButton = new ButtonCreator('stop btn', 'button', 'stop', false);
    this.deleteButton = new ButtonCreator('delete btn', 'button', 'delete', false);
    this.car = new CarView(color);
    this.element = this.createTrack();
    this.createView(id, name);
  }

  private createControls(id: string) {
    const wrapper = new ElementCreator('div', 'track__control', '');
    const container = wrapper.getElement();
    const select = this.selectButton.getElement();
    const start = this.startButton.getElement();
    const stop = this.stopButton.getElement();
    const del = this.deleteButton.getElement();
    select.id = id;
    del.id = id;

    const deleteCar = new CustomEvent('deleteCar', {
      bubbles: true,
    });

    del.addEventListener('click', () => {
      this.deleteCar(del.id);
      del.dispatchEvent(deleteCar);
    });

    select.addEventListener('click', async () => {
      const idCar = select.id;
      const response = await fetch(`${URLs.garage}/${idCar}`, {
        method: METHODS.GET,
      }).then((res) => res.json()).then((res) => res);
      const { name, color } = response;
      select.dispatchEvent(new CustomEvent('selectCar', {
        bubbles: true,
        detail: {
          carID: idCar,
          carName: name,
          carColor: color,
        },
      }));
    });

    container.append(select, start, stop, del);
    return container;
  }

  private createTrack() {
    const element = new ElementCreator('div', 'track__race', '');
    const raceTrack = element.getElement();

    return raceTrack;
  }

  public async editCar(id: string, name: string, color: string) {
    this.car.updateCar(color);
    await fetch(`${URLs.garage}/${id}`, {
      method: METHODS.PUT,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        color,
      }),
    });
  }

  private async deleteCar(id: string) {
    return fetch(`${URLs.garage}/${id}`, {
      method: METHODS.DELETE,
    });
  }

  private createHighway() {
    const element = new ElementCreator('div', 'track__highway', '');
    const highway = element.getElement();
    return highway;
  }

  private createCarName(name: string) {
    const element = new ElementCreator('span', 'track__car-name', name);
    const carName = element.getElement();
    return carName;
  }

  private createView(id: string, name: string) {
    const control = this.createControls(id);
    const highway = this.createHighway();
    const carName = this.createCarName(name);
    highway.append(this.car.getElement());
    this.element.append(control, carName, highway);
  }

  public getElement() {
    return this.element;
  }
}
