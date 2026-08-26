# META SEO Checker — техническое задание для AI Coding Agent

## 0. Роль AI-агента

Ты — senior frontend / Chrome Extension engineer.

Твоя задача — спроектировать и реализовать production-ready Chrome Extension **META SEO Checker** для быстрого on-page SEO анализа текущей открытой страницы.

Основной UX:

```text
User opens any regular web page
↓
Clicks the META SEO Checker icon
↓
A popup opens over the current page
↓
The user stays on the page
↓
The extension analyzes the active tab
↓
SEO information is shown in tabs
```

Расширение должно работать **без backend**. Анализ страницы выполняется локально в браузере.

В первой версии не должно быть:

```text
backend
accounts
authentication
cloud storage
analytics
tracking
AI API
remote scripts
payments
subscriptions
```

---

# 1. Название

Основное название:

```text
META SEO Checker
```

Вариант для Chrome Web Store:

```text
META SEO Checker — On-Page SEO Inspector
```

Slug проекта:

```text
meta-seo-checker
```

---

# 2. Главная продуктовая идея

META SEO Checker — Chrome Extension, который позволяет одним кликом посмотреть основную SEO-информацию текущей страницы.

Основные вкладки:

```text
Summary
Headings
Images
Links
Social
```

Вкладку `Tools` **не реализовывать**.

Расширение должно не только показывать значения, но и находить очевидные SEO-проблемы и предупреждения.

Пример Summary:

```text
Title
103 characters
Warning: title may be too long

Meta Description
188 characters
Warning: description may be too long

H1
2 found
Warning: multiple H1 elements

Images
3 total
1 missing ALT

Canonical
Present

Robots
INDEX, FOLLOW

Open Graph
Detected

Twitter Card
Detected
```

---

# 3. Ключевой UX

Основной интерфейс — **Chrome browser action popup**.

Пользователь должен оставаться на анализируемой странице.

Не открывать отдельный tab для основного функционала.

Рекомендуемый размер popup:

```text
width: 760–800 px
height: 560–600 px
```

Фактические значения подобрать так, чтобы popup корректно работал в Chrome.

Popup должен иметь внутренний scroll.

---

# 4. Тема

В первой версии поддерживать только одну тему:

```text
Light
```

Не реализовывать:

```text
Dark theme
System theme
Theme switcher
```

UI должен быть светлым, компактным и современным, в стиле developer/SEO tool.

---

# 5. Целевая платформа

Основная:

```text
Google Chrome Desktop
Manifest V3
```

Вторичная совместимость:

```text
Chromium-based browsers
```

Firefox/Safari не входят в v1.

---

# 6. Технологический стек

Использовать:

```text
Manifest V3
React 19
Vite 8
JavaScript ES2022+
```

**Без TypeScript.**

UI:

```text
React
CSS Modules или modular CSS
lucide-react
```

Тесты:

```text
Vitest
React Testing Library
```

Опционально:

```text
Playwright
```

для smoke/e2e.

---

# 7. Архитектура

```text
META SEO Checker
│
├── Manifest V3
│
├── Popup App
│   ├── React UI
│   ├── Tabs
│   ├── Summary
│   ├── Headings
│   ├── Images
│   ├── Links
│   ├── Social
│   ├── Search / Filters
│   └── Copy actions
│
├── Page Analyzer
│   ├── Meta extractor
│   ├── Headings extractor
│   ├── Images extractor
│   ├── Links extractor
│   ├── Social metadata extractor
│   ├── Structured data extractor
│   └── SEO rules engine
│
├── Page Highlight Helper
│   └── highlight selected DOM element
│
└── chrome.storage.local
    └── only lightweight settings if actually needed
```

---

# 8. Manifest permissions

Использовать минимально необходимые permissions.

Предпочтительно:

```json
{
  "permissions": [
    "activeTab",
    "scripting"
  ]
}
```

`storage` добавлять только если он реально используется.

Не запрашивать без необходимости:

```text
<all_urls>
tabs
history
webRequest
cookies
```

Основной анализ должен работать через:

```text
activeTab + chrome.scripting
```

после user gesture — клика по extension icon.

---

# 9. Ограниченные страницы

Некоторые страницы Chrome нельзя анализировать:

```text
chrome://
chrome-extension://
protected browser pages
некоторые Chrome Web Store страницы
```

Показывать понятную ошибку:

```text
This page cannot be analyzed by Chrome extensions.
Open a regular http/https page and try again.
```

Popup не должен падать.

---

# 10. Popup lifecycle

При открытии popup:

1. получить active tab;
2. проверить URL;
3. показать loading/skeleton;
4. выполнить scan активной страницы;
5. получить plain serializable result;
6. прогнать SEO Rules Engine;
7. показать Summary.

При повторном открытии popup анализировать текущую страницу заново.

Не полагаться на устаревший cache.

---

# 11. Refresh Scan

Добавить кнопку:

```text
Refresh Scan
```

Она повторно анализирует текущую страницу без закрытия popup.

Это важно для:

```text
SPA
dynamic pages
React/Vue apps
WordPress previews
content loaded after initial page render
```

---

# 12. Вкладки

Навигация:

```text
Summary
Headings
Images
Links
Social
```

Не реализовывать:

```text
Tools
```

Переключение вкладок не должно запускать новый page scan.

---

# 13. Общий Page Scan Result

Результат одного анализа нормализовать:

```js
{
  page: {},
  meta: {},
  headings: [],
  images: [],
  links: [],
  social: {},
  structuredData: {},
  issues: [],
  stats: {}
}
```

Не передавать DOM nodes из injected script в popup.

---

# 14. Summary — главная вкладка

Summary должен отвечать на вопрос:

```text
Что с SEO этой страницы?
```

Вверху показать:

```text
Errors
Warnings
Passed
```

Например:

```text
2 Errors
4 Warnings
9 Passed
```

Затем подробные данные.

---

# 15. Title

Найти `<title>` и `document.title`.

Показать:

```text
Title
Tornadoes and Flooding Damage Communities Across...
103 characters
```

Статусы:

```text
Missing
Empty
OK
May be too short
May be too long
```

Пороговые значения вынести в config:

```js
TITLE_MIN_RECOMMENDED
TITLE_MAX_RECOMMENDED
```

Не выдавать рекомендации как абсолютное правило Google.

---

# 16. Meta Description

Искать:

```html
<meta name="description" content="...">
```

Показать значение и количество символов.

Статусы:

```text
Missing
Empty
OK
May be too short
May be too long
```

Если meta description несколько — показать warning и все значения.

---

# 17. Meta Keywords

Искать:

```html
<meta name="keywords">
```

Показать:

```text
Keywords
8 values
```

Отсутствие keywords не считать SEO ошибкой.

Это informational field only.

---

# 18. URL

Показать полный текущий URL.

Добавить:

```text
Copy
```

---

# 19. Canonical

Искать:

```html
<link rel="canonical" href="...">
```

Показать все canonical tags, если их несколько.

Проверки:

```text
missing
empty
multiple canonical tags
relative URL
different from current URL
```

Отличие canonical от текущего URL — warning/info, не автоматическая critical error.

---

# 20. Robots

Искать:

```html
<meta name="robots">
<meta name="googlebot">
```

Разбирать:

```text
index
noindex
follow
nofollow
noarchive
nosnippet
max-snippet
max-image-preview
max-video-preview
```

Summary:

```text
Indexable
```

или:

```text
NOINDEX detected
```

`X-Robots-Tag` оставить на P1.

---

# 21. Author / Publisher

Искать подходящие значения:

```text
author
article:author
publisher
article:publisher
```

Показывать informationally.

Отсутствие не считать критической ошибкой.

---

# 22. Language

Определить:

```html
<html lang="en">
```

Показать:

```text
Lang
en
```

Missing/empty lang — warning.

---

# 23. Charset

Определить:

```html
<meta charset="UTF-8">
```

или эквивалентный `http-equiv`.

Показать значение.

---

# 24. Viewport

Искать:

```html
<meta name="viewport">
```

Missing viewport — warning.

---

# 25. Hreflang

Искать:

```html
<link rel="alternate" hreflang="..." href="...">
```

Показать count и список:

```text
en
uk
x-default
```

Проверять:

```text
empty hreflang
empty href
duplicate hreflang values
```

Полную межстраничную hreflang validation не делать в P0.

---

# 26. Summary counters

Показывать компактно:

```text
H1           2
H2           6
H3          40

Images       3
Missing ALT  1

Links      178
Unique     144

Open Graph   ✓
Twitter      ✓
JSON-LD      3
```

---

# 27. SEO Rules Engine

Не размещать SEO-проверки прямо внутри UI components.

Создать:

```text
seoRulesEngine.js
```

Каждое правило возвращает:

```js
{
  id,
  category,
  severity,
  title,
  description,
  value,
  relatedTab
}
```

Severity:

```text
error
warning
info
passed
```

---

# 28. P0 SEO rules

Минимум:

```text
title missing
title empty
title maybe too short
title maybe too long

meta description missing
meta description empty
meta description maybe too short
meta description maybe too long

canonical missing
multiple canonicals

robots noindex
robots nofollow

html lang missing
viewport missing

H1 missing
multiple H1
empty heading
heading level skipped

image missing ALT
image empty ALT informational

Open Graph title missing
Open Graph description missing
Open Graph image missing
Open Graph URL missing
duplicate Open Graph keys

Twitter card missing
Twitter title missing
Twitter description missing
Twitter image missing

invalid JSON-LD
JSON-LD missing @context
JSON-LD missing @type
```

---

# 29. Severity philosophy

Не превращать сомнительные рекомендации в errors.

Например:

```text
<a> without title
```

не является критической SEO ошибкой.

`img title` тоже не считать обязательным.

`alt=""` может быть корректным для декоративного изображения — показывать отдельно от missing ALT.

---

# 30. Headings tab

Название вкладки:

```text
Headings
```

Показать counts:

```text
H1 H2 H3 H4 H5 H6
```

---

# 31. Heading hierarchy

Построить headings по DOM order.

Пример:

```text
<H1> Main title

    <H2> Section A

        <H3> Subsection A1

    <H2> Section B
```

Можно использовать visual indentation.

---

# 32. Heading issues

Определять:

```text
Missing H1
Multiple H1
Empty heading
Skipped level H1 → H3
Skipped level H2 → H4
```

Skipped level — warning, не critical error.

---

# 33. Heading actions

Для каждого heading:

```text
Copy text
Highlight on page
```

---

# 34. Highlight on page

При клике соответствующий DOM element на исходной странице должен:

1. прокрутиться в viewport;
2. получить временный outline;
3. через 2–3 секунды вернуть исходный style.

Например:

```css
outline: 3px solid #f59e0b;
outline-offset: 3px;
```

Не оставлять permanent modifications.

---

# 35. Selector generation

Для headings/images/links генерировать selector или DOM path.

Приоритет:

```text
unique #id
stable unique attributes
DOM path with nth-of-type
```

Не использовать текст элемента как единственный идентификатор.

Если element исчез после SPA update:

```text
Element is no longer available. Refresh the scan.
```

---

# 36. Images tab

Верхняя статистика:

```text
Images
Missing ALT
Empty ALT
Missing TITLE
Lazy Loaded
```

`Missing TITLE` — informational only.

---

# 37. Image extraction

Для каждого `<img>` извлечь:

```text
src
currentSrc
srcset
alt
title
width attribute
height attribute
naturalWidth
naturalHeight
loading
decoding
fetchpriority
selector
```

URL возвращать absolute, где возможно.

---

# 38. Image item

Пример:

```text
[thumbnail]

3601679.jpg

ALT
Tornadoes and Flooding...

TITLE
Missing

Dimensions
1200 × 630

Loading
lazy

URL
https://...
```

Actions:

```text
Copy URL
Open image
Highlight
```

---

# 39. Image filters

Добавить:

```text
All
Missing ALT
Empty ALT
Missing TITLE
Lazy
```

Search:

```text
filename
ALT
URL
```

---

# 40. Links tab

Сводка:

```text
Links
Unique
Internal
External
Anchors
NoFollow
Sponsored
UGC
Empty href
Without title
```

`Without title` — informational only.

---

# 41. Link extraction

Для каждого `<a>`:

```text
raw href
absolute href
normalized textContent
title
rel
target
download
hreflang
type
selector
```

Классифицировать:

```text
internal
external
anchor
mailto
tel
javascript
empty
other
```

---

# 42. Internal / External

Основное правило:

```js
new URL(link.href).origin === location.origin
```

Subdomain policy — P1.

---

# 43. rel parsing

Разбирать:

```text
nofollow
sponsored
ugc
noopener
noreferrer
```

---

# 44. Links filters

```text
All
Internal
External
NoFollow
Sponsored
UGC
Anchors
Empty
Mailto
Tel
```

---

# 45. Links search

Искать по:

```text
anchor text
URL
title
rel
```

---

# 46. Link item

Пример:

```text
Anchor
Read more

URL
https://example.com/article

Type
Internal

rel
nofollow

title
—
```

Actions:

```text
Copy URL
Copy Anchor
Open Link
Highlight
```

---

# 47. Unique links

Уникальность считать по normalized absolute URL.

Если ссылка встречается несколько раз:

```text
Occurrences: 6
```

---

# 48. Broken link checker

**Не запускать автоматически.**

P1 feature:

```text
Check HTTP Status
```

Только после явного user action.

Не создавать сотни network requests при каждом открытии popup.

---

# 49. Social tab

Секции:

```text
Open Graph
Article Metadata
Facebook
Twitter / X
Image Source
Structured Data
```

---

# 50. Open Graph

Извлекать все:

```html
<meta property="og:*">
```

Критически важно: **не терять дубли**.

Не хранить OG просто как object вида `{key: value}`, потому что duplicate keys затрутся.

Использовать:

```js
[
  { property: "og:title", content: "..." },
  { property: "og:title", content: "..." }
]
```

---

# 51. Open Graph fields

Поддержать любые `og:*`.

Особенно:

```text
og:locale
og:site_name
og:type
og:title
og:description
og:url
og:image
og:image:url
og:image:secure_url
og:image:type
og:image:width
og:image:height
```

---

# 52. Duplicate OG detection

Если:

```text
og:title ×2
```

показать:

```text
Warning: 2 values found
```

и оба значения.

Не silently выбирать одно.

---

# 53. Article metadata

Извлекать:

```text
article:published_time
article:modified_time
article:expiration_time
article:author
article:section
article:tag
```

Показывать все найденные значения.

---

# 54. Facebook metadata

Извлекать:

```text
fb:app_id
fb:admins
```

---

# 55. Twitter / X metadata

Извлекать все `twitter:*`.

Особенно:

```text
twitter:card
twitter:site
twitter:creator
twitter:domain
twitter:title
twitter:description
twitter:image
twitter:image:alt
twitter:url
```

Дубли также не терять.

---

# 56. Image Source

Проверить:

```html
<link rel="image_src">
```

Если отсутствует:

```text
No IMAGE_SRC has been found
```

Informational only.

---

# 57. Social image preview

Если найден `og:image` или `twitter:image`, показать thumbnail.

Actions:

```text
Open
Copy URL
```

---

# 58. Structured Data

В Social добавить секцию:

```text
Structured Data
```

Определять:

```text
JSON-LD
Microdata
RDFa presence
```

Главный приоритет v1:

```text
JSON-LD
```

---

# 59. JSON-LD

Найти:

```html
<script type="application/ld+json">
```

Для каждого блока показать:

```text
Block 1
Type: Article

Block 2
Type: BreadcrumbList

Block 3
Type: Organization
```

---

# 60. JSON-LD parsing

Использовать только:

```js
JSON.parse(textContent)
```

Не выполнять содержимое.

Обработать:

```text
single object
array
@graph
malformed JSON
```

---

# 61. JSON-LD display

Показывать formatted JSON в read-only view.

Не использовать `dangerouslySetInnerHTML`.

---

# 62. JSON-LD issues

Проверки:

```text
invalid JSON
missing @context
missing @type
```

Для `@graph` анализировать children.

Не выдавать extension за полноценный Rich Results Validator.

---

# 63. Microdata

Определять:

```text
itemscope
itemtype
itemprop
```

Показывать detected itemtypes.

Если нет:

```text
No Microdata Schema.org items found.
```

---

# 64. RDFa

P1 или lightweight P0:

определить наличие:

```text
typeof
property
vocab
```

Полный RDFa parser не нужен.

---

# 65. External validator link

Добавить action:

```text
Open Google Rich Results Test
```

Формировать URL из текущей страницы.

Открывать новую вкладку только после click.

Не делать внешний запрос автоматически.

---

# 66. Copy functionality

Добавить `Copy` для:

```text
Title
Description
URL
Canonical
Robots
Heading text
Image URL
ALT
Link URL
Anchor
OG values
Twitter values
JSON-LD block
```

После успешного копирования:

```text
Copied
```

показать короткий toast.

---

# 67. Copy SEO Report

Добавить:

```text
Copy SEO Report
```

Формировать удобный text/Markdown report:

```text
META SEO Checker

URL: ...
Title: ...
Description: ...
Canonical: ...
Robots: ...

H1: 2
Images: 3
Missing ALT: 1

Open Graph:
...
```

---

# 68. Search

Поиск нужен в:

```text
Headings
Images
Links
Social
```

Не делать сложный global fuzzy search в P0.

---

# 69. Sticky UI

Tabs должны оставаться видимыми при scroll:

```css
position: sticky;
top: 0;
```

Header также может быть sticky.

---

# 70. Loading

При открытии:

```text
Analyzing page…
```

Показать skeleton/loading state.

Не добавлять artificial delay.

---

# 71. Large pages

Страница может содержать:

```text
5,000 links
2,000 images
1,000 headings
```

Не рендерить огромные списки неограниченно.

Использовать:

```text
@tanstack/react-virtual
```

или pagination для больших lists.

---

# 72. Analyzer execution

Рекомендуемый pipeline:

```text
popup
↓
chrome.tabs.query(active)
↓
chrome.scripting.executeScript
↓
analyzePage()
↓
plain serializable result
↓
React UI
```

---

# 73. Не передавать DOM nodes

Injected analyzer не должен возвращать:

```text
HTMLElement
Node
NodeList
HTMLCollection
```

Возвращать только:

```text
strings
numbers
booleans
arrays
plain objects
```

---

# 74. SPA behavior

DOM может измениться после scan.

При highlight, если selector больше не существует:

```text
Element is no longer available. Refresh the scan.
```

---

# 75. React state

Popup state:

```text
activeTab
scanStatus
scanResult
activeSection
filters
search
expandedRows
toast
```

Не добавлять Redux/Zustand без необходимости.

---

# 76. One scan, many tabs

После одного scan данные всех вкладок должны быть уже доступны.

Не пересканировать DOM при каждом переключении вкладки.

---

# 77. Accessibility

Использовать:

```text
real buttons
ARIA labels
tab roles
keyboard focus
visible focus styles
```

Status не должен определяться только цветом.

---

# 78. Light visual design

Только светлая тема.

Ориентир:

```text
background: white / very light gray
panels: subtle borders
accent: blue
errors: red
warnings: amber/orange
passed: green
text: near-black
muted: gray
```

Не использовать тяжелые gradients.

---

# 79. Typography

System fonts:

```css
font-family:
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  Roboto,
  Arial,
  sans-serif;
```

Для URLs/code:

```css
ui-monospace,
SFMono-Regular,
Menlo,
Consolas,
monospace;
```

Не подключать Google Fonts.

---

# 80. SEO thresholds

Создать:

```text
seoThresholds.js
```

Например:

```js
export const SEO_THRESHOLDS = {
  title: {
    minRecommended: 30,
    maxRecommended: 60
  },
  description: {
    minRecommended: 70,
    maxRecommended: 160
  }
};
```

Это только рекомендации интерфейса.

Wording:

```text
Recommended range
May be too long
May be too short
```

---

# 81. Duplicate meta detection

Помимо OG/Twitter обнаруживать duplicates:

```text
title
meta description
canonical
robots
viewport
```

Не терять values.

---

# 82. Summary issue navigation

При клике на issue:

```text
Multiple H1 found
```

переключить на:

```text
Headings
```

При:

```text
Missing ALT
```

перейти:

```text
Images → Missing ALT
```

---

# 83. Empty states

Примеры:

```text
No images found on this page.
No links found.
No Open Graph metadata found.
No Twitter Card metadata found.
No JSON-LD structured data found.
```

---

# 84. Error isolation

Malformed JSON-LD не должен ломать весь scan.

Возвращать:

```js
{
  valid: false,
  raw: "...",
  error: "..."
}
```

То же для invalid URLs и отдельных malformed values.

---

# 85. Analyzer modules

Рекомендуемые функции:

```js
extractPageMeta()
extractHeadings()
extractImages()
extractLinks()
extractOpenGraph()
extractTwitter()
extractArticleMeta()
extractStructuredData()
extractHreflang()
buildStats()
```

`analyzePage()` объединяет их.

---

# 86. Project structure

```text
meta-seo-checker/
├── public/
│   ├── manifest.json
│   └── icons/
│       ├── icon16.png
│       ├── icon32.png
│       ├── icon48.png
│       └── icon128.png
│
├── src/
│   ├── popup/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── popup.css
│   │   │
│   │   ├── components/
│   │   │   ├── Header/
│   │   │   ├── Tabs/
│   │   │   ├── StatusBadge/
│   │   │   ├── CopyButton/
│   │   │   ├── SearchInput/
│   │   │   ├── EmptyState/
│   │   │   ├── ErrorState/
│   │   │   └── Toast/
│   │   │
│   │   ├── sections/
│   │   │   ├── Summary/
│   │   │   ├── Headings/
│   │   │   ├── Images/
│   │   │   ├── Links/
│   │   │   └── Social/
│   │   │
│   │   ├── hooks/
│   │   │   ├── usePageScan.js
│   │   │   ├── useClipboard.js
│   │   │   └── useHighlight.js
│   │   │
│   │   └── utils/
│   │       ├── formatUrl.js
│   │       ├── text.js
│   │       └── report.js
│   │
│   ├── analyzer/
│   │   ├── analyzePage.js
│   │   ├── extractPageMeta.js
│   │   ├── extractHeadings.js
│   │   ├── extractImages.js
│   │   ├── extractLinks.js
│   │   ├── extractSocial.js
│   │   ├── extractStructuredData.js
│   │   ├── selectorGenerator.js
│   │   └── normalize.js
│   │
│   ├── seo/
│   │   ├── seoRulesEngine.js
│   │   ├── seoThresholds.js
│   │   ├── rules/
│   │   │   ├── titleRules.js
│   │   │   ├── descriptionRules.js
│   │   │   ├── canonicalRules.js
│   │   │   ├── robotsRules.js
│   │   │   ├── headingRules.js
│   │   │   ├── imageRules.js
│   │   │   ├── socialRules.js
│   │   │   └── structuredDataRules.js
│   │   └── severity.js
│   │
│   ├── extension/
│   │   ├── scanActiveTab.js
│   │   ├── highlightElement.js
│   │   └── openExternal.js
│   │
│   └── shared/
│       ├── constants.js
│       └── typedefs.js
│
├── tests/
├── store/
│   ├── description.md
│   ├── privacy.md
│   └── permissions.md
├── popup.html
├── vite.config.js
├── package.json
├── README.md
└── LICENSE
```

---

# 87. JSDoc

Для сложных структур использовать JSDoc, а не TypeScript.

Пример:

```js
/**
 * @typedef {Object} SeoIssue
 * @property {string} id
 * @property {"error"|"warning"|"info"|"passed"} severity
 * @property {string} title
 */
```

---

# 88. Tests — Meta

Покрыть:

```text
title present
title missing
multiple title tags
description
duplicate descriptions
canonical
multiple canonicals
robots
lang
charset
viewport
hreflang
```

---

# 89. Tests — Headings

```text
one H1
multiple H1
no H1
empty heading
skipped levels
DOM order
selector generation
```

---

# 90. Tests — Images

```text
ALT present
missing ALT
empty ALT
missing TITLE
relative src
currentSrc
lazy loading
dimensions
```

---

# 91. Tests — Links

```text
internal
external
anchor
mailto
tel
empty href
nofollow
sponsored
ugc
duplicate URL
relative URL
```

---

# 92. Tests — Open Graph / Twitter

```text
og:title
og:description
og:image
duplicate og:title
multiple og:image
custom og:* fields

twitter:card
twitter:title
twitter:description
twitter:image
duplicates
```

---

# 93. Tests — JSON-LD

```text
object
array
@graph
invalid JSON
missing @context
missing @type
multiple script blocks
```

---

# 94. Tests — SEO Rules

Rules engine тестировать отдельно от UI.

---

# 95. Manual QA checklist

```text
[ ] Load unpacked works
[ ] Popup opens from extension icon
[ ] User stays on current page
[ ] No new app tab opens
[ ] HTTP page scan works
[ ] HTTPS page scan works
[ ] Restricted page shows friendly error
[ ] Refresh Scan works

[ ] Summary works
[ ] Headings works
[ ] Images works
[ ] Links works
[ ] Social works

[ ] Title detected
[ ] Description detected
[ ] Keywords displayed
[ ] URL displayed
[ ] Canonical displayed
[ ] Robots displayed
[ ] Lang displayed
[ ] Charset displayed
[ ] Viewport displayed
[ ] Hreflang displayed

[ ] H1-H6 counters work
[ ] Heading hierarchy works
[ ] Heading highlight works

[ ] Images count works
[ ] Missing ALT works
[ ] Empty ALT differs from missing ALT
[ ] Image preview works
[ ] Image highlight works

[ ] Links count works
[ ] Unique works
[ ] Internal/External works
[ ] nofollow works
[ ] sponsored works
[ ] ugc works
[ ] anchors/mailto/tel work
[ ] Link highlight works

[ ] Open Graph displayed
[ ] Duplicate OG values are preserved
[ ] Twitter displayed
[ ] Duplicate Twitter values are preserved
[ ] article:* displayed
[ ] fb:* displayed
[ ] image_src displayed
[ ] JSON-LD displayed
[ ] Invalid JSON-LD does not break popup
[ ] Microdata detected

[ ] SEO issues work
[ ] Issue → tab navigation works
[ ] Copy actions work
[ ] Copy SEO Report works

[ ] Light theme is complete
[ ] Large page does not freeze popup
[ ] npm test passes
[ ] npm run build passes
[ ] package ZIP is generated
```

---

# 96. Performance

Scan должен быть быстрым.

Цели:

```text
normal page: near-instant user perception
large page: popup remains responsive
```

Избегать повторных дорогих DOM scans.

Не делать deep clone всей страницы.

---

# 97. Privacy

Ключевой текст:

```text
META SEO Checker analyzes the current page locally in your browser.

Page content is not uploaded to developer-owned servers.

The extension does not use analytics or tracking in version 1.0.
```

---

# 98. Chrome Web Store permissions explanation

Создать:

```text
store/permissions.md
```

Пример:

```text
activeTab
Used only after the user clicks the extension icon so META SEO Checker can inspect the currently active page.

scripting
Used to run the local page analyzer and optional element highlight helper on the active page.
```

---

# 99. Store description

Создать:

```text
store/description.md
```

Short description:

```text
Inspect titles, meta tags, headings, images, links, Open Graph, Twitter Cards and structured data in one click.
```

Long description перечисляет:

```text
Meta SEO summary
Headings
Images
Links
Open Graph
Twitter Cards
JSON-LD
SEO warnings
Local analysis
No backend
```

---

# 100. Store privacy

Создать:

```text
store/privacy.md
```

Объяснить:

```text
active page analyzed locally
no page content sent to developer servers
no account
no analytics
no tracking
```

---

# 101. Icons

Концепция:

```text
SEO + magnifying glass
```

или:

```text
SEO + check mark
```

Размеры:

```text
16x16
32x32
48x48
128x128
```

Не использовать branding/logo конкурента.

---

# 102. Не копировать UI конкурента 1:1

Можно повторять общую идею функциональности:

```text
popup
SEO tabs
page inspection
```

Но не копировать:

```text
logo
brand name
exact visual design
proprietary graphics
CSS
text wording
```

Создать самостоятельный UI META SEO Checker.

---

# 103. Popup header

Предложенный header:

```text
META SEO Checker
example.com
[Refresh]
```

Под ним:

```text
Summary | Headings | Images | Links | Social
```

---

# 104. Summary layout

Порядок:

```text
SEO Health
↓
Title
Description
Keywords
URL
Canonical
Robots
Language
Charset
Viewport
Hreflang
↓
Counters
```

---

# 105. Social layout

Порядок:

```text
Open Graph
Article
Facebook
Twitter / X
Image Source
Structured Data
```

Секции можно сделать collapsible.

---

# 106. Long values

Для длинных:

```text
description
URLs
OG values
JSON-LD
```

использовать:

```text
word-break
expand/collapse
Read more
```

Copy всегда должен копировать полное значение.

---

# 107. P0 — обязательный MVP

Без этого задача не считается завершенной:

```text
Manifest V3
React 19
Vite 8
JavaScript, no TypeScript
Browser action popup
Light theme only
activeTab + scripting scan
Refresh Scan
Unsupported page handling

Summary
Title
Description
Keywords
URL
Canonical
Robots
Author
Publisher
Lang
Charset
Viewport
Hreflang

SEO issue counters
SEO Rules Engine

Headings tab
H1-H6 counts
Heading hierarchy
Heading issues
Heading highlight

Images tab
Image count
Missing ALT
Empty ALT
Missing TITLE informational
Image preview
Image filters
Image search
Image highlight

Links tab
Total links
Unique links
Internal
External
Anchor
Mailto
Tel
NoFollow
Sponsored
UGC
Empty href
Link filters
Link search
Link highlight

Social tab
Open Graph
Duplicate OG detection
article:* metadata
fb:* metadata
Twitter/X metadata
Duplicate Twitter detection
image_src
JSON-LD
JSON-LD error handling
Microdata itemtype detection

Copy individual values
Copy SEO Report
Loading state
Error state
Empty states
Tests
Production build
ZIP
README
Chrome Web Store description/privacy/permissions
```

---

# 108. P1

После стабильного MVP:

```text
Broken link HTTP checker
X-Robots-Tag fetch
Export JSON report
RDFa details
Duplicate image URL detection
Subdomain classification option
Advanced hreflang checks
Google Rich Results Test shortcut
More structured-data checks
Image dimension/performance hints
Saved lightweight settings
Keyboard shortcuts
```

---

# 109. P2

Не реализовывать до стабильного P0/P1:

```text
Lighthouse integration
Core Web Vitals
PageSpeed API
SERP preview
Full Schema validator
Site-wide crawler
Sitemap crawler
Broken-links crawler
Multi-page audit
AI SEO suggestions
Cloud reports
Team accounts
Historical tracking
```

---

# 110. Что не делать в первой версии

Не добавлять:

```text
backend
database
Firebase
Supabase
accounts
login
analytics
telemetry
tracking
AI
LLM
payments
dark theme
Tools tab
site crawler
automatic mass HTTP link checks
```

---

# 111. Package scripts

Минимум:

```json
{
  "scripts": {
    "dev": "...",
    "build": "...",
    "test": "...",
    "test:watch": "...",
    "lint": "...",
    "package": "..."
  }
}
```

---

# 112. Build output

После:

```bash
npm run build
```

получить:

```text
dist/
```

`dist` должен быть готов для:

```text
chrome://extensions
→ Developer mode
→ Load unpacked
→ dist/
```

---

# 113. ZIP

После:

```bash
npm run package
```

создать:

```text
release/meta-seo-checker-v1.0.0.zip
```

---

# 114. README

README писать на английском.

Разделы:

```text
META SEO Checker
Features
Screenshots placeholder
Tech stack
Permissions
Privacy
Development
Build
Load unpacked
Architecture
SEO checks
Known limitations
Roadmap
```

---

# 115. Definition of Done

Задача считается завершенной только если:

1. Extension загружается через Load unpacked.
2. Popup открывается по клику на icon.
3. Пользователь остается на текущей странице.
4. Active page реально анализируется.
5. Unsupported pages корректно обрабатываются.
6. Refresh Scan работает.
7. Summary работает.
8. Headings работает.
9. Images работает.
10. Links работает.
11. Social работает.
12. SEO Rules работают.
13. Duplicate meta tags не теряются.
14. JSON-LD parse errors не ломают extension.
15. Highlight работает.
16. Copy работает.
17. Popup корректно скроллится.
18. Light theme завершена.
19. Большие списки не ломают UI.
20. Automated tests проходят.
21. `npm run build` проходит.
22. `npm run package` создает ZIP.
23. README готов.
24. Store files готовы.
25. Page content не отправляется на backend.
26. Нет analytics/tracking.
27. Нет Tools tab.
28. Нет TypeScript.

---

# 116. Порядок работы AI Coding Agent

## Шаг 1

Прочитать ТЗ полностью и составить короткий implementation plan.

Не задавать вопросы, если решение можно разумно принять самостоятельно.

## Шаг 2

Создать:

```text
React
Vite
Manifest V3
popup.html
```

Проверить Load unpacked и popup.

## Шаг 3

Реализовать:

```text
active tab detection
unsupported URL check
chrome.scripting page scan
```

## Шаг 4

Реализовать extractors:

```text
meta
headings
images
links
social
structured data
```

## Шаг 5

Реализовать Summary.

## Шаг 6

Реализовать SEO Rules Engine.

## Шаг 7

Реализовать Headings + Highlight.

## Шаг 8

Реализовать Images + filters/search/highlight.

## Шаг 9

Реализовать Links + classification/filters/search/highlight.

## Шаг 10

Реализовать Social:

```text
OG
Article
Facebook
Twitter
image_src
JSON-LD
Microdata
```

## Шаг 11

Реализовать:

```text
Copy
Copy SEO Report
Refresh Scan
Loading
Errors
Empty states
```

## Шаг 12

Оптимизировать большие списки.

## Шаг 13

Добавить tests.

## Шаг 14

Запустить:

```bash
npm run lint
npm test
npm run build
npm run package
```

Исправить ошибки.

## Шаг 15

Выполнить Manual QA.

## Шаг 16

Подготовить README и Chrome Web Store files.

---

# 117. Правила AI Agent

Не делать fake implementation.

Не показывать hard-coded demo data.

Не копировать визуальный дизайн другого extension 1:1.

Не копировать branding конкурента.

Не добавлять Tools tab.

Не добавлять dark theme.

Не добавлять backend.

Не добавлять TypeScript.

Не добавлять remote scripts.

Не запрашивать `<all_urls>` без необходимости.

Не терять duplicate meta tags.

Не считать отсутствие `title` у ссылок критической SEO ошибкой.

Не считать `alt=""` автоматически ошибкой.

Не выполнять JSON-LD как code.

Не использовать `dangerouslySetInnerHTML` для page content.

---

# 118. Приоритеты

```text
1. Correct extraction
2. Security
3. Privacy
4. Clear SEO information
5. UI responsiveness
6. Usability
7. Visual polish
```

---

# 119. Итоговый ожидаемый результат

AI Agent должен предоставить:

```text
1. Полный исходный код
2. Рабочий Chrome Extension
3. dist/
4. release/meta-seo-checker-v1.0.0.zip
5. README.md
6. Automated tests
7. store/description.md
8. store/privacy.md
9. store/permissions.md
10. Краткий итог:
    - что реализовано;
    - какие SEO checks есть;
    - какие ограничения остались;
    - что находится в P1/P2.
```

---

# 120. Финальная продуктовая формулировка

**META SEO Checker** — Chrome Extension для быстрого on-page SEO анализа текущей страницы.

После клика по иконке пользователь остается на странице и получает popup с разделами:

```text
Summary
Headings
Images
Links
Social
```

Extension показывает:

```text
Title
Meta Description
Keywords
URL
Canonical
Robots
Language
Charset
Viewport
Hreflang

H1–H6
Images / ALT
Links / internal / external / rel

Open Graph
Article metadata
Facebook metadata
Twitter/X Cards
JSON-LD
Microdata
```

Дополнительно:

```text
SEO errors
SEO warnings
Passed checks
Duplicate meta detection
Search / filters
Copy actions
Highlight elements on page
Refresh Scan
```

Главный принцип:

> One click to inspect the most important SEO metadata and on-page elements without leaving the current page.

Privacy:

> META SEO Checker analyzes the active page locally in the browser. Page content is not uploaded to developer-owned servers.
