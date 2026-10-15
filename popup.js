const greetings = [
  "Merhaba!",
  "Selam!",
  "Çalışıyorum, merak etme.",
  "Griyim ama ölmedim.",
  "Hazırım, bastır."
];

document.getElementById("hi").textContent =
  greetings[Math.floor(Math.random() * greetings.length)];

document.getElementById("ver").textContent =
  browser.runtime.getManifest().version;
