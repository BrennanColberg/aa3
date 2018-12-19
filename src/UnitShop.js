import React, { Component } from 'react';

/**
 * Handles all "shopping" during turn phase 1 for getting units.
 */
const UnitShop = (props) => (
  <div className="UnitShop">
    <p>Balance of {this.props.name}: ${this.props.balance}</p>
    <UnitShelf
      units={this.props.units}
      balance={this.props.balance}
      onClick={(unit) => this.props.addToCart(unit)}
    />
    <UnitCart
      cart={this.props.cart}
      onClick={(unit) => this.props.removeFromCart(unit)}
    />
    <button onClick={() => this.props.onClick()}>
      Checkout
    </button>
  </div>
);

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