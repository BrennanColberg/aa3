import React from 'react';

/**
 * Handles all "shopping" during turn phase 1 for getting units.
 */
const UnitShop = (props) => (
  <div className="UnitShop">

    <p>Balance of {props.name}: ${props.balance}</p>

    <UnitShelf
      units={props.units}
      balance={props.balance}
      onClick={(unit) => props.addToCart(unit)}
    />

    <UnitCart
      cart={props.cart}
      onClick={(unit) => props.removeFromCart(unit)}
    />
    
    {props.cart.length > 0
      ? <button onClick={() => props.checkout()}>
          Checkout
        </button>
      : null
    }

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
const UnitCart = (props) => {
  let units = {};
  for (let unit of props.cart) {
    let name = unit.name;
    if (!units[name]) units[name] = [];
    units[name].push(unit);
  }
  return (
    <div className="UnitCart">
      {Object.keys(units).map(name => 
        <UnitListing
          unit={units[name][0]}
          quantity={units[name].length}
          onClick={() => props.onClick(units[name][0])}
          key={name}
        />
      )}
    </div>
  );
}

/**
 * Displays all units in a nation's current purchased inventory.
 */
const UnitInventory = (props) => {
  let units = {};
  for (let unit of props.inventory) {
    let name = unit.name;
    if (!units[name]) units[name] = [];
    units[name].push(unit);
  }
  return (
    <div className="UnitInventory">

      {Object.keys(units).map(name => 
        <UnitListing
          unit={units[name][0]}
          quantity={units[name].length}
          onClick={() => {}}
          key={name}
        />
      )}

      {props.inventory.length > 0
        ? <button onClick={() => props.onClick()}>
            Place Pieces
          </button>
        : null
      }

    </div>
  );
}

/**
 * Displays a single unit's purchase listing (name and cost).
 * If there's more than one, it displays the quantity too.
 */
const UnitListing = (props) => (
  <button className="UnitListing" onClick={() => props.onClick()}>
    {props.quantity > 1 ? <span> {props.quantity}</span> : null}
     {props.unit.name}
  </button>
);

export {
  UnitShop,
  UnitInventory
}