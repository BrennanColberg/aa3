import unitsJSON from './data/units.json';
import Unit from './Unit.js';
import setupJSON from './data/setup.json';
import Nation from './Nation.js';

export default class Game {

  constructor() {

    // load units
    this.units = [];
    for (let entry of unitsJSON.units) {
      this.units.push(new Unit(
        entry.name,
        entry.type,
        entry.cost,
        entry.attack,
        entry.defense,
        entry.move,
        entry.boost,
        entry.carry
      ));
    }

    // load setup
    this.nations = [];
    for (let entry of setupJSON.nations) {
      this.nations.push(new Nation(
        entry.name,
        entry.balance
      ));
    }

    // load map


  }

  nextNation(nation) {
    if (nation in this.nations) {
      return this.nations[this.nations.indexOf(nation) + 1] % this.nations.length;
    } else if (nation === undefined) {
      return this.nations[0];
    }
  }

}