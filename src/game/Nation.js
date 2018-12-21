export default class Nation {

  constructor(name, abbr, alliance) {

    this.name = name;
    this.abbr = abbr;
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

    // check to make sure the nation owns their own capital
    let hasCapital = false;
    for (let territory of this.territories) {
      if (territory.capital && territory.originalNation === this) {
        hasCapital = true;
        break;
      }
    }

    // only collect income if capital is owned
    if (hasCapital) {
      this.balance += this.calculateIncome();
    }

    return hasCapital;

  }

}