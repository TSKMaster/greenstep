# База данных GreenStep простыми словами

Этот файл объясняет базу данных проекта без лишней технической сложности.

## Основные таблицы

В GreenStep сейчас есть 4 главные таблицы:

1. `profiles`
2. `reports`
3. `report_comments`
4. `report_supports`

## 1. `profiles`

Это таблица пользователей.

Что хранится:

- `id` — идентификатор пользователя
- `full_name` — имя пользователя
- `email` — почта
- `is_admin` — является ли пользователь администратором
- `rating` — рейтинг / баллы
- `created_at` — дата создания профиля

Проще говоря:

- один пользователь = одна запись в `profiles`
- имя из формы входа сохраняется сюда в `full_name`

## 2. `reports`

Это основная таблица обращений.

Что хранится:

- `id`
- `user_id`
- `category`
- `description`
- `photo_url`
- `address`
- `latitude`
- `longitude`
- `is_anonymous`
- `status`
- `support_count`
- `admin_comment`
- `created_at`
- `updated_at`

Статусы:

- `new`
- `accepted`
- `in_progress`
- `resolved`
- `rejected`

Проще говоря:

- одна проблема = одна запись в `reports`
- именно эта таблица питает карту, список заявок и детальные карточки

## 3. `report_comments`

Это комментарии к обращениям.

Что хранится:

- `id`
- `report_id`
- `user_id`
- `comment`
- `created_at`

Сейчас эта таблица уже есть в базе, но в интерфейсе используется ограниченно.

## 4. `report_supports`

Это таблица поддержек обращений.

Что хранится:

- `report_id`
- `user_id`
- `created_at`

Она нужна, чтобы:

- один и тот же пользователь не мог бесконечно поддерживать одну и ту же заявку
- можно было честно считать поддержку обращений

## Как таблицы связаны

- один пользователь из `profiles` может создать много обращений в `reports`
- одно обращение из `reports` может иметь много комментариев в `report_comments`
- одно обращение из `reports` может иметь много поддержек в `report_supports`

## Хранение фото

Фотографии обращений лежат в `Supabase Storage`.

Текущий bucket:

- `report-photos`

## Публичное чтение обращений для гостя

Чтобы гость видел реальные обращения на главной карте и на `/map`, для таблицы `reports` подготовлена миграция:

- `supabase/migrations/20260413_enable_public_reports_read.sql`

Её смысл:

- разрешить `select` для `anon` и `authenticated`
- не открывать создание, редактирование или удаление обращений гостям

SQL по смыслу такой:

```sql
alter table public.reports enable row level security;

drop policy if exists "Public can read reports" on public.reports;

create policy "Public can read reports"
on public.reports
for select
to anon, authenticated
using (true);
```

## Самое короткое объяснение

- `profiles` хранит людей
- `reports` хранит обращения
- `report_comments` хранит комментарии
- `report_supports` хранит поддержки

Это и есть основа базы GreenStep.
