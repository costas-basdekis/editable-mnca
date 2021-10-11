import React, { Component } from "react";
import { createSelector } from "reselect";

export default class FpsViewer extends Component {
  state = {
    durations: [],
  };

  componentDidMount() {
    if (this.props.onRenderRef) {
      this.props.onRenderRef(this.onRender);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.onRenderRef && prevProps.onRenderRef !== this.props.onRenderRef) {
      this.props.onRenderRef(this.onRender);
    }
  }
  
  render() {
    const {fps} = this;

    return (
      <label>
        FPS:{" "}
        {fps === null ? "N/A" : ~~fps}
      </label>
    );
  }

  fpsSelector = createSelector(
    ({durations}) => durations,
    durations => {
      if (!durations.length) {
        return null;
      }
      const averageDurationS = durations.reduce((tot, cur) => tot + cur) / durations.length / 1000;
      return 1 / averageDurationS;
    },
  );
  get fps() {
    return this.fpsSelector(this.state);
  }

  onRender = duration => {
    if (duration === null) {
      this.setState({durations: []});
      return;
    }
    this.setState(({durations}) => ({
      durations: [...(durations.length < 30 ? durations : durations.slice(durations.length - 30 + 1)), duration],
    }));
  };
}
