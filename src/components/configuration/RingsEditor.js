import React, { Component } from "react";

import RingEditor from "./RingEditor";

export default class RingsEditor extends Component {
  render() {
    const {neighbourhoodIndex, rings, onChange} = this.props;

    return (
      rings.map((ring, index) => (
        <RingEditor 
          key={index}
          neighbourhoodIndex={neighbourhoodIndex}
          index={index}
          ring={ring}
          rings={rings}
          onChange={onChange}
        />
      ))
    );
  }
}
