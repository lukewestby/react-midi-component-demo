import { Effects, loop } from 'redux-loop';
import { Map, List } from 'immutable';
import { Actions } from './update';

export default () => {
  return loop(
    Map({
      loadingMidiNames: false,
      loadMidiNamesFailed: false,
      midiNames: List(),
      buttonStates: Map({
        kick1: false,
        kick2: false,
        kick3: false,
        snare: false,
        clapSnare: false,
        hat: false,
      }),
      input: Map({
        selectedName: null,
        openingDevice: false,
        openDeviceFailed: false,
        selectedDevice: null,
      }),
      output: Map({
        selectedName: null,
        openingDevice: false,
        openingDeviceFailed: false,
        selectedDevice: null,
      }),
    }),
    Effects.constant(Actions.loadMidiNamesStart())
  );
};
