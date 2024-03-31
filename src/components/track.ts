import './track.css';
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

  private highway: HTMLElement;

  private carID: string;

  constructor(id: string, name: string, color: string) {
    this.name = name;
    this.selectButton = new ButtonCreator('select btn', 'button', 'select', false);
    this.startButton = new ButtonCreator('start btn', 'button', 'start', false);
    this.stopButton = new ButtonCreator('stop btn', 'button', 'stop', false);
    this.deleteButton = new ButtonCreator('delete btn', 'button', 'delete', false);
    this.car = new CarView(color);
    this.element = this.createTrack();
    this.highway = this.createHighway();
    this.carID = id;
    this.createView(name);
  }

  private createControls() {
    this.stopButton.setState(true);
    const wrapper = new ElementCreator('div', 'track__control', '');
    const container = wrapper.getElement();
    const select = this.selectButton.getElement();
    const start = this.startButton.getElement();
    const stop = this.stopButton.getElement();
    const del = this.deleteButton.getElement();

    del.addEventListener('click', async () => {
      await fetch(`${URLs.garage}/${this.carID}`, {
        method: METHODS.DELETE,
      });
      del.dispatchEvent(new CustomEvent('deleteCar', {
        bubbles: true,
      }));
    });

    select.addEventListener('click', async () => {
      const response = await fetch(`${URLs.garage}/${this.carID}`, {
        method: METHODS.GET,
      }).then((res) => res.json()).then((res) => res);
      const { name, color } = response;
      select.dispatchEvent(new CustomEvent('selectCar', {
        bubbles: true,
        detail: {
          carID: this.carID,
          carName: name,
          carColor: color,
        },
      }));
    });

    start.addEventListener('click', async () => {
      this.startButton.setState(true);
      this.stopButton.setState(false);
      this.deleteButton.setState(true);
      this.selectButton.setState(true);
      start.classList.add('loading');
      await this.engineCar(this.carID, 'started')
        .then((res) => {
          if (res.status === 404) {
            this.startButton.setState(false);
            throw new Error('Car was not founded');
          }

          if (res.status === 400) {
            this.startButton.setState(false);
            throw new Error('Wrong parameters');
          }
          return res.json();
        }).then((res) => {
          const { velocity, distance } = res;
          const timeout = Math.floor(distance / velocity);
          this.highway.classList.add('drive');
          this.animateCar(`${timeout}ms`);
          start.classList.remove('loading');
        });
    });

    stop.addEventListener('click', async () => {
      this.stopButton.setState(true);
      stop.classList.add('loading');
      await this.engineCar(this.carID, 'stopped')
        .then((res) => {
          if (res.status === 404) {
            this.startButton.setState(false);
            throw new Error('Car was not founded');
          }

          if (res.status === 400) {
            this.startButton.setState(false);
            throw new Error('Wrong parameters');
          }
          this.highway.classList.remove('drive');
          setTimeout(() => {
            this.stopButton.setState(true);
            this.startButton.setState(false);
            this.deleteButton.setState(false);
            this.selectButton.setState(false);
            stop.classList.remove('loading');
          }, 0);
        });
    });

    container.append(select, start, stop, del);
    return container;
  }

  private createTrack() {
    const element = new ElementCreator('div', 'track__race', '');
    const raceTrack = element.getElement();

    return raceTrack;
  }

  private async engineCar(id: string, status: string) {
    return fetch(`${URLs.engine}/?id=${id}&status=${status}`, {
      method: METHODS.PATCH,
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

  private createView(name: string) {
    const control = this.createControls();
    const carName = this.createCarName(name);
    this.highway.append(this.car.getElement());
    this.element.append(control, carName, this.highway);
  }

  private animateCar(velocity: string) {
    this.car.getElement().style.setProperty('--v', velocity);
  }

  public getElement() {
    return this.element;
  }
}
