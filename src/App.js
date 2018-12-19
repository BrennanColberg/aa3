import React, { Component } from 'react';
import './App.css';
import Game from './game/Game.js';
import { UnitShop, UnitInventory } from './UnitShop.js';

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
      inventory: startingNation.inventory
    };

  }

  loadNation(nation) {
    this.setState({
      nation: nation,
      name: nation.name,
      balance: nation.balance,
      inventory: nation.inventory
    });
  }

  /**
   * Processes checkout from the unit purchasing component.
   * @param {Array} cart array of all units that were purchased
   */
  handleCheckout(cart) {
    // record old state values
    let balance = this.state.balance;
    let inventory = [...this.state.inventory];
    // process all cart items
    while (cart.length > 0) {
      balance -= cart[0].cost;
      inventory.push(cart[0]);
      cart.splice(0, 1);
    }
    // push new states, force rendering udpate
    this.setState({
      balance: balance,
      inventory: inventory
    });
  }

  render() {
    return (
      <div className="App">
        This is the app!
        <UnitShop
          name={this.state.name}
          balance={this.state.balance}
          units={this.game.units}
          onClick={(cart) => this.handleCheckout(cart)}
        />
        <UnitInventory
          inventory={this.state.inventory}
        />
      </div>
    );
  }

}

export default App;
