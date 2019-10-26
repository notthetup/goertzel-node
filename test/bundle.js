(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var GF = require('goertzel-filter');

function GoertzelNode (context, chunkSize){
  if (!context){
    console.error('No AudioContext provided');
    return;
  }

  chunkSize = chunkSize || 256;

  var processor = context.createScriptProcessor(chunkSize,1,1);
  var gf = new GF();
  gf.init(440, context.sampleRate, chunkSize);

  processor.power = 0;
  processor.threshold = 0.21;

  Object.defineProperty(processor,'targetFrequency',{
    set: function(freq){
      gf.init(freq,context.sampleRate, chunkSize);
    },
    get: function(){
      return gf.targetFrequency;
    }
  });

  var _channel = 0;
  Object.defineProperty(processor,'channel',{
    set: function(channel){
      _channel = channel;
    },
    get: function(){
      return _channel;
    }
  });

  this.passthrough = true;

  processor.onaudioprocess = function(audioProcessingEvent){
    var inputBuffer = audioProcessingEvent.inputBuffer;
    var outputBuffer = audioProcessingEvent.outputBuffer;

    processor.power = gf.run(inputBuffer.getChannelData(_channel));
    processor.detected = processor.power > processor.threshold;

    if (this.passthrough){
      for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
        var inputData = inputBuffer.getChannelData(channel);
        outputBuffer.copyToChannel(inputData,channel,0);
      }
    }
  };

  return processor;
}

GoertzelNode.prototype.connect = function(){
  this.processor.connect.apply(this.processor,arguments);
};


GoertzelNode.prototype.disconnect = function(){
  this.processor.disconnect.apply(this.processor,arguments);
};


module.exports = GoertzelNode

},{"goertzel-filter":2}],2:[function(require,module,exports){
(function (global){
function GoertzelFilterASM(stdlib, foreign, heap){
  'use asm';

  var cos = stdlib.Math.cos;
  var PI = stdlib.Math.PI;
  var samplesArray = new stdlib.Float32Array(heap);

  var coefficient = 0.0;
  var length = 0;
  // eslint-disable-next-line no-unused-vars
  var targetFrequency = 0.0;

  function init(dFreq,sFreq,len){
    dFreq = +dFreq;
    sFreq = +sFreq;
    len = len | 0;

    length = len;

    coefficient= 2.0*cos(2.0*PI*dFreq/sFreq);
    targetFrequency = dFreq;
  }

  function run(){
    var index = 0;
    var prev0 = 0.0;
    var prev1 = 0.0;
    var s = 0.0;
    for(;(index|0) < (length|0); index=(index+1)|0){
      s = +samplesArray[index << 2 >> 2] + +(coefficient * prev0) - +prev1;
      prev1 = prev0;
      prev0 = s;
    }
    return ((prev1*prev1)+(prev0*prev0)-(coefficient*prev0*prev1))/+(length|0)/+(length|0);
  }

  return {
    init: init,
    run: run
  };
}

module.exports = function(){
  var targetFrequency = 0;
  var heapBuffer;
  var goertzelfilter;
  return {
    init: function(dFreq,sFreq,length){
      var stdlib;
      var heap = new ArrayBuffer(0x10000);
      heapBuffer =new Float32Array(heap);

      if (typeof window !== 'undefined'){
        stdlib = window;
      }else{
        stdlib = global;
      }

      targetFrequency = dFreq;
      goertzelfilter = GoertzelFilterASM(stdlib, {}, heap);
      goertzelfilter.init(dFreq,sFreq,length);
    },
    run: function(samples){
      heapBuffer.set(samples);
      return goertzelfilter.run();
    },
    targetFrequency: targetFrequency
  };
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
var GoertzelNode = require('../index.js');

window.addEventListener('load', function(){
  document.getElementById('btn').addEventListener('click', function () {
    window.AudioContext = window.webkitAudioContext || window.AudioContext;

    var audioContext = new AudioContext();
    var osc = audioContext.createOscillator();

    var gn1 = new GoertzelNode(audioContext);
    var gn2 = new GoertzelNode(audioContext);

    gn1.passthrough = true;
    gn2.passthrough = true;

    gn1.targetFrequency = 440;
    gn2.targetFrequency = 220;


    osc.connect(gn1);
    gn1.connect(audioContext.destination);

    osc.connect(gn2);
    gn2.connect(audioContext.destination);

    osc.start();

    var tFreqSlider = document.querySelector('#tFreq');
    var tFreqLabel = document.querySelector('#tFreqLabel');
    var dFreqSlider1 = document.querySelector('#dFreq1');
    var dFreqLabel1 = document.querySelector('#dFreqLabel1');
    var dFreqSlider2 = document.querySelector('#dFreq2');
    var dFreqLabel2 = document.querySelector('#dFreqLabel2');

    tFreqSlider.addEventListener('input', function () {
      var tFreq = parseFloat(tFreqSlider.value);
      osc.frequency.value = tFreq;
      tFreqLabel.innerHTML = tFreq + ' Hz';
    });

    dFreqSlider1.addEventListener('input', function () {
      var dFreq = parseFloat(dFreqSlider1.value);
      gn1.targetFrequency = dFreq;
      dFreqLabel1.innerHTML = dFreq + ' Hz';
    });

    dFreqSlider2.addEventListener('input', function () {
      var dFreq2 = parseFloat(dFreqSlider2.value);
      gn2.targetFrequency = dFreq2;
      dFreqLabel2.innerHTML = dFreq2 + ' Hz';
    });

    window.setInterval(function () {
      console.table([['GN #1 (' + gn1.targetFrequency + ' Hz ): ', gn1.power, gn1.detected], ['GN #2 (' + gn2.targetFrequency + ' Hz ): ', gn2.power, gn2.detected]]);
    }, 1000);
  });
});

},{"../index.js":1}]},{},[3]);
