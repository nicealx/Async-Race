import './garage.css';
import CarEditor from '../../components/car-editor';
import RaceTrack from '../../components/track';
import {
  CountCarsOnPage, METHODS, URLs,
} from '../../types/types';
import ButtonCreator from '../../utils/button-creator';
import ElementCreator from '../../utils/element-creator';

const carsName: string[] = ['Tesla', 'Ford', 'Toyota', 'Honda', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen'];
const carsModel: string[] = ['Model S', 'Mustang', 'Camry', 'Civic', 'Tahoe', 'Sunny', 'X5', 'C-Class', 'A4', 'B4'];

export default class GaragePage {
  private container: HTMLElement;

  private title: HTMLElement;

  private create: CarEditor;

  private update: CarEditor;

  private generate: ButtonCreator;

  private count: number;

  private garageManagement: ElementCreator;

  private garageTitle: ElementCreator;

  private track: ElementCreator;

  private prev: ButtonCreator;

  private next: ButtonCreator;

  private numberOfPage: number;

  private pagination: ElementCreator;

  private carID: number;

  constructor(id: string, className: string) {
    this.count = 0;
    this.numberOfPage = 1;
    this.container = document.createElement('section');
    this.container.id = id;
    this.container.className = className;
    this.title = document.createElement('h1');
    this.title.className = 'garage__title';
    this.create = new CarEditor('creator', 'Enter car name', 'Create', false);
    this.update = new CarEditor('updater', 'Enter new car name', 'Update', true);
    this.generate = new ButtonCreator('generate btn', 'button', 'Generate 100 cars', false);
    this.garageManagement = new ElementCreator('div', 'garage__manager', '');
    this.garageTitle = new ElementCreator('h2', 'garage__title', 'Page №1');
    this.track = new ElementCreator('div', 'track', '');
    this.prev = new ButtonCreator('prev btn', 'button', 'prev', true);
    this.next = new ButtonCreator('next btn', 'button', 'next', false);
    this.pagination = new ElementCreator('div', 'pagination', '');
    this.carID = 0;
    this.createView();
  }

  private async createView() {
    const create = this.fieldCreate();
    const update = this.fieldUpdate();
    const generate = this.fieldGenerate();
    await this.getCountCars();
    this.title.textContent = `Garage (${this.count})`;
    const garageTitle = this.garageTitle.getElement();
    const garageManagement = this.garageManagement.getElement();
    garageManagement.append(create, update, generate);
    this.carsList();
    const pagination = this.paginationBlock();
    const track = this.trackRace();
    this.checkPagination();
    this.nextPage();
    this.prevPage();
    this.container.append(
      this.title,
      garageManagement,
      garageTitle,
      track,
      pagination,
    );
  }

  private trackRace() {
    const track = this.track.getElement();
    track.addEventListener('deleteCar', async () => {
      await this.getCountCars();
      await this.updateTitle(this.count);
      await this.carsList();
      this.checkPagination();
    });
    track.addEventListener('selectCar', ((e: CustomEvent) => {
      const name = e.detail.carName;
      const color = e.detail.carColor;
      this.update.setState(false);
      this.update.insertValues(name, color);
      this.carID = e.detail.carID;
    }) as EventListener);

    return track;
  }

  private async carsList() {
    const cars = await this.getCarsList();
    this.track.clearContent();
    for (let i = 0; i < cars.length; i += 1) {
      const { name, color, id } = cars[i];
      if (name && color && id) {
        const car = this.createTrack(id.toString(), name, color);
        this.track.getElement().append(car);
      }
    }
  }

  private setGarageTitle(pageNumber: number) {
    this.garageTitle.setTextContent(`Page №${pageNumber}`);
  }

  private createTrack(id: string, name: string, color: string) {
    const element = new RaceTrack(id, name, color);
    const track = element.getElement();

    return track;
  }

  private async getCarsList() {
    return fetch(`${URLs.garage}?_page=${this.numberOfPage}&_limit=${CountCarsOnPage.cars}`)
      .then((res) => res.json())
      .then((res) => res);
  }

  private nextPage() {
    const next = this.next.getElement();
    next.addEventListener('click', async (e) => {
      e.preventDefault();
      if (this.numberOfPage < Math.ceil(this.count / CountCarsOnPage.cars)) {
        this.track.clearContent();
        this.numberOfPage += 1;
        this.setGarageTitle(this.numberOfPage);
        const cars = await this.getCarsList();
        for (let i = 0; i < cars.length; i += 1) {
          const { name, color, id } = cars[i];
          if (name && color && id) {
            const car = this.createTrack(id.toString(), name, color);
            this.track.getElement().append(car);
          }
        }
      }
      this.checkPagination();
    });
  }

  private prevPage() {
    const prev = this.prev.getElement();
    prev.addEventListener('click', async (e) => {
      e.preventDefault();
      if (this.numberOfPage > 0) {
        this.track.clearContent();
        this.numberOfPage -= 1;
        this.setGarageTitle(this.numberOfPage);
        const cars = await this.getCarsList();
        for (let i = 0; i < cars.length; i += 1) {
          const { name, color, id } = cars[i];
          if (name && color && id) {
            const car = this.createTrack(id.toString(), name, color);
            this.track.getElement().append(car);
          }
        }
      }
      this.checkPagination();
    });
  }

  private fieldGenerate() {
    const generate = this.generate.getElement();
    generate.addEventListener('click', async () => {
      this.generate.setState(true);
      generate.classList.add('loading');
      const cars = new Array(100);
      for (let i = 0; i < cars.length; i += 1) {
        const randomName = carsName[Math.floor(Math.random() * carsName.length)];
        const randomModel = carsModel[Math.floor(Math.random() * carsModel.length)];
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        cars[i] = fetch(URLs.garage, {
          method: METHODS.POST,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `${randomName} ${randomModel}`,
            color: `#${randomColor}`,
          }),
        });
      }
      Promise.allSettled(cars).then(async (response) => {
        response.forEach((el) => {
          if (el.status === 'fulfilled') {
            this.count += 1;
          }
        });
        await this.updateTitle(this.count);
        await this.carsList();
        this.checkPagination();
        this.generate.setState(false);
        generate.classList.remove('loading');
      });
    });

    return generate;
  }

  private fieldCreate() {
    const create = this.create.getElement();
    create.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(create);
      const name = formData.get('name');
      const color = formData.get('color');
      if (name && color) {
        await this.createCar(name.toString(), color.toString());
        await this.getCountCars();
        await this.updateTitle(this.count);
        await this.carsList();
        this.checkPagination();
        create.reset();
      }
    });

    return create;
  }

  private fieldUpdate() {
    const update = this.update.getElement();
    update.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(update);
      const name = formData.get('name');
      const color = formData.get('color');
      if (name && color) {
        await this.updateCar(this.carID, name.toString(), color.toString());
        await this.carsList();
        update.reset();
        this.update.setState(true);
      }
    });

    return update;
  }

  private async updateTitle(count: number) {
    this.title.textContent = `Garage (${count})`;
  }

  private async getCountCars() {
    const response = await fetch(URLs.garage);
    const items = await response.json();
    const count = items.headers.get('X-Total-Count');
    this.count = Number(count);
  }

  private async createCar(carName: string, carColor: string) {
    return fetch(URLs.garage, {
      method: METHODS.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: carName,
        color: carColor,
      }),
    });
  }

  private async updateCar(id: number, carName: string, carColor: string) {
    return fetch(`${URLs.garage}/${id}`, {
      method: METHODS.PUT,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: carName,
        color: carColor,
      }),
    });
  }

  private paginationBlock() {
    const pagination = this.pagination.getElement();
    pagination.append(this.prev.getElement(), this.next.getElement());
    return pagination;
  }

  private checkPagination() {
    if (this.numberOfPage === 1) {
      this.prev.setState(true);
    } else {
      this.prev.setState(false);
    }

    if (this.numberOfPage > Math.floor(this.count / CountCarsOnPage.cars)
        || this.count === CountCarsOnPage.cars) {
      this.next.setState(true);
    } else {
      this.next.setState(false);
    }
  }

  public getElement() {
    return this.container;
  }
}
