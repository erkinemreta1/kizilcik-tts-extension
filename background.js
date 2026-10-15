// Arka plan: yakalanan base64 sesi WAV olarak indirir.
browser.runtime.onMessage.addListener((msg) => {
  if (!msg || msg.cmd !== "save" || !msg.b64) return;
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filename = `kizilcik_tts_${stamp}.wav`;
  try {
    const bin = atob(msg.b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    const url = URL.createObjectURL(new Blob([arr], { type: "audio/wav" }));
    browser.downloads
      .download({ url, filename, saveAs: false })
      .then(() => console.log("[kz-tts] indi:", filename))
      .catch((err) => console.error("[kz-tts] indirilemedi", err));
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch (err) {
    // Yedek: data URL
    browser.downloads
      .download({ url: "data:audio/wav;base64," + msg.b64, filename, saveAs: false })
      .catch((e) => console.error("[kz-tts] data-url indirilemedi", e));
  }
});
