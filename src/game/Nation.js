export default class Nation {

  constructor(name, balance) {
    this.name = name;
    this.balance = balance;
    this.income = balance;

    // purchasing
    this.cart = [];
    this.inventory = [];

  }

  collectIncome() {
    this.balance += this.income;
  }

}