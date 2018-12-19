import React, { Component } from 'react';

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
      this.setState({
        balance: this.state.balance - unit.cost,
        cart: [...this.state.cart, unit]
      });
    }
  }

  /**
   * Removes a unit from the nation's cart and adjusts their working balance.
   * @param {Unit} unit unit to remove from cart
   */
  removeUnitFromCart(unit) {
    let cart = this.state.cart;
    let index = cart.indexOf(unit);
    if (index !== -1) {
      cart.splice(index, 1);
      this.setState({
        balance: this.state.balance + unit.cost,
        cart: cart
      });
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
            key={unit.name}
          />
        : undefined;

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
        key={unit.name}
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
        key={unit.name}
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

export {
  UnitShop,
  UnitInventory
}