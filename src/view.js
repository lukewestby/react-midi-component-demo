import React from 'react';
import MidiDevice from './MidiDevice';
import MidiNote from './MidiNote';
import renderIf from 'render-if';
import { Actions } from './update';
import { Map, List } from 'immutable';

const viewDeviceSelect = ({ context, model, dispatch }) => {
  return (
    <select
      value={model.get('selectedName')}
      onChange={(ev) => dispatch(Actions.selectDeviceName(context.get('key'), ev.target.value))}>
      <option value="">Select {context.get('key')}</option>
      {context.get('midiNames').map((name) => (
        <option key={name} value={name}>{name}</option>
      ))}
    </select>
  );
};

const viewDeviceStatus = ({ model }) => {
  return (
    <div>
      {renderIf(model.get('selectedName') !== null)(() => (
        <div>
          {renderIf(model.get('openingDevice'))(() => (
            <div>Opening {model.get('selectedName')} ...</div>
          ))}
          {renderIf(
            !model.get('openingDevice') &&
            model.get('openDeviceFailed')
          )(() => (
            <div>Could not open {model.get('selectedName')} ...</div>
          ))}
          {renderIf(
            !model.get('openingDevice') &&
            !model.get('openDeviceFailed')
          )(() => (
            <div>{model.get('selectedName')} open!</div>
          ))}
        </div>
      ))}
      {renderIf(model.get('selectedName') === null)(() => (
        <div>No MIDI device selected</div>
      ))}
    </div>
  );
};

const inputNotesMap = Map({
  kick1: 0x12,
  kick2: 0x11,
  kick3: 0x10,
  snare: 0x14,
  clapSnare: 0x13,
  hat: 0x04,
});

const viewInputDevice = ({ context, model, dispatch }) => {
  return renderIf(model.get('selectedDevice'))(() => (
    <MidiDevice device={model.get('selectedDevice')}>
      {context.get('buttonStates').reduce((reduction, state, key) => (
        reduction.push(
          <MidiNote
            key={key}
            note={inputNotesMap.get(key)}
            velocity={state ? 120 : 127}
            on={true}
            onNoteOn={(v) => dispatch(Actions.setButtonState(key, v === 127))} />
        )
      ), List())}
    </MidiDevice>
  ));
};

const outputNotesMap = Map({
  kick1: List([36, 53]),
  kick2: List([36, 43]),
  kick3: List([36, 41]),
  snare: List([40]),
  clapSnare: List([39, 40]),
  hat: List([42])
});

const viewOutputDevice = ({ context, model }) => {
  return renderIf(model.get('selectedDevice'))(() => (
    <MidiDevice device={model.get('selectedDevice')}>
      {context.get('buttonStates').reduce((reduction, state, key) => (
        reduction.concat(
          outputNotesMap.get(key).map((note, index) => (
            <MidiNote
              key={note.toString() + key}
              note={note}
              velocity={127}
              on={state} />
          ))
        )
      ), List())}
    </MidiDevice>
  ));
};

export default ({ model, dispatch }) => {
  const renderIfLoading = renderIf(model.get('loadingMidiNames'));
  const renderIfNotLoading = renderIf(!model.get('loadingMidiNames'));
  const renderIfFailed = renderIf(model.get('loadMidiNamesFailed'));
  const renderIfNotFailed = renderIf(!model.get('loadMidiNamesFailed'));
  return (
    <div>
      {renderIfLoading(() => (
        <div>Loading MIDI Devices...</div>
      ))}
      {renderIfNotLoading(() => (
        <div>
          {renderIfFailed(() => (
            <div>Could not load MIDI Devices :(</div>
          ))}
          {renderIfNotFailed(() => (
            <div>
              <div>
                <h4>Input</h4>
                {viewDeviceSelect({
                  context: Map({
                    midiNames: model.get('midiNames'),
                    key: 'input'
                  }),
                  model: model.get('input'),
                  dispatch,
                })}
                {viewDeviceStatus({ model: model.get('input') })}
                {viewInputDevice({
                  context: Map({ buttonStates: model.get('buttonStates') }),
                  model: model.get('input'),
                  dispatch,
                })}
              </div>
              <div>
                <h4>Output</h4>
                {viewDeviceSelect({
                  context: Map({
                    midiNames: model.get('midiNames'),
                    key: 'output',
                  }),
                  model: model.get('output'),
                  dispatch,
                })}
                {viewDeviceStatus({ model: model.get('output') })}
                {viewOutputDevice({
                  context: Map({ buttonStates: model.get('buttonStates') }),
                  model: model.get('output'),
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
