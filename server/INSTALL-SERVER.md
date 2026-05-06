# Инструкция для Claude Code: установка Агента на VPS

> Этот файл читает Claude Code. Если ты Claude — выполняй всё по шагам, не задавай уточняющих вопросов. Все данные (IP, пароль) пользователь уже указал в своём сообщении.

## Контекст

Пользователь — ученик курса «Архитектор нейросотрудников». У него:
- Локально на компьютере: папка с файлами Агента (CLAUDE.md, SOUL.md, MEMORY.md, GOALS.md, memory/, knowledge/)
- Новый VPS (обычно Beget, Ubuntu 22 или 24), на который нужно всё перенести

Твоя задача — подключиться к серверу, установить окружение и скопировать файлы.

## Шаг 1. Найди локальные файлы

Проверь текущую папку — есть ли там DNA-файлы Агента:

```bash
ls CLAUDE.md SOUL.md MEMORY.md GOALS.md 2>/dev/null
```

Если файлы есть — запомни путь, ты скопируешь их на сервер в шаге 5.
Если файлов нет — проверь домашнюю папку и ~/jarvis/:
```bash
ls ~/jarvis/CLAUDE.md ~/jarvis/SOUL.md 2>/dev/null
ls ~/workspace/CLAUDE.md ~/workspace/SOUL.md 2>/dev/null
```
Если нигде нет — скажи пользователю: «Не нашёл файлы Агента. Откройте Claude Code в папке где лежат SOUL.md, MEMORY.md и другие файлы, и повторите команду.»

## Шаг 2. Подключись к серверу

IP и пароль пользователь указал в сообщении. Используй `expect` для автоматического ввода пароля.

Сначала проверь соединение:
```bash
expect -c '
  set timeout 15
  spawn ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 root@IP_СЕРВЕРА "echo CONNECTION_OK"
  expect {
    "password:" { send "ПАРОЛЬ\r"; exp_continue }
    "CONNECTION_OK" { exit 0 }
    timeout { exit 1 }
    eof { exit 1 }
  }
'
```

Замени `IP_СЕРВЕРА` и `ПАРОЛЬ` на данные из сообщения пользователя.

**Если не подключается** (таймаут, ошибка) — скажи пользователю:

> Прямое подключение не прошло. Скорее всего VPN блокирует соединение. Есть простой запасной путь:
>
> 1. Зайдите в панель управления Beget → ваш VPS → кнопка «Консоль»
> 2. Войдите как root с вашим паролем
> 3. Введите: `wget ntmib.github.io/jarvis-architect/s`
> 4. Введите: `bash s`
> 5. Скрипт всё установит. После этого напишите мне «готово» — я скопирую ваши файлы.

И жди ответа. Когда пользователь скажет «готово» — перейди к шагу 5 (копирование файлов).

## Шаг 3. Установи систему

Выполняй каждую команду через SSH. Вспомогательная функция:

```bash
# Для каждой команды используй этот шаблон:
expect -c '
  set timeout 120
  spawn ssh -o StrictHostKeyChecking=no root@IP_СЕРВЕРА "КОМАНДА"
  expect "password:" { send "ПАРОЛЬ\r" }
  expect eof
'
```

Последовательность:

**3.1. Базовые пакеты:**
```
apt-get update -qq 2>&1 | tail -3 && apt-get install -y -qq curl git jq unzip 2>&1 | tail -3
```

**3.2. Node.js 20:**
```
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - 2>&1 | tail -5 && apt-get install -y -qq nodejs 2>&1 | tail -3 && node -v
```

**3.3. Claude Code CLI:**
```
npm install -g @anthropic-ai/claude-code 2>&1 | tail -5 && which claude
```

**3.4. Пользователь agent и папки:**
```
id agent 2>/dev/null || useradd -m -s /bin/bash agent && mkdir -p /home/agent/workspace /home/agent/projects && chown -R agent:agent /home/agent && echo OK
```

**3.5. Права на Claude Code для пользователя agent:**
```
CLAUDE_REAL=$(readlink -f $(which claude 2>/dev/null) 2>/dev/null) && if [ -n "$CLAUDE_REAL" ]; then chmod -R a+rX $(dirname "$CLAUDE_REAL") 2>/dev/null; chmod -R a+rX $(dirname $(dirname "$CLAUDE_REAL")) 2>/dev/null; chmod -R a+rX $(dirname $(dirname $(dirname "$CLAUDE_REAL"))) 2>/dev/null; fi && echo OK
```

**3.6. Отключение IPv6 (фикс зависаний Node.js):**
```
sysctl -w net.ipv6.conf.all.disable_ipv6=1 2>/dev/null; sysctl -w net.ipv6.conf.default.disable_ipv6=1 2>/dev/null; echo OK
```

После каждого шага проверяй вывод. Если ошибка — покажи пользователю и предложи решение. Не останавливайся без причины.

## Шаг 4. Установи VS Code CLI

```
if ! command -v code >/dev/null 2>&1; then curl -fL 'https://github.com/Ntmib/jarvis-architect/releases/download/v1.0.0/vscode-cli.tar.gz' -o /tmp/vscode.tar.gz 2>&1 || curl -fL 'https://code.visualstudio.com/sha/download?build=stable&os=cli-alpine-x64' -o /tmp/vscode.tar.gz 2>&1; tar -xzf /tmp/vscode.tar.gz -C /usr/local/bin/ 2>&1; rm -f /tmp/vscode.tar.gz; fi && code --version 2>/dev/null || echo 'VS Code CLI not found'
```

## Шаг 5. Скопируй файлы Агента на сервер

Скопируй все DNA-файлы из локальной папки на сервер. Используй scp с expect:

```bash
# Шаблон для копирования одного файла:
expect -c '
  set timeout 30
  spawn scp -o StrictHostKeyChecking=no ./ФАЙЛ root@IP_СЕРВЕРА:/home/agent/workspace/
  expect "password:" { send "ПАРОЛЬ\r" }
  expect eof
'
```

Скопируй по очереди:
1. `CLAUDE.md`
2. `SOUL.md`
3. `MEMORY.md`
4. `GOALS.md`

Потом скопируй папки (рекурсивно, флаг -r):
5. `memory/` → `/home/agent/workspace/memory/`
6. `knowledge/` → `/home/agent/workspace/knowledge/`
7. `.claude/` → `/home/agent/workspace/.claude/` (если есть)

После копирования — поправь владельца:
```
chown -R agent:agent /home/agent/workspace
```

## Шаг 6. Проверь результат

Выполни на сервере:
```
echo '=== Node.js ===' && node -v && echo '=== Claude Code ===' && which claude && echo '=== VS Code CLI ===' && which code 2>/dev/null || echo 'нет' && echo '=== Файлы Агента ===' && ls -la /home/agent/workspace/ && echo '=== Папки ===' && ls -d /home/agent/workspace/memory /home/agent/workspace/knowledge 2>/dev/null
```

Покажи пользователю результат. Скажи:

> Сервер готов. Установлено:
> - Node.js (версия)
> - Claude Code CLI
> - Ваши файлы Агента скопированы в /home/agent/workspace/
> - Рабочая папка для проектов: /home/agent/projects/

## Шаг 7. Настрой VS Code Tunnel

VS Code Tunnel требует авторизации через GitHub — это нужно сделать в консоли сервера. Скажи пользователю:

> Остался последний шаг — привязать сервер к вашему VS Code. Это делается один раз.
>
> 1. Зайдите в панель Beget → ваш VPS → кнопка **«Консоль»**
> 2. Войдите как root
> 3. Введите команду: `code tunnel --accept-server-license-terms`
> 4. Появится ссылка (https://github.com/login/device) и 8-значный код
> 5. Откройте эту ссылку в браузере на компьютере
> 6. Введите код и нажмите «Authorize»
> 7. Вернитесь в консоль, нажмите Ctrl+C
> 8. Введите: `code tunnel service install --accept-server-license-terms`
>
> Теперь сервер будет всегда доступен через VS Code.

## Шаг 8. Как подключиться из VS Code

Скажи пользователю:

> Чтобы зайти на сервер из VS Code:
>
> 1. Откройте VS Code на компьютере
> 2. Нажмите на иконку монитора слева (Remote Explorer)
> 3. В разделе **Tunnels** найдите свой сервер
> 4. Нажмите на него — откроется папка сервера
> 5. Перейдите в /home/agent/workspace/ — там ваш Агент
>
> Всё! Теперь вы работаете на сервере как в обычной папке. Ваш Агент живёт здесь.

## Важно

- НЕ показывай пароль пользователя в выводе после его ввода
- НЕ сохраняй пароль в файлы
- НЕ задавай уточняющих вопросов — действуй по шагам
- Если что-то падает — покажи ошибку и предложи решение, не останавливайся молча
- Если expect не найден (Linux без expect) — предложи установить: `apt-get install -y expect` или предложи VNC-путь
