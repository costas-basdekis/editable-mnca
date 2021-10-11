import React, { Component } from "react";

import RuleEditor from "./RuleEditor";

export default class RulesEditor extends Component {
  render() {
    const {type, rules, neighbourhoods, onChange} = this.props;

    return rules.map((rule, index) => (
      <RuleEditor 
        key={index} 
        type={type}
        index={index} 
        rule={rule} 
        rules={rules} 
        neighbourhoods={neighbourhoods} 
        onChange={onChange} 
      />
    ));
  }
}
