export type Callback<T> = (data?: T) => void;

export function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`${value} is not defined`);
  }
}

export enum URLs {
  main = 'http://127.0.0.1:3000',
  garage = `${URLs.main}/garage`,
  winners = `${URLs.main}/winners`,
  engine = `${URLs.main}/engine`,
}

export enum METHODS {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export enum NS {
  ns = 'http://www.w3.org/2000/svg',
}

export enum CountCarsOnPage {
  cars = 7,
}
