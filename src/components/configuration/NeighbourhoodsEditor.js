import React, { Component } from "react";
import { createSelector } from "reselect";

import NeighbourhoodEditor from "./NeighbourhoodEditor";

export default class NeighbourhoodsEditor extends Component {
  rulesSelector = ({rules}) => rules;
  referencedNeighbourIndexesSelector = createSelector(
    this.rulesSelector,
    rules => {
      const neighbourIndexes = rules
        .map(rule => rule.neighbourhoodIndex);
      return Array.from(new Set(neighbourIndexes)).sort();
    },
  );

  get referencedNeighbourIndexes() {
    return this.referencedNeighbourIndexesSelector(this.props);
  }

  render() {
    const {neighbourhoodType, neighbourhoods, onChange} = this.props;

    return neighbourhoods.map((neighbourhood, index) => (
      <NeighbourhoodEditor 
        key={index} 
        neighbourhoodType={neighbourhoodType}
        index={index} 
        neighbourhood={neighbourhood} 
        neighbourhoods={neighbourhoods} 
        referencedNeighbourIndexes={this.referencedNeighbourIndexes}
        onChange={onChange} 
      />
    ));
  }
}
