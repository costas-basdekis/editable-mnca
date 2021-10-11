import React, { Component, Fragment } from "react";

import { RangeSlider } from "../sliderComponents";

const ringDomain = [0, 20];

export default class RingEditor extends Component {
  render() {
    const {neighbourhoodIndex, index, ring, rings} = this.props;
    const ringCount = rings.length;
    const isRangeInteger = (
      ring.minRadius === ~~ring.minRadius
      && ring.maxRadius === ~~ring.maxRadius
    );

    return (
      <Fragment>
        <br/>
        Ring {neighbourhoodIndex + 1}.{index + 1}#
        <button 
          disabled={index === 0} 
          onClick={this.onMoveUpClick}
        >
          Move Up
        </button>
        <button 
          disabled={index === ringCount - 1} 
          onClick={this.onMoveDownClick}
        >
          Move Down
        </button>
        <button 
          onClick={this.onAddAfterClick}
        >
          Add ring after
        </button>
        <button 
          disabled={ringCount === 1}
          title={
            ringCount === 1 ? "Cannot delete only ring" : undefined
          }
          onClick={this.onDeleteClick}
        >
          Delete ring
        </button>
        {!isRangeInteger ? (
          <span style={{color: "red"}}>Range edges are not integers, so if you change them, you won't be able to reset them individually</span>
        ) : null}
        <RangeSlider
          domain={ringDomain} 
          defaultValues={[~~ring.minRadius, ~~ring.maxRadius]}
          onChange={this.onSliderChange}
        />
      </Fragment>
    );
  }

  updateRings(newRings) {
    if (!this.props.onChange) {
      return;
    }
    this.props.onChange(newRings);
  }

  updateRing(newPartialRing) {
    if (!this.props.onChange) {
      return;
    }
    const {index, ring, rings} = this.props;
    const newRing = {...ring, ...newPartialRing};
    this.updateRings([
      ...rings.slice(0, index),
      newRing,
      ...rings.slice(index + 1),
    ]);
  }
  
  onMoveUpClick = () => {
    const {index, ring, rings} = this.props;
    this.updateRings([
      ...rings.slice(0, index - 1),
      ring,
      rings[index - 1],
      ...rings.slice(index + 1),
    ]);
  }

  onMoveDownClick = () => {
    const {index, ring, rings} = this.props;
    this.updateRings([
      ...rings.slice(0, index),
      rings[index + 1],
      ring,
      ...rings.slice(index + 2),
    ]);
  }

  onAddAfterClick = () => {
    const {index, rings} = this.props;
    this.updateRings([
      ...rings.slice(0, index + 1),
      {minRadius: 2, maxRadius: 5},
      ...rings.slice(index + 1),
    ]);
  }

  onDeleteClick = () => {
    const {index, rings} = this.props;
    this.updateRings([
      ...rings.slice(0, index),
      ...rings.slice(index + 1),
    ]);
  }

  onSliderChange = ([minRadius, maxRadius]) => {
    this.updateRing({minRadius, maxRadius});
  }
}