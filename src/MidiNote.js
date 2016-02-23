import React, { PropTypes } from 'react'
import { write, subscribe } from './midi';

const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;

export default class MidiNote extends React.Component {

  static propTypes = {
    note: PropTypes.number.isRequired,
    velocity: PropTypes.number,
    on: PropTypes.bool,
    onNoteOn: PropTypes.func,
    onNoteOff: PropTypes.func
  };

  static contextTypes = {
    device: PropTypes.object.isRequired,
  };

  static defaultProps = {
    on: false
  };

  construct(element) {
    this._currentElement = element;
    this._currentProps = element.props;
    this._device = null;
    this._unsubscribe = null;
  }

  mountComponent(rootID, transaction, context) {
    this._device = context.device;
    this._unsubscribe = subscribe(this.onMidiMessage, this._device);
    this._currentProps = this.update({}, this._currentProps);
  }

  receiveComponent(nextElement, transaction, context) {
    this._currentElement = nextElement;
    this._currentProps = this.update(this._currentProps, nextElement.props)
  }

  unmountComponent() {
    this._unsubscribe && this._unsubscribe();
  }

  onMidiMessage = (event) => {
    const type = event.data[0] & 0xf0;
    const note = event.data[1];
    const velocity = event.data[2];

    if(note !== this._currentProps.note) {
      return;
    }

    if(type === NOTE_ON && this._currentProps.onNoteOn) {
      this._currentProps.onNoteOn(event.data[2]);
    } else if(type === NOTE_OFF && this._currentProps.onNoteOff) {
      this._currentProps.onNoteOff(event.data[2]);
    }
  };

  update(oldProps, newProps) {
    if(
      oldProps.on !== newProps.on ||
      oldProps.note !== newProps.note ||
      oldProps.velocity !== newProps.velocity
    ) {
      write(
        newProps.on ? NOTE_ON : NOTE_OFF,
        newProps.note,
        newProps.velocity,
        this._device
      );
    }
    return newProps;
  }
}
