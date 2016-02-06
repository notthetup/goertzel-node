var gf = require('goertzel-filter');

function GoertzelNode (context){
  if (!context){
    console.error("No AudioContext provided");
    return;
  }

  this.power = 0;

  Object.defineProperty(this,'targetFrequency',{
    set: function(freq){
      gf.targetFrequency = freq;
    },
    get: function(){
      return gf.targetFrequency;
    }
  });

  this.processor = context.createScriptProcessor(128,1,1);

  scriptNode.onaudioprocess = function(audioProcessingEvent){
     var inputBuffer = audioProcessingEvent.inputBuffer;
     this.power = gf.run(inputBuffer.getChannelData(channel));
  }
}

GoertzelNode.prototype.connect = function(){
  processor.connect.apply(processor,arguments);
}


GoertzelNode.prototype.disconnect = function(){
  processor.disconnect.apply(processor,arguments);
}


module.exports = GoertzelNode
