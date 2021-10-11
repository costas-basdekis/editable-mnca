import React, { Component } from "react";
import { createSelector } from "reselect";
import _ from "underscore";

export default class NeigbhourhoodVisualisation extends Component {
  render() {
    const {size = 100} = this.props;
    const maxRadius = this.maxRadius;
    const grid = this.grid;
    const cellSize = size / (maxRadius * 2 + 1);

    return (
      <svg width={size} height={size} style={{border: "1px solid black"}}>
        {grid.map(({x, y, isCenter, isActive}) => (
          <rect 
            key={`${x}-${y}`}
            x={(x + maxRadius) * cellSize} 
            y={(y + maxRadius) * cellSize} 
            width={cellSize} 
            height={cellSize} 
            stroke={"black"}
            fill={isCenter ? "red" : isActive ? "white" : "grey"}
          />
        ))}
      </svg>
    );
  }

  maxRadiusSelector = createSelector(
    ({neighbourhood}) => neighbourhood.rings,
    rings => {
      const radiuses = rings
        .map(neighbourhood => neighbourhood.maxRadius);
      return Math.max(...radiuses);
    },
  );

  get maxRadius() {
    return this.maxRadiusSelector(this.props);
  }

  gridSelector = createSelector(
    ({neighbourhoodType}) => neighbourhoodType,
    createSelector(
      this.maxRadiusSelector,
      ({neighbourhood}) => neighbourhood.rings,
      (maxRadius, rings) => {
        const radiuses = _.range(maxRadius + 1).map(() => false);
        for (const ring of rings) {
          for (const radius of _.range(ring.minRadius + 1, ring.maxRadius + 1)) {
            radiuses[radius] = true;
          }
        }
        return radiuses;
      },
    ),
    this.maxRadiusSelector,
    (neighbourhoodType, radiuses, maxRadius) => {
      const grid = _.range(-maxRadius, maxRadius + 1).map(
        x => _.range(-maxRadius, maxRadius + 1).map(
          y => ({x, y}))).flat();
      grid.forEach(cell => {
        cell.isCenter = cell.x === 0 && cell.y === 0;
        if (neighbourhoodType === "round") {
          cell.distance = Math.floor(Math.sqrt(cell.x * cell.x + cell.y * cell.y) + 0.5);
        } else if(neighbourhoodType === "square") {
          cell.distance = Math.max(Math.abs(cell.x), Math.abs(cell.y));
        } else {
          cell.distance = null;
        }
        cell.isActive = !!radiuses[cell.distance];
      });
      return grid;
    },
  );

  get grid() {
    return this.gridSelector(this.props);
  }
}
