import { createAction, createReducer } from 'redux-act';
import { loop, Effects } from 'redux-loop';
import { Map, List } from 'immutable';
import { getMidiDeviceList, openMidiDeviceByName } from './midi';

export const Actions = {
  loadMidiNamesStart: createAction('loadMidiNamesStart'),
  loadMidiNamesSuccess: createAction('loadMidiNamesSuccess'),
  loadMidiNamesFailure: createAction('loadMidiNamesFailure'),
  selectDeviceName: createAction('selectInputName', (key, name) => ({ key, name })),
  openDeviceStart: createAction('openDeviceStart', (key, name) => ({ key, name })),
  openDeviceSuccess: createAction('openDeviceSuccess', (key, device) => ({ key, device })),
  openDeviceFailure: createAction('openDeviceFailure'),
  setButtonState: createAction('turnButtonOn', (key, value) => ({ key, value })),
};

const loadMidiNames = () => {
  return getMidiDeviceList()
    .then(Actions.loadMidiNamesSuccess)
    .catch(Actions.loadMidiNamesFailure);
};

const openDevice = (key, name) => {
  return openMidiDeviceByName(name)
    .then((device) => Actions.openDeviceSuccess(key, device))
    .catch(() => Actions.openDeviceFailure(key));
};

export const reducer = createReducer({
  [Actions.loadMidiNamesStart]: (state) => {
    return loop(
      state
        .set('loadingMidiNames', true)
        .set('loadMidiNamesFailed', false)
        .set('selectedInputName', null),
      Effects.promise(loadMidiNames)
    );
  },
  [Actions.loadMidiNamesSuccess]: (state, names) => {
    return state
      .set('loadingMidiNames', false)
      .set('midiNames', List(names));
  },
  [Actions.loadMidiNamesFailure]: (state, names) => {
    return state
      .set('loadingMidiNames', false)
      .set('loadMidiNamesFailed', true)
      .set('midiNames', List());
  },
  [Actions.selectDeviceName]: (state, { key, name }) => {
    return loop(
      state.setIn([key, 'selectedName'], name ? name : null),
      Effects.constant(Actions.openDeviceStart(key, name))
    );
  },
  [Actions.openDeviceStart]: (state, { key, name }) => {
    return loop(
      state
        .setIn([key, 'selectedDevice'], null)
        .setIn([key, 'openingDevice'], true)
        .setIn([key, 'openDeviceFailed'], false),
      Effects.promise(openDevice, key, name)
    );
  },
  [Actions.openDeviceSuccess]: (state, { key, device }) => {
    return state
      .setIn([key, 'selectedDevice'], device)
      .setIn([key, 'openingDevice'], false);
  },
  [Actions.openDeviceFailure]: (state, key) => {
    return state
      .setIn([key, 'openingDevice'], false)
      .setIn([key, 'openDeviceFailed'], true);
  },
  [Actions.setButtonState]: (state, { key, value }) => {
    return state
      .setIn(['buttonStates', key], value);
  },
});
