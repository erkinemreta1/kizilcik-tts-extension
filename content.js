// İzole bağlam: MAIN world'den gelen yakalanan sesi arka plana iletir.
window.addEventListener("message", (e) => {
  if (e.source !== window) return;
  const d = e.data;
  if (!d || d.__kzTTS !== 1 || !d.b64) return;
  try {
    browser.runtime.sendMessage({ cmd: "save", b64: d.b64 });
  } catch (err) {
    console.error("[kz-tts] mesaj gönderilemedi", err);
  }
});
