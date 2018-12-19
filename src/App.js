import React, { Component } from 'react';
import './App.css';
import Game from './game/Game.js';

class App extends Component {

  constructor(props) {
    super(props);

    let game = new Game();
    let current = game.nextNation();

    this.setState({
      game: game,
      current: current
    });

  }

  handleAddUnitToCart(unit) {
    if (this.state.current.balance >= unit.cost) {
      this.state.current.balance -= unit.cost;
      this.state.current.cart.push(unit);
      this.setState({
        current: this.state.current
      });
      console.log("Added " + unit.name + " to cart!");
    }
  }

  handleRemoveUnitFromCart(unit) {
    let index = this.state.current.cart.indexOf(unit);
    if (index !== -1) {
      this.state.current.cart.splice(index, 1);
      this.state.current.balance += unit.cost;
      this.setState({
        current: this.state.current
      });
      console.log("Removed " + unit.name + " from cart!");
    }
  }

  render() {
    return (
      <div className="App">
        This is the app!
        <Economy nation={this.state.current} />
        <UnitShelf
          units={this.state.game.units}
          balance={this.state.current.balance}
          handleClick={(unit) => this.handleAddUnitToCart(unit)}
        />
        <UnitCart
          cart={this.state.current.cart}
          handleClick={(unit) => this.handleRemoveUnitFromCart(unit)}
        />
        <UnitInventory />
      </div>
    );
  }

}

const Economy = (props) => (
  <p>Balance of {props.nation.name}: ${props.nation.balance}</p>
);

class UnitShelf extends Component {

  renderUnit(unit) {
    return (
      <UnitListing
        name={unit.name}
        cost={unit.cost}
        onClick={() => this.props.handleClick(unit)}
      />
    );
  }

  render() {
    return (
      <div className="UnitShelf">
        {this.props.units.map(unit => {
          return (unit.cost <= this.props.balance)
            ? this.renderUnit(unit)
            : undefined;
        })}
      </div>
    );
  }

}

const UnitListing = (props) => (
  <button className="UnitListing" onClick={() => props.onClick()}>
    {props.name}: ${props.cost}
  </button>
);

class UnitCart extends Component {

  renderUnit(unit) {
    return (
      <UnitListing
        name={unit.name}
        cost={unit.cost}
        onClick={() => this.props.handleClick(unit)}
      />
    );
  }

  render() {
    return (
      <div className="UnitCart">
        {this.props.cart.map(unit => this.renderUnit(unit))}
      </div>
    );
  }

}

const UnitInventory = (props) => (
  <></>
);

export default App;
