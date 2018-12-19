export default class Nation {

  constructor(name, alliance) {

    this.name = name;
    this.alliance = alliance;
    this.balance = 0;

    // purchasing
    this.cart = [];
    this.inventory = [];

    // territory
    this.territories = [];

  }

  calculateIncome() {
    let income = 0;
    for (let territory of this.territories) {
      income += territory.value;
    }
    return income;
  }

  collectIncome() {
    this.balance += this.calculateIncome();
  }

}