# AD-CNT Active Directory Connector

این سرویس باید داخل شبکه شرکت و در کنار Active Directory اجرا شود.

## اصل امنیتی

Connector فقط اطلاعات موردنیاز را از AD به AD-CNT منتقل می‌کند. در نسخه اول هیچ عملیات write روی Active Directory انجام نمی‌شود.

## داده‌های قابل همگام‌سازی

- username
- display name
- email
- enabled/disabled status
- department / organizational unit
- group membership

## اتصال

ترجیحاً از LDAPS استفاده شود. Credentialهای AD هرگز داخل Repository یا Frontend قرار نمی‌گیرند و فقط در Environment سرویس داخلی نگهداری می‌شوند.

## جریان Sync

```text
Active Directory -> AD Connector -> AD-CNT API -> PostgreSQL
```

در نسخه بعدی endpoint داخلی Sync و mapping گروه‌های AD به Roleهای AD-CNT اضافه می‌شود.
