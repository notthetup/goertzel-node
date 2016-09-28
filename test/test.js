var GoertzelNode = require('../index.js');

window.addEventListener('load', function(){
  window.AudioContext = window.webkitAudioContext || window.AudioContext;

  var audioContext = new AudioContext();
  var osc = audioContext.createOscillator();
  var gn = new GoertzelNode(audioContext);
  gn.passthrough = true;

  osc.connect(gn);
  gn.connect(audioContext.destination);

  osc.start();

  var tFreqSlider = document.querySelector('#tFreq');
  var tFreqLabel = document.querySelector('#tFreqLabel');
  var dFreqSlider = document.querySelector('#dFreq');
  var dFreqLabel = document.querySelector('#dFreqLabel');

  tFreqSlider.addEventListener('input', function(){
    var tFreq = parseFloat(tFreqSlider.value);
    osc.frequency.value = tFreq;
    tFreqLabel.innerHTML = tFreq + " Hz";
  });

  dFreqSlider.addEventListener('input', function(){
    var dFreq = parseFloat(dFreqSlider.value);
    gn.targetFrequency = dFreq;
    dFreqLabel.innerHTML = dFreq + " Hz";
  });


  window.setInterval(function(){
    console.log(gn.power, gn.detected);
  },1000)
});
