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
