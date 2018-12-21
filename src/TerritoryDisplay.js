import React, { Component } from 'react'; 

class TerritoryDisplay extends Component {
  render() {

    // figure out which territories are bordering and conquerable
    let availableBorderingTerritories = [];
    for (let territory of this.props.territories) {
      for (let borderingTerritory of territory.borderingTerritories) {
        if (!availableBorderingTerritories.includes(borderingTerritory)
            && borderingTerritory.nation
            && borderingTerritory.nation.alliance !== this.props.alliance) {
              availableBorderingTerritories.push(borderingTerritory);
        }
      }
    }

    // gets all other (non-bordering) enemy territories, just in case
    let availableDisconnectedTerritories = [];
    for (let territory of this.props.allTerritories) {
      if (!availableBorderingTerritories.includes(territory)
          && territory.nation
          && territory.nation.alliance !== this.props.alliance) {
            availableDisconnectedTerritories.push(territory);
      }
    }

    return (
      <div className="TerritoryDisplay">

        <button onClick={() => this.props.proceed()}>
          Combat Finished!
        </button>

        <div className="owned">
          {this.props.territories.map(territory => 
            <TerritoryListing
              territory={territory}
              onClick={() => {}}
              key={territory.name}
            />
          )}
        </div>

        <div className="bordering">
          {availableBorderingTerritories.map(territory => 
            <TerritoryListing
              territory={territory}
              onClick={() => this.props.conquerTerritory(territory)}
              key={territory.name}
            />
          )}
        </div>

        <div className="disconnected">
          {availableDisconnectedTerritories.map(territory => 
            <TerritoryListing
              territory={territory}
              onClick={() => this.props.conquerTerritory(territory)}
              key={territory.name}
            />
          )}
        </div>

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