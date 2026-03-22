# Каталог фильмов — VK Frontend Internship

Приложение для просмотра информации о фильмах на **React**, **TypeScript** с API [ПоискКино](https://poiskkino.dev/).

## Запуск

```bash
npm install
```

Опционально: ключ API в [@poiskkinodev_bot](https://t.me/poiskkinodev_bot). Создайте `.env` по образцу `.env.example` и задайте `VITE_POISKKINO_API_KEY`. Без ключа или с `VITE_MOCK=true` используются мок-данные.

```bash
npm run dev        # с API (нужен ключ)
npm run dev:mock   # с мок-данными
npm run build      # сборка в dist/
```
