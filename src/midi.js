const midiDeviceSymbol = Symbol('midiDevice');

const MidiDevice = (input, output) => ({
  [midiDeviceSymbol]: { input, output },
});

export const openMidiDeviceByName = (name) => {
  console.log(name);
  function findInMapByName(map) {
    let result = null;
    map.forEach((device) => {
      if(device.name === name) result = device;
    });
    return result;
  }

  return window.navigator.requestMIDIAccess()
    .then((access) => ({
      input: findInMapByName(access.inputs),
      output: findInMapByName(access.outputs),
    }))
    .then((io) => {
      if (!io.input || !io.output) {
        throw Error('could not find device specified');
      } else {
        return Promise.all([io.input.open(), io.output.open()]);
      }
    })
    .then(([input, output]) => MidiDevice(input, output));
}

export const write = (type, note, velocity, device) => {
  device[midiDeviceSymbol].output.send([type, note, velocity]);
}

export const subscribe = (listener, device) => {
  device[midiDeviceSymbol].input.addEventListener('midimessage', listener);
  return () => {
    device[midiDeviceSymbol].input.removeEventListener('midimessage', listener);
  };
}

export const getMidiDeviceList = () => {
  return window.navigator.requestMIDIAccess()
    .then((access) => [...access.inputs.values()])
    .then((inputs) => inputs.map((input) => input.name));
}
