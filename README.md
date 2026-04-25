# Podo Soruşturması

İzmir'de kaybolan **Podo**'yu bulmak için 5 farklı JotForm kaynağından gelen ipuçlarını (giriş kayıtları, mesajlar, görülmeler, kişisel notlar, anonim ihbarlar) tek bir dedektif arayüzünde toplayan React + TypeScript uygulaması.

## Kurulum

Gereksinim: Node.js 20+

```bash
git clone <repo>
cd 2026-frontend-challenge-izmir-main
npm install
```

`.env` dosyası repo ile birlikte gelir; JotForm anahtarları ve form ID'leri içinde tanımlıdır. Kendi anahtarınla çalışacaksan oradaki değerleri değiştirebilirsin.

## Çalıştırma

```bash
npm run dev      # geliştirme sunucusu
npm run build    # üretim derlemesi
npm run preview  # derlemeyi yerel önizle
npm run lint     # lint
```

Geliştirme sunucusu varsayılan olarak `http://localhost:5173` adresinde çalışır.
