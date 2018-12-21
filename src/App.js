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
    console.log(" ---  " + startingNation.name + " ---");
    this.state = {
      nation: startingNation,
      name: startingNation.name,
      balance: startingNation.balance,
      cart: startingNation.cart,
      inventory: startingNation.inventory,
      territories: startingNation.territories,
      phase: "purchase"
    };
  }

  /**
   * Loads a country's data up, "focusing" on it.
   * @param {Nation} nation country to load
   */
  loadNation(nation) {
    console.log(" ---  " + nation.name + " ---");
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
      territories: nation.territories,

      // actual state variables
      phase: "purchase"

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
   * Goes to the next nation and collects income while outgoing.
   */
  endCurrentTurn() {
    let nation = this.state.nation;
    this.goToNextNation();
    nation.collectIncome();
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
      this.log({"abbr":"$$$"}, this.state.nation, cart[0].name);
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

    // remove from old nation's territory list
    let index = territory.nation.territories.indexOf(territory);
    territory.nation.territories.splice(index, 1);

    // add to current nation's territory list
    if (this.state.nation.alliance === territory.originalNation.alliance) {
      // liberation (return to original owner, even current)
      this.log(territory.nation, territory.originalNation, territory.name);
      territory.nation = territory.originalNation;
      territory.originalNation.territories.push(territory);
      this.setState({ territories: this.state.territories });
    } else {
      // check for capital takeover (& steal balance if so)
      if (territory.capital) {
        this.log(territory.nation, this.state.nation, "$" + territory.nation.balance);
        this.setState({ balance: this.state.balance + territory.nation.balance });
        territory.nation.balance = 0;
      }
      // hostile takeover (enemy territory, current now owns)
      this.log(territory.nation, this.state.nation, territory.name);
      territory.nation = this.state.nation;
      this.setState({ territories: [...this.state.territories, territory] });
    }

  }
  
  /**
   * Simple logging method for territory & cash transfers.
   * @param {Nation} from nation that loses the item
   * @param {Nation} to nation that gains the item
   * @param {String} text description of the item to log
   */
  log(from, to, text) {
    console.log("[" + from.abbr + " -> " + to.abbr + "] " + text);
  }

  render() {
    return (
      <div className="App">
        <nav>
          <button onClick={() => this.goToLastNation()}>Back</button>
          <button onClick={() => this.endCurrentTurn()}>End Turn</button>
          <button onClick={() => this.goToNextNation()}>Next</button>
        </nav>
        <HUD
          name={this.state.name}
          balance={this.state.balance}
          territories={this.state.territories}
        />
        <main>
          {this.state.phase === "purchase"
            ? <UnitDisplay
                units={this.game.units}
                balance={this.state.balance}
                cart={this.state.cart}
                addToCart={(unit) => this.addUnitToCart(unit)}
                removeFromCart={(unit) => this.removeUnitFromCart(unit)}
                proceed={() => {
                  this.handleCheckout();
                  this.setState({ phase: "combat" });
                }}
              />
            : <></>
          }
          {this.state.phase === "combat"
            ? <TerritoryDisplay
                alliance={this.state.nation.alliance}
                allTerritories={Object.values(this.game.territories)}
                territories={this.state.territories}
                conquerTerritory={(territory) => this.conquerTerritory(territory)}
                proceed={() => {
                  this.setState({ phase: "place" });
                }}
              />
            : <></>
          }
          {this.state.phase === "place"
            ? <UnitInventory
                inventory={this.state.inventory}
                proceed={() => {
                  this.emptyInventory();
                  this.endCurrentTurn();
                }}
              />
            : <></>
          }
        </main>
      </div>
    );
  }

}

const HUD = (props) => {
  let income = 0;
  for (let territory of props.territories) {
    income += territory.value;
  }
  return (
    <div className="HUD">
      <h3>Balance: {props.balance}</h3>
      <h1>{props.name}</h1>
      <h3>Income: {income}</h3>
    </div>
  )
}

export default App;
