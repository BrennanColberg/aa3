import React, { Component } from 'react';
import './App.css';
import Game from './game/Game.js';

class App extends Component {

  constructor(props) {
    super(props);

    // initialize game state
    let game = new Game();
    let current = game.nextNation();
    this.state = {
      game: game,
      current: current,
    };

  }

  /**
   * Processes checkout from the unit purchasing component.
   * @param {Array} cart array of all units that were purchased
   */
  handleCheckout(cart) {

    while (cart.length > 0) {

      // adjust balance
      this.state.current.balance -= cart[0].cost;

      // move units from cart to inventory
      this.state.current.inventory.push(cart[0]);
      cart.splice(0, 1);

    }
    
    // updating display
    this.setState({
      current: this.state.current,
    });

  }

  render() {
    return (
      <div className="App">
        This is the app!
        <UnitShop
          name={this.state.current.name}
          balance={this.state.current.balance}
          units={this.state.game.units}
          onClick={(cart) => this.handleCheckout(cart)}
        />
        <UnitInventory
          inventory={this.state.current.inventory}
        />
      </div>
    );
  }

}

/**
 * Handles all "shopping" during turn phase 1 for getting units.
 */
class UnitShop extends Component {

  constructor(props) {
    super(props);

    // intitates a running balance and "shopping cart"
    this.state = {
      balance: props.balance,
      cart: [],
    };
  }
  
  /**
   * Puts a unit in the nation's cart and adjusts their working balance.
   * @param {Unit} unit unit to put in cart
   */
  addUnitToCart(unit) {
    if (this.state.balance >= unit.cost) {
      this.state.balance -= unit.cost;
      this.state.cart.push(unit);
      this.setState({
        balance: this.state.balance,
        cart: this.state.cart,
      });
      console.log("Added " + unit.name + " to cart!");
    }
  }

  /**
   * Removes a unit from the nation's cart and adjusts their working balance.
   * @param {Unit} unit unit to remove from cart
   */
  removeUnitFromCart(unit) {
    let index = this.state.cart.indexOf(unit);
    if (index !== -1) {
      this.state.cart.splice(index, 1);
      this.state.balance += unit.cost;
      this.setState({
        balance: this.state.balance,
        cart: this.state.cart,
      });
      console.log("Removed " + unit.name + " from cart!");
    }
  }

  render() {
    return (
      <div className="UnitShop">
        <p>Balance of {this.props.name}: ${this.state.balance}</p>
        <UnitShelf
          units={this.props.units}
          balance={this.state.balance}
          onClick={(unit) => this.addUnitToCart(unit)}
        />
        <UnitCart
          cart={this.state.cart}
          onClick={(unit) => this.removeUnitFromCart(unit)}
        />
        <button onClick={() => this.props.onClick(this.state.cart)}>
          Checkout
        </button>
      </div>
    );
  }

}

/**
 * Displays the units currently available to purchase; based on a set of
 * possible purchases and a maximum balance with which to make purchases.
 */
const UnitShelf = (props) => (
  <div className="UnitShelf">
    {props.units.map(unit => {

      // only renders if balance is sufficient to purchase
      return (unit.cost <= props.balance)
        ? <UnitListing
            unit={unit}
            onClick={() => props.onClick(unit)}
          />
        : null;

    })}
  </div>
);

/**
 * Displays the units that a nation currently has staged to purchase
 * (in their "shopping cart", so to speak).
 */
const UnitCart = (props) => (
  <div className="UnitCart">
    {props.cart.map(unit => 
      <UnitListing
        unit={unit}
        onClick={() => props.onClick(unit)}
      />
    )}
  </div>
);

/**
 * Displays all units in a nation's current purchased inventory.
 */
const UnitInventory = (props) => (
  <div className="UnitInventory">
    {props.inventory.map(unit => 
      <UnitListing
        unit={unit}
        onClick={() => {}}
      />
    )}
  </div>
);

/**
 * Displays a single unit's purchase listing (name and cost).
 */
const UnitListing = (props) => (
  <button className="UnitListing" onClick={() => props.onClick()}>
    {props.unit.name}: ${props.unit.cost}
  </button>
);

export default App;
