# goertzel-node

##### A WebAudio Node that implements the [goertzel algorithm](https://en.wikipedia.org/wiki/Goertzel_algorithm).

> The Goertzel algorithm is a Digital Signal Processing (DSP) technique that provides a means for __efficient__ evaluation of individual terms of the Discrete Fourier Transform (DFT),

-[Wikipedia](https://en.wikipedia.org/wiki/Goertzel_algorithm)

This package implement a WebAudio node which detects if a specified frequency is present in the audio stream using the goertzel algorithm.

## Features

- Exposes a (settable) threshold based simple boolean `detected`.
- Runs in real-time in WebAudio using a ScriptProcessorNode.
- Efficient and performant.
- Uses [asm.js](https://en.wikipedia.org/wiki/Asm.js) if available in the browser.
- Passes through the audio stream for further processing and output.
- Allows specification of which channel is to be analyzed.

## ToDo

- Move to upcoming AudioWorkletNode when available.

## Internals

GoertzelNode uses the ScriptProcessorNode and performs the Goertzel algorithm on every chunk of data that comes through the ScriptProcessorNode. The calculations are performed on a chunk by chunk bases and the outputs (`power`, and `detected`) are updated on every chunk as well.


# Usage

The package exposes a node.js style API, and is designed to be used tools such as [browserify](http://browserify.org/).

A [standalone browserified](http://www.forbeslindesay.co.uk/post/46324645400/standalone-browserify-builds) file is also [available here](https://github.com/notthetup/goertzel-node/blob/master/dist/goertzelnode.js), which creates a global named `GoertzelNode` when included in the html.

`npm install goertzel-node`

```js

var GoertzelNode = require('goertzel-node'); // only if using browserify.

var audioContext = new AudioContext();
var osc = audioContext.createOscillator();
var gn = new GoertzelNode(audioContext);

gn.targetFrequency = 440; // 440Hz

osc.connect(gn);
gn.connect(audioContext.destination);
osc.start(0);

var result = gn.detected; //boolean true/false

```

# API

## Constructor

- `GoertzelNode` : Creates a new GoertzelNode.
	- eg :
  ```js
  var gn = new GoertzelNode(audioContext);
  ```

  - arguments:
		- `audioContext` : __AudioContext__ - The [AudioContext](http://webaudio.github.io/web-audio-api/#the-audiocontext-interface) within which the GoertzelNode is to be created.

## Methods

- `connect` : Connects the GoertzelNode to other WebAudio Nodes. This is exactly the same as the [connect method](https://webaudio.github.io/web-audio-api/#methods-3) of [ScriptProcessorNode](https://webaudio.github.io/web-audio-api/#the-scriptprocessornode-interface---deprecated).
- `disconnect` : Disconnects the GoertzelNode from other WebAudio Nodes. This is exactly the same as the [disconnect method](https://webaudio.github.io/web-audio-api/#methods-3) of [ScriptProcessorNode](https://webaudio.github.io/web-audio-api/#the-scriptprocessornode-interface---deprecated).

## Properties


- `targetFrequency`: __Number__ - The value of the frequency (in Hertz) that is to be detected by the GoertzelNode. It defaults to 440.

	eg:
	```
	gn.targetFrequency = 440; // Set the frequency to be detected to be 440.
	```
  - `targetFrequency` can be set at any time. Once set, the GoertzelNode will start calculating and outputting the values for that frequency at every chunk.

- `channel`: __Number__ - The value of the frequency that is to be detected by the GoertzelNode. The default value is 1.

	eg:
	```
	gn.channel = 1; // Set the channel of the input audio stream to be analyzed.
	```
  - Since WebAudio streams can have multiple channels and the Goertzel algorithm run on individual channels, this property allows one to choose which channel to run the  Goertzel algorithm on.
  -

- `power`: __Number__ - Returns the power of the audio of the input audio stream at the `targetFrequency`.

	eg:
	```
	var power = gn.power;  // Get the power.
	```
  - This is the result of Goertzel algorithm. It can be used to decide if enough energy is detected at the `targetFrequency`.

- `threshold`: __Number__ - Sets a threshold of power used to decide if the `targetFrequency` was `detected`.

	eg:
	```
	gn.threshold = 2000;  // Set the threshold to 2000.
	```
  - If calculated `power` power is higher than `threshold` then `detected` is set as true.

- `detected`: __Boolean__ - Returns if the `targetFrequency` was detected in the input audio stream.

	eg:
	```
	var detected = gn.detected; // If the frequency was detected in the input audio stream.
	```

# License

MIT

See License file
