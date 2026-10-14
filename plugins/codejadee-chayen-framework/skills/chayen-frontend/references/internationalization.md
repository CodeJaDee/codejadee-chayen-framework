---
kind: recipe
capabilities: [CAP-07-009]
---
# Internationalization and localization

Add or extend internationalization with the project's i18n library:
extract user-visible text into messages, use ICU plurals and select,
format dates, numbers, and currencies by locale, support right-to-left
scripts where needed, and check for missing keys and untranslated strings.

## Inputs

- The target locales and the default and fallback locale.
- The i18n library in use: Angular built-in i18n (`$localize`),
  ngx-translate, Transloco, i18next or react-i18next, next-intl, react-intl
  (FormatJS), vue-i18n, or `@nuxtjs/i18n`. If none exists, ask before
  choosing one.
- How the locale is chosen (URL prefix, domain, user profile, browser
  setting) and where translations come from (files in the repository, a
  translation service).
- Product decisions for locale-specific formats, for example the calendar
  and time zone shown.

## Procedure

1. **Detect the setup:** library, message file format (XLIFF, JSON, ARB,
   PO), file locations, key naming convention, and the extraction command.
   Follow them.
2. **Extract every user-visible string** in the changed scope: text,
   placeholders, `alt` and `aria-label` values, page titles, validation
   messages, and toast text. Use the convention's keys. Never build
   sentences by concatenating fragments, because word order differs across
   languages.
3. **Use ICU MessageFormat** (or the library's equivalent) for plurals,
   gender, and select. Interpolate values as named parameters, and let
   translators move them.
4. **Format by locale** with the library's pipes and helpers or `Intl`:
   - `Intl.DateTimeFormat` for dates and times, with an explicit time zone
     where the product defines one;
   - `Intl.NumberFormat` for numbers, percentages, and currencies, where
     the currency code comes from the data, never from the locale;
   - `Intl.RelativeTimeFormat` and `Intl.ListFormat` where needed.

   Never format with string templates such as `${day}/${month}`.
5. **Confirm locale-specific defaults with the product owner.** For
   example, `th-TH` formats with the Buddhist calendar by default (year
   2569 for 2026). Use `th-TH-u-ca-gregory` if the Gregorian calendar is
   wanted.
6. **Right-to-left** (Arabic, Hebrew, Persian, Urdu): set `dir` and `lang`
   on the root element for each locale, use CSS logical properties
   (`margin-inline-start`, `padding-inline-end`, `inset-inline`), and mirror
   directional icons. Check the design system's right-to-left support.
7. **Set the document language** (`<html lang>`) to the active locale, so
   screen readers pronounce text correctly and the browser can hyphenate.
8. **Check completeness:** run the extraction, compare the locale files
   for missing and unused keys with the project's tool or a script, and
   search the changed templates for remaining literal strings. A
   pseudo-locale build, if the tooling supports it, shows truncation and
   hard-coded text.
9. **Test** at least two locales: a rendered string per locale, a plural
   case, and a currency and a date rendered correctly for each.

## Outputs

- Extracted messages in the existing format and key convention, with
  locale-aware formatting through the existing library.
- Locale switching and `lang` and `dir` handling as the app requires.
- A report of missing keys, unused keys, and untranslated strings, and the
  product decisions taken (calendar, time zone, fallback).

## Technology considerations

| Stack | Consideration |
|---|---|
| Angular | Built-in i18n: `i18n` attributes and `$localize`, `ng extract-i18n`, and one build per locale (configured in `angular.json`), so switching reloads the app. Runtime switching needs ngx-translate or Transloco, if already used. Register locale data for pipes (`DatePipe`, `CurrencyPipe`), and set `LOCALE_ID`. |
| React (Vite) | react-i18next with namespaces and lazy-loaded resources, or react-intl `FormattedMessage` and `FormattedNumber`. Keep keys out of conditionals so extraction tools see them. |
| Next.js | next-intl, or the routing-based locale setup that the project uses. App Router locale segments (`app/[locale]/`) with middleware detection. Format on the server to avoid hydration mismatches between server and browser locales or time zones. |
| Vue and Nuxt | vue-i18n (`$t`, `useI18n`, `n` and `d` formatters with configured formats). `@nuxtjs/i18n` with the configured strategy (prefix or domain), lazy-loaded locale files, and SEO `hreflang` tags. |
| Mobile and desktop shells | The OS language may differ from the app language: read it from the shell (for example Capacitor `Device.getLanguageCode()`) only if the product wants that. Native permission texts in `Info.plist` are localized with `InfoPlist.strings`, separately from web messages. |

## Verification

- No hard-coded user-visible strings remain in the changed components,
  checked by a search or the library's lint rule.
- Tests render a currency and a date correctly for two locales, and a
  plural message for counts 0, 1, and many, reported PASS, FAIL, or
  NOT_RUN with the command.
- The extraction command runs, and the missing-key check is reported with
  its result.
- Right-to-left layout not checked in a browser is marked "not verified in
  browser".
