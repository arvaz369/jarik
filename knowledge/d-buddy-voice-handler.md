# D-Buddy — готовый код для голосовых обработчиков

> Справочник готового решения для обработки голосовых сообщений через Telegram. Используй как компонент в своих агентах или как демонстрационное решение для клиентов.

---

## Что это

**D-Buddy** — Telegram-бот на Python, который:
- Слушает голосовые сообщения (до 20 минут)
- Переводит речь в текст (Deepgram API)
- Улучшает текст через Claude
- Предлагает несколько стилей редактирования одним кликом

Это готовый компонент, который можешь использовать как:
1. **Справочник кода** — как реализовать голосовую обработку
2. **Демонстрационное решение** — показать клиенту, что голос можно обрабатывать
3. **Компонент агента** — встроить голосовой обработчик в свой агент

---

## Технический стек

```
• Python 3.10+
• Telegram Bot API (через python-telegram-bot или другую библиотеку)
• Deepgram API (распознавание речи)
• Anthropic API / Claude (улучшение текста)
• Docker (опционально)
• Git
```

---

## Требуемые API-ключи

Перед запуском нужны:

1. **Telegram Bot Token** — от @BotFather в Telegram
2. **Deepgram API Key** — для распознавания речи (https://console.deepgram.com)
3. **Anthropic API Key** — для улучшения текста через Claude

---

## Установка

### Вариант 1: Локально (для тестирования)

```bash
# Клонировать репозиторий
git clone https://github.com/smixs/d-buddy.git
cd d-buddy

# Установить зависимости
pip install -r requirements.txt

# Создать .env файл
cat > .env << EOF
TELEGRAM_BOT_TOKEN=your_token_here
DEEPGRAM_API_KEY=your_deepgram_key
ANTHROPIC_API_KEY=your_anthropic_key
EOF

# Запустить бот
python main.py
```

### Вариант 2: Docker (для продакшена)

```bash
# Собрать образ
docker build -t d-buddy .

# Запустить контейнер
docker run --env-file .env d-buddy
```

### Вариант 3: На VPS (постоянный запуск)

```bash
# SSH на сервер
ssh root@your_server

# Клонировать и настроить
git clone https://github.com/smixs/d-buddy.git
cd d-buddy
pip install -r requirements.txt

# Создать systemd-сервис для автостарта
cat > /etc/systemd/system/d-buddy.service << EOF
[Unit]
Description=D-Buddy Voice Telegram Bot
After=network.target

[Service]
Type=simple
User=agent
WorkingDirectory=/home/agent/d-buddy
EnvironmentFile=/home/agent/d-buddy/.env
ExecStart=/usr/bin/python3 main.py
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable d-buddy
systemctl start d-buddy
```

---

## Как это работает (алгоритм)

```
1. Пользователь отправляет голосовое сообщение в Telegram
   ↓
2. Бот получает аудиофайл
   ↓
3. Отправляет на Deepgram API
   ↓
4. Получает текст (транскрипция)
   ↓
5. Отправляет текст на Claude (Anthropic API)
   ↓
6. Claude улучшает текст (один из стилей)
   ↓
7. Отправляет результат пользователю в Telegram
   ↓
8. Удаляет аудио (не сохраняет локально)
```

---

## Стили редактирования

Бот предлагает несколько стилей обработки текста:

| Стиль | Что делает | Пример |
|-------|-----------|--------|
| **Proofread** | Исправляет грамматику, пунктуацию | "ааа вот это да" → "Ах, вот это да!" |
| **Casual** | Оставляет неформальный тон | "вот это жесть" → "Вот это жесть!" |
| **Business** | Преобразует в деловой стиль | "че там?" → "Какая ситуация?" |
| **Brief** | Превращает в задачу/заметку | Голос → структурированная задача |

---

## Использование в своих проектах

### Для Jarik (интеграция в существующий бот)

Если ты хочешь добавить голосовую обработку в свой Telegram-бот на Node.js:

```javascript
// Вместо Python можешь использовать:
// 1. node-telegram-bot-api (уже используешь?)
// 2. Deepgram Node SDK
// 3. Anthropic Node SDK

const TelegramBot = require('node-telegram-bot-api');
const Deepgram = require('@deepgram/sdk');
const Anthropic = require('@anthropic-ai/sdk');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
const deepgram = new Deepgram();
const anthropic = new Anthropic();

// Слушаем голосовые сообщения
bot.on('voice', async (msg) => {
  const voiceFileId = msg.voice.file_id;
  
  // Получаем файл
  const fileLink = await bot.getFileLink(voiceFileId);
  const audioBuffer = await fetch(fileLink).then(r => r.buffer());
  
  // Отправляем на Deepgram
  const { result } = await deepgram.transcription.preRecorded({
    buffer: audioBuffer,
    mimetype: 'audio/ogg',
  }, { model: 'nova-2', language: 'ru' });
  
  const transcript = result.results.channels[0].alternatives[0].transcript;
  
  // Улучшаем через Claude
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `Отредактируй этот текст в деловом стиле:\n\n${transcript}`
    }]
  });
  
  bot.sendMessage(msg.chat.id, message.content[0].text);
});
```

### Для клиента (демонстрационное решение)

Если клиент хочет **только** голос → текст:
1. Подарить ему готовую D-Buddy (Python + Docker)
2. Он развертывает на своем сервере
3. Бот работает 24/7
4. Клиент диктует голосом, получает текст

---

## Приватность и безопасность

D-Buddy придерживается строгой политики:

```
Получили аудио 
  → Отправили на Deepgram 
  → Получили текст 
  → Отправили пользователю 
  → Все удалили (ничего не храним)
```

✅ **Не сохраняет:** аудиофайлы, ID пользователей, историю сообщений  
✅ **Шифрует:** коммуникацию с Deepgram и Anthropic (HTTPS)  
✅ **Удаляет:** все файлы после обработки  

---

## Затраты на API

Приблизительные расходы за месяц активного использования:

| API | Тариф | Примечание |
|-----|-------|-----------|
| **Deepgram** | $0.0043 за минуту | Для 1000 минут в месяц ≈ $4.30 |
| **Anthropic** | $0.003 за 1K токенов входа | Для обработки ~100 сообщений ≈ $1-2 |
| **Telegram** | Бесплатно | Bot API бесплатен |

**Итого:** ~$5-10/месяц для небольшого использования

Для клиента с большим объёмом можешь рекомендовать платные планы Deepgram.

---

## Примеры использования для клиентов

### Клиент 1: Менеджер проектов
- Диктует задачи голосом во время встреч
- D-Buddy переводит в текст → улучшает → создаёт задачу
- Результат: не нужно печатать, руки свободны

### Клиент 2: Копирайтер
- Диктует посты/статьи голосом
- D-Buddy улучшает в деловом/журналистском стиле
- Копирайтер редактирует готовый текст

### Клиент 3: Служба поддержки
- Фиксируют жалобы голосом от клиентов
- D-Buddy переводит → структурирует в задачу
- Результат: база данных структурированных обращений

---

## Лимитации

⚠️ **Язык** — работает на русском, но нужно проверить поддержку других языков  
⚠️ **Время обработки** — до 20 минут аудио, но медленнее при большом объёме  
⚠️ **Зависимость от API** — если Deepgram/Claude API недоступны, бот не работает  
⚠️ **Python + Node.js** — если у тебя всё на Node.js, придётся писать микросервис на Python или портировать на Node  

---

## Как использовать в своей методологии

### Для Jarik

**Сейчас:** Jarik имеет голосовой обработчик (видно из коммитов).

**Рекомендация:** 
- Используй D-Buddy как **справочник кода** для оптимизации своей реализации
- Заимствуй **стили редактирования** (Proofread, Business, Brief)
- Интегрируй **XML-структурированные промпты** для лучшего качества текста

### Для демо-кейсов

Создай демонстрационное решение "D-Buddy для клиента":
- Развень на VPS за 30 минут
- Дай клиенту попробовать
- Покажи возможность расширения (добавить интеграцию с CRM, Slack и т.д.)

### Для методологии внедрения

**Когда предложить D-Buddy:**
- Клиент часто диктует голосом
- Нужна быстрая обработка аудиозаписей
- Клиент готов к микро-ПО (бот + API-ключи)

---

## Ссылки

- **GitHub:** https://github.com/smixs/d-buddy
- **Deepgram Docs:** https://developers.deepgram.com
- **Anthropic Docs:** https://docs.anthropic.com
- **Лицензия:** MIT

---

## Ключевой вывод

D-Buddy — это **готовый, боевой код** для голосовой обработки. Не нужно писать с нуля. Используй как:
1. ✅ Справочник для своих реализаций
2. ✅ Компонент для расширения функциональности
3. ✅ Демонстрационное решение для клиентов

Рекомендую положить в `reference/` папку как готовое решение для быстрого деплоя клиентам.
