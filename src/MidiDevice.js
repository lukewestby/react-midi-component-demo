import React, { Component, PropTypes, Children } from 'react';

export default class MidiDevice extends Component {

  static propTypes = {
    device: PropTypes.any.isRequired,
  };

  static childContextTypes = {
    device: PropTypes.any.isRequired,
  };

  constructor(props, ...args) {
    super(props, ...args);
    this.device = props.device;
  }

  getChildContext() {
    return {
      device: this.device,
    };
  }

  render() {
    return (
      <div data-midi-root>
        {this.props.children}
      </div>
    );
  }
}
