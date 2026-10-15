# Kızılcık · TTS Yakala

Google Cloud Text-to-Speech demo önizlemesini (Gemini TTS) dinlerken arka planda
üretilen WAV sesini otomatik yakalayıp indiren Firefox eklentisi (Manifest V3).

> Kızılcık Stüdyo için "Elle ses yükle" akışını hızlandırmak amacıyla yazıldı.

## Nasıl çalışır
- `page.js` (MAIN world): demo sayfasının `fetch`/`XMLHttpRequest`/`createObjectURL`
  çağrılarını izler, `synthesize` yanıtındaki `audioContent` (base64 WAV) yakalar.
- `content.js` (izole world): yakalanan sesi arka plana iletir.
- `background.js`: base64 gövdeyi WAV Blob'a çevirip `kizilcik_tts_<tarih>.wav`
  adıyla indirir.

## Kurulum (geliştirme / geçici)
1. `about:debugging#/runtime/this-firefox` aç.
2. **Geçici Eklenti Yükle...** → bu klasördeki `manifest.json` seç.

## Kalıcı kurulum
Firefox Release/Beta imzasız kalıcı kuruluma izin vermez:
- **Developer Edition / Nightly:** `about:config` → `xpinstall.signatures.required` = `false`,
  sonra `.xpi`'yi `about:addons` → çark → *Dosyadan eklenti yükle* ile kur.
- **Normal Firefox:** `web-ext sign` / AMO ile imzalatıp imzalı `.xpi` kur.

## Paketleme
```bash
# doğrulama
npx web-ext lint

# imzasız .xpi (yerel test)
npx web-ext build --overwrite-dest

# AMO ile imzalama (.env veya ortam değişkenleriyle)
#   WEB_EXT_API_KEY=<jwt-issuer>  WEB_EXT_API_SECRET=<jwt-secret>
npx web-ext sign --channel=unlisted
```

## Lisans
AGPL-3.0-or-later — bkz. [LICENSE](LICENSE).
