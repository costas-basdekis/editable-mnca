import React, { Component, Fragment } from "react";

import {RangeSlider} from "../sliderComponents";

const ruleDomain = [0, 100];

export default class RuleEditor extends Component {
  state = {
    min: this.props.rule.min,
    max: this.props.rule.max,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.rule.min === state.min && props.rule.max === state.max) {
      return null;
    }
    return {
      min: props.rule.min,
      max: props.rule.max,
    };
  }

  render() {
    const {type, index, rule, rules, neighbourhoods} = this.props;
    const {min, max} = this.state;
    const ruleCount = rules.length;

    return (
      <Fragment>
        Rule {index + 1}#
        <label>
          Neighbourhood: 
          <select 
            value={rule.neighbourhoodIndex} 
            onChange={this.onNeighbourhoodChange}
          >
            {neighbourhoods.map((_, neighbourhoodIndex) => (
              <option 
                key={neighbourhoodIndex}
                value={neighbourhoodIndex}
              >
                Neighbourhood {neighbourhoodIndex + 1}
              </option>
            ))}
          </select>
        </label>
        {type === "discrete" ? (
          <Fragment>
            <label>
              Dead 
              <input 
                type="radio"
                checked={!rule.result}
                name={`rule${index}result`}
                onChange={this.onDeadChange}
              />
            </label>
            <label>
              Alive
              <input 
                type="radio"
                checked={rule.result}
                name={`rule${index}result`} 
                onChange={this.onAliveChange}
              />
            </label>
          </Fragment>
        ) : type === "continuous" ? (
          <Fragment>
            <label>
              Decrease 
              <input 
                type="radio"
                checked={rule.result === -1}
                name={`rule${index}result`}
                onChange={this.onDecreaseChange}
              />
            </label>
            <label>
              Increase
              <input 
                type="radio"
                checked={rule.result === 1}
                name={`rule${index}result`} 
                onChange={this.onIncreaseChange}
              />
            </label>
          </Fragment>
        ) : null}
        <button 
          disabled={index === 0} 
          onClick={this.onMoveUpClick}
        >
          Move Up
        </button>
        <button 
          disabled={index === ruleCount - 1} 
          onClick={this.onMoveDownClick}
        >
          Move Down
        </button>
        <button 
          onClick={this.onAddAfterClick}
        >
          Add rule after
        </button>
        <button 
          disabled={ruleCount === 1}
          title={
            ruleCount === 1 ? "Cannot delete only rule" : undefined
          }
          onClick={this.onDeleteClick}
        >
          Delete rule
        </button>
        <br/>
        Min ({">"}): 
        <input 
          type={"textbox"} 
          size={5} 
          value={min} 
          onChange={this.onMinChange}
          onKeyUp={this.onMinKeyUp} 
          onBlur={this.onMinBlur} 
        />
        Max ({"<="}): 
        <input 
          type={"textbox"} 
          size={5} 
          value={max} 
          onChange={this.onMaxChange}
          onKeyUp={this.onMaxKeyUp} 
          onBlur={this.onMaxBlur} 
        />
        <RangeSlider  
          domain={ruleDomain} 
          defaultValues={[~~rule.min, ~~rule.max]}
          onChange={this.onRuleSliderChange}
        />
      </Fragment>
    );
  }

  updateRules(newRules) {
    if (!this.props.onChange) {
      return;
    }
    this.props.onChange(newRules);
  }

  updateRule(newPartialRule) {
    if (!this.props.onChange) {
      return;
    }
    const {index, rule, rules} = this.props;
    const newRule = {...rule, ...newPartialRule};
    this.updateRules([
      ...rules.slice(0, index),
      newRule,
      ...rules.slice(index + 1),
    ]);
  }
  
  onDeadChange = () => {
    this.updateRule({result: false});
  };

  onAliveChange = () => {
    this.updateRule({result: true});
  }

  onDecreaseChange = () => {
    this.updateRule({result: -1});
  };

  onIncreaseChange = () => {
    this.updateRule({result: 1});
  }

  onNeighbourhoodChange = ({target: {value}}) => {
    this.updateRule({neighbourhoodIndex: parseInt(value, 10)});
  }

  onMoveUpClick = () => {
    const {index, rule, rules} = this.props;
    this.updateRules([
      ...rules.slice(0, index - 1),
      rule,
      rules[index - 1],
      ...rules.slice(index + 1),
    ]);
  }

  onMoveDownClick = () => {
    const {index, rule, rules} = this.props;
    this.updateRules([
      ...rules.slice(0, index),
      rules[index + 1],
      rule,
      ...rules.slice(index + 2),
    ]);
  }

  onAddAfterClick = () => {
    const {index, rules} = this.props;
    this.updateRules([
      ...rules.slice(0, index + 1),
      {min: 20, max: 40, result: false, neighbourhoodIndex: 0},
      ...rules.slice(index + 1),
    ]);
  }

  onDeleteClick = () => {
    const {index, rules} = this.props;
    this.updateRules([
      ...rules.slice(0, index),
      ...rules.slice(index + 1),
    ]);
  }

  onMinChange = ({target: {value}}) => {
    this.setState({min: parseInt(value, 10)});
  };

  onMinKeyUp = e => {
    if (e.keyCode !== 13) {
      return;
    }
    this.onMinBlur(e);
  };

  onMinBlur = ({target: {value}}) => {
    this.updateRule({min: parseInt(value, 10)});
  };

  onMaxChange = ({target: {value}}) => {
    this.setState({max: parseInt(value, 10)});
  };

  onMaxKeyUp = e => {
    if (e.keyCode !== 13) {
      return;
    }
    this.onMaxBlur(e);
  };

  onMaxBlur = ({target: {value}}) => {
    this.updateRule({max: parseInt(value, 10)});
  };

  onRuleSliderChange = ([min, max]) => {
    this.updateRule({min, max});
  }
}
