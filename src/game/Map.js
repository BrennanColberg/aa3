export default class Territory {

  constructor(name, value, city, capital) {

    this.name = name;
    this.value = value;
    if (city) {
      this.city = city;
      this.capital = capital !== undefined;
    }

    this.nation = undefined;
    this.borderingTerritories = [];

  }

}