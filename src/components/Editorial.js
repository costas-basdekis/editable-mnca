import React, {Component} from "react";

const blogPostLink = "https://slackermanz.com/understanding-multiple-neighborhood-cellular-automata/"
const originalShaderToyLink = "https://www.shadertoy.com/view/7ll3R7";
const forkedShaderToyLink = "https://www.shadertoy.com/view/ss3Xz8";
const codeLink = "https://codesandbox.io/s/keen-elion-2ghjn";

export default class Editorial extends Component {
  render() {
    return (
      <div>
        <h2>Editable Multiple Network Cellular Automata</h2>
        <h3>Inspiration</h3>
        <p>
          Slackerman introduced MCNA in one of his <a href={blogPostLink}>Slackermanz' blog posts</a>, 
          which also included the shader code for some examples.
        </p>

        <p>
          I was fascinated by <a href={originalShaderToyLink}>one in particular</a>, 
          I quickly <a href={forkedShaderToyLink}>edited it a bit</a>, and 
          I run three independent versions of the concept, one for each red, 
          green, blue channels.
        </p>
        <h3>Purpose</h3>
        <p>
          I really wanted to see how does the automaton behave with different rules, so I spent some
          time to refactor the code a bit, and make it easy to pass the parameters.
        </p>
        <p>
          Hopefully, this will lead to the discovery of more interesting rules, and an easier way to 
          research MCNA!
        </p>
        <h3>Features</h3>
        <ul>
          <li>3 independent channels or monochrome</li>
          <li>Editable neighbourhoods and rules</li>
          <li>Multiple rings per neighbourhood</li>
          <li>Discrete or continuous calculations</li>
          <li>Round or square neighbourhoods</li>
          <li>Neighbourhood visualition</li>
          <li>Sharable links</li>
          <li>Local saving of custom presets</li>
        </ul>
        <h3>Roadmap</h3>
        <p>
          <a href={codeLink}>Check the code</a>
        </p>
        <ul>
          <li>Arbirtrary definition of neighbourhoods</li>
          <li>Nicer interface</li>
        </ul>
        <h3>Tips</h3>
        <p>
          Run in monochrome, click "Restart", after a while disable the 
          monchrome, and disable "Keep reseeding" after 1 flash - see
          the divergence of each channel spread!
        </p>
      </div>
    );
  }
}
