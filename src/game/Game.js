import unitsJSON from './data/units.json';
import setupJSON from './data/setup.json';
import mapJSON from './data/map.json';
import Unit from './Unit.js';
import Nation from './Nation.js';
import Territory from './Map.js';

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

    // load nations
    this.nations = [];
    for (let entry of setupJSON.nations) {
      this.nations.push(new Nation(
        entry.name,
        entry.alliance
      ));
    }

    // load territories
    this.territories = {}
    for (let name in mapJSON.territories) {
      let entry = mapJSON.territories[name];
      this.territories[name] = new Territory(
        name,
        entry.value,
        entry.city,
        entry.capital
      );
    }
    // assign territories to countries
    for (let nation of this.nations) {
      let startingTerritories = setupJSON.startingTerritories[nation.name];
      for (let territory of startingTerritories) {
        nation.territories.push(this.territories[territory]);
        this.territories[territory].nation = nation;
        this.territories[territory].originalNation = nation;
      }
      // get starting income based on owned territories
      nation.collectIncome();
    }

    // load territory borders
    for (let border of mapJSON.borders) {
      let territory1 = this.territories[border[0]];
      let territory2 = this.territories[border[1]];
      if (territory1 && territory2) {
        territory1.borderingTerritories.push(territory2);
        territory2.borderingTerritories.push(territory1);
      }
    }
  }

  /**
   * If passed a nation in the sequence, returns the next one; otherwise, gives
   * the starting nation.
   * @param {Nation} nation a nation, presumably in the sequence
   */
  nextNation(nation) {
    if (this.nations.includes(nation)) {
      return this.nations[
        (this.nations.indexOf(nation) + this.nations.length + 1) % this.nations.length
      ];
    } else if (nation === undefined) {
      return this.nations[0];
    }
  }

  /**
   * If passed a nation in the sequence, returns the last one; otherwise, gives
   * the starting nation.
   * @param {Nation} nation a nation, presumably in the sequence
   */
  lastNation(nation) {
    if (this.nations.includes(nation)) {
      return this.nations[
        (this.nations.indexOf(nation) + this.nations.length - 1) % this.nations.length
      ];
    } else if (nation === undefined) {
      return this.nations[0];
    }
  }

}