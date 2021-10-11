import React, { Component, Fragment } from "react";
import { NeigbhourhoodVisualisation, RingsEditor } from ".";

export default class NeighbourhoodEditor extends Component {
  render() {
    const {
      neighbourhoodType,
      index, neighbourhood, neighbourhoods, 
      referencedNeighbourIndexes,
    } = this.props;
    const neighbourhoodCount = neighbourhoods.length;

    return (
      <Fragment>
        Neighbourhood {index + 1}#
        <button 
          disabled={index === 0} 
          onClick={this.onMoveUpClick}
        >
          Move Up
        </button>
        <button 
          disabled={index === neighbourhoodCount - 1} 
          onClick={this.onMoveDownClick}
        >
          Move Down
        </button>
        <button 
          onClick={this.onAddAfterClick}
        >
          Add neighbourhood after
        </button>
        <button 
          disabled={
            neighbourhoodCount === 1 
            || referencedNeighbourIndexes.includes(index)
          }
          title={
            neighbourhoodCount === 1 
              ? "Cannot delete only neighbourhood" 
              : referencedNeighbourIndexes.includes(index) 
                ? "Cannot delete neighbour referenced by rules" 
                : undefined
          }
          onClick={this.onDeleteClick}
        >
          Delete neighbourhood
        </button>
        <br/>
        <NeigbhourhoodVisualisation
          neighbourhoodType={neighbourhoodType}
          neighbourhood={neighbourhood}
        />
        <RingsEditor 
          neighbourhoodIndex={index}
          rings={neighbourhood.rings}
          onChange={this.onRingsChange}
        />
      </Fragment>
    );
  }

  updateNeighbourhoods(newNeighbourhoods) {
    if (!this.props.onChange) {
      return;
    }
    this.props.onChange(newNeighbourhoods);
  }

  updateNeighbourhood(newPartialNeighbourhood) {
    if (!this.props.onChange) {
      return;
    }
    const {index, neighbourhood, neighbourhoods} = this.props;
    const newNeighbourhood = {...neighbourhood, ...newPartialNeighbourhood};
    this.updateNeighbourhoods([
      ...neighbourhoods.slice(0, index),
      newNeighbourhood,
      ...neighbourhoods.slice(index + 1),
    ]);
  }
  
  onRingsChange = rings => {
    this.updateNeighbourhood({rings});
  }

  onSliderChange = ([minRadius, maxRadius]) => {
    this.updateNeighbourhood({minRadius, maxRadius});
  }

  onMoveUpClick = () => {
    const {index, neighbourhood, neighbourhoods} = this.props;
    this.updateNeighbourhoods([
      ...neighbourhoods.slice(0, index - 1),
      neighbourhood,
      neighbourhoods[index - 1],
      ...neighbourhoods.slice(index + 1),
    ]);
  }

  onMoveDownClick = () => {
    const {index, neighbourhood, neighbourhoods} = this.props;
    this.updateNeighbourhoods([
      ...neighbourhoods.slice(0, index),
      neighbourhoods[index + 1],
      neighbourhood,
      ...neighbourhoods.slice(index + 2),
    ]);
  }

  onAddAfterClick = () => {
    const {index, neighbourhoods} = this.props;
    this.updateNeighbourhoods([
      ...neighbourhoods.slice(0, index + 1),
      {minRadius: 2, maxRadius: 4},
      ...neighbourhoods.slice(index + 1),
    ]);
  }

  onDeleteClick = () => {
    const {index, neighbourhoods} = this.props;
    this.updateNeighbourhoods([
      ...neighbourhoods.slice(0, index),
      ...neighbourhoods.slice(index + 1),
    ]);
  }
}
