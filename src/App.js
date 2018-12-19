import React, { Component } from 'react';
import './App.css';
import Game from './game/Game.js';
import { UnitDisplay, UnitInventory } from './UnitDisplay.js';
import { TerritoryDisplay } from './TerritoryDisplay.js';

class App extends Component {

  constructor(props) {
    super(props);
    
    // initialize game state
    this.game = new Game();
    let startingNation = this.game.nextNation();
    this.state = {
      nation: startingNation,
      name: startingNation.name,
      balance: startingNation.balance,
      cart: startingNation.cart,
      inventory: startingNation.inventory,
      territories: startingNation.territories
    };

  }

  /**
   * Loads a country's data up, "focusing" on it.
   * @param {Nation} nation country to load
   */
  loadNation(nation) {
    let oldNation = this.state.nation;
    oldNation.balance = this.state.balance;
    oldNation.cart = this.state.cart;
    oldNation.inventory = this.state.inventory;
    oldNation.territories = this.state.territories;
    this.setState({

      // reference variables
      nation: nation,
      name: nation.name,
      
      // relevant & commonly changed variables
      balance: nation.balance,
      cart: nation.cart,
      inventory: nation.inventory,
      territories: nation.territories

    });
    this.forceUpdate();
  }

  /**
   * Goes to the next nation; loads their data.
   */
  goToNextNation() {
    this.loadNation(this.game.nextNation(this.state.nation));
  }

  /**
   * Goes to the last nation; loads their data.
   */
  goToLastNation() {
    this.loadNation(this.game.lastNation(this.state.nation));
  }

  /**
   * Puts a unit in the nation's cart and adjusts their working balance.
   * @param {Unit} unit unit to put in cart
   */
  addUnitToCart(unit) {
    let balance = this.state.balance;
    let cart = [...this.state.cart];
    if (balance >= unit.cost) {
      balance -= unit.cost;
      cart.push(unit);
    }
    this.setState({
      balance: balance,
      cart: cart
    });
  }

  /**
   * Removes a unit from the nation's cart and adjusts their working balance.
   * @param {Unit} unit unit to remove from cart
   */
  removeUnitFromCart(unit) {
    let balance = this.state.balance;
    let cart = [...this.state.cart];
    let index = cart.indexOf(unit);
    if (index !== -1) {
      balance += unit.cost;
      cart.splice(index, 1);
    }
    this.setState({
      balance: balance,
      cart: cart
    })
  }

  /**
   * Processes checkout from the unit purchasing component.
   * @param {Array} cart array of all units that were purchased
   */
  handleCheckout() {
    let cart = [...this.state.cart];
    let inventory = [...this.state.inventory];
    while (cart.length > 0) {
      inventory.push(cart[0]);
      cart.splice(0, 1);
    }
    this.setState({
      cart: cart,
      inventory: inventory
    });
  }

  /**
   * Empties thee current nation's inventory; called when units are placed.
   */
  emptyInventory() {
    this.setState({
      inventory: []
    });
  }

  /**
   * Transfers a territory to the current nation's control.
   * @param {Territory} territory territory to conquer
   */
  conquerTerritory(territory) {
    // remove from old nation
    let index = territory.nation.territories.indexOf(territory);
    territory.nation.territories.splice(index, 1);
    // add to current nation
    if (this.state.nation.alliance === territory.originalNation.alliance) {
      territory.nation = territory.originalNation;
      territory.originalNation.territories.push(territory);
      this.setState({ territories: this.state.territories });
    } else {
      territory.nation = this.state.nation;
      this.setState({ territories: [...this.state.territories, territory] });
    }
  }

  render() {
    return (
      <div className="App">
        <button onClick={() => this.goToLastNation()}>Back</button>
        <button onClick={() => {
          let nation = this.state.nation;
          this.goToNextNation();
          nation.collectIncome();
        }}>End Turn</button>
        <button onClick={() => this.goToNextNation()}>Next</button>
        <UnitDisplay
          units={this.game.units}

          name={this.state.name}
          balance={this.state.balance}
          cart={this.state.cart}

          addToCart={(unit) => this.addUnitToCart(unit)}
          removeFromCart={(unit) => this.removeUnitFromCart(unit)}
          checkout={() => this.handleCheckout()}
        />
        <UnitInventory
          inventory={this.state.inventory}
          onClick={() => this.emptyInventory()}
        />
        <TerritoryDisplay
          alliance={this.state.nation.alliance}
          allTerritories={Object.values(this.game.territories)}
          territories={this.state.territories}
          conquerTerritory={(territory) => this.conquerTerritory(territory)}
        />
      </div>
    );
  }

}

export default App;
