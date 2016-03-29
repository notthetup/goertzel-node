var gf = require('goertzel-filter');

function GoertzelNode (context, chunkSize){
  if (!context){
    console.error("No AudioContext provided");
    return;
  }

  chunkSize = chunkSize || 256;

  var processor = context.createScriptProcessor(chunkSize,1,1);
  gf.init(540, context.sampleRate, chunkSize);

  processor.power = 0;
  processor.treshold = 2000;

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

  processor.onaudioprocess = function(audioProcessingEvent){
    var inputBuffer = audioProcessingEvent.inputBuffer;
    var outputBuffer = audioProcessingEvent.outputBuffer;

    processor.power = gf.run(inputBuffer.getChannelData(_channel));
    processor.detected = processor.power > processor.treshold;

    for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
      var inputData = inputBuffer.getChannelData(channel);
      outputBuffer.copyFromChannel(inputData,channel,0);
    }
  }

  return processor;
}

GoertzelNode.prototype.connect = function(){
  processor.connect.apply(processor,arguments);
}


GoertzelNode.prototype.disconnect = function(){
  processor.disconnect.apply(processor,arguments);
}


module.exports = GoertzelNode
