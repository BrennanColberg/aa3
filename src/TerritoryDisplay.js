import React, { Component } from 'react'; 

class TerritoryDisplay extends Component {
  render() {

    // figure out which territories are bordering and conquerable
    let availableTerritories = [];
    for (let territory of this.props.territories) {
      for (let borderingTerritory of territory.borderingTerritories) {
        if (!availableTerritories.includes(borderingTerritory)
            && borderingTerritory.nation
            && borderingTerritory.nation.alliance !== territory.nation.alliance) {
          availableTerritories.push(borderingTerritory);
        }
      }
    }

    return (
      <div className="TerritoryDisplay">
        {availableTerritories.map(territory => 
          <TerritoryListing
            territory={territory}
            onClick={() => this.props.conquerTerritory(territory)}
            key={territory.name}
          />
        )}
      </div>
    );
  }
}

const TerritoryListing = (props) => (
  <button className="TerritoryListing" onClick={() => props.onClick()}>
    {props.territory.name}
  </button>
);

export {
  TerritoryDisplay
}