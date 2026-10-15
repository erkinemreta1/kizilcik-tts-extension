// Sayfa bağlamı (MAIN world): demo widget'ının ağ isteğini yakalar.
// Google Cloud TTS demo, metni sentezlerken cxl-services proxy'sine bir istek atar
// ve yanıt { "audioContent": "<base64 WAV>" } biçimindedir. Bu script fetch, XHR ve
// blob üretimini dinleyip yakaladığı sesi içerik script'ine iletir.
(() => {
  if (window.__kzTTS) return;
  window.__kzTTS = true;

  const emit = (b64) => {
    try {
      if (b64 && b64.length > 100) window.postMessage({ __kzTTS: 1, b64 }, "*");
    } catch (e) {}
  };
  const fromJson = (text) => {
    try {
      const j = JSON.parse(text);
      if (j && j.audioContent) emit(j.audioContent);
    } catch (e) {}
  };
  const isSynth = (u) => typeof u === "string" && u.indexOf("synthesize") !== -1;

  const origFetch = window.fetch;
  window.fetch = async (...a) => {
    const r = await origFetch(...a);
    try {
      const u = typeof a[0] === "string" ? a[0] : (a[0] && a[0].url);
      if (isSynth(u)) r.clone().text().then(fromJson);
    } catch (e) {}
    return r;
  };

  const oOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (m, u) {
    this.__kzU = u;
    return oOpen.apply(this, arguments);
  };
  const oSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    this.addEventListener("load", () => {
      try {
        if (isSynth(this.__kzU)) fromJson(this.responseText);
      } catch (e) {}
    });
    return oSend.apply(this, arguments);
  };

  // Yedek: blob'a dönüşen sesi de yakala
  const oUrl = URL.createObjectURL;
  URL.createObjectURL = function (o) {
    const u = oUrl.call(this, o);
    try {
      if (o instanceof Blob && o.size > 2000) {
        const fr = new FileReader();
        fr.onload = () => {
          const s = String(fr.result || "");
          const i = s.indexOf("base64,");
          if (i !== -1) emit(s.slice(i + 7));
        };
        fr.readAsDataURL(o);
      }
    } catch (e) {}
    return u;
  };
})();
