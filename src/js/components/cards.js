import React from 'react';
import '../../css/game.css';

export class Card extends React.Component {
  render() {
    let name = "grid-item"// pos"+this.props.index;
    return (
      <div id="tile-1" className={`card ${name}`}>
        <h1>{this.props.val}</h1>
      </div>
    );
  }
}
