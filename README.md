# GBV Support MY

A website about **domestic violence and gender-based violence (GBV) in Malaysia**, built with **Ruby on Rails 8**, **Bootstrap 5** and the **Stimulus** JavaScript framework.

Made by **Ahmad Aiman Arif bin Ahmad Alias** (2025189997, M3CS2666B) for **ITT588 Front-End Technology**, Lab Work 02 and Lab Work 03.

> In immediate danger in Malaysia? Call **999**. Talian Kasih: **15999** (24 hours).

## Pages

| Page | URL | What it shows |
|---|---|---|
| Home | `/` | Introduction, greeting based on the time of day, links to every section |
| What Is | `/what-is` | What domestic violence and GBV are, types of abuse, warning signs |
| Law Enforcement | `/law-enforcement` | Domestic Violence Act 1994, protection orders, Anti-Sexual Harassment Act 2022 |
| Enforcer | `/enforcer` | Government agencies and NGOs that help victims |
| Hotline | `/hotline` | Emergency numbers with "Open now" badges, copy buttons and a printable safety card |
| Contact | `/contact` | Feedback form with checks and a confirm popup |
| Login | `/login` | Admin login (users are read from `Password.txt`) |
| Admin | `/admin` | Saved contact messages (login required) |

## Lab Work 02: responsive website

- Rails app with a `PagesController`, one action and one view per page, and custom routes
- Bootstrap from a CDN: responsive navbar (hamburger menu on phones), grid, cards, accordion and tables
- Shared layout with an emergency 999 banner, navbar and footer
- Contact form checked on the server with flash messages

## Lab Work 03: JavaScript

All JavaScript is in Stimulus controllers in `app/javascript/controllers/`.

| Requirement | Where |
|---|---|
| HTML form | Contact form with name, email, topic, message and a tick box (`contact_form_controller.js`) |
| Popup dialog | `<dialog>` that shows the message for checking before it is sent |
| Output: `innerHTML` | Error list, character counter, live clock, hotline badges |
| Output: `document.write()` | Printable "My Safety Card" (`hotline_controller.js`) |
| Output: `window.alert()` | Thank-you message, "number copied" message |
| Output: console | `console.log / info / warn / table / group` in every controller |
| Operators and control statements | Form checks, greeting, open/closed badges |
| Event loop | `setInterval` clock, `setTimeout` before sending, Promise vs setTimeout order |
| Date and time | Malaysia time (`app/javascript/lib/time_helpers.js`) |

Extra features:

- **Login and logout** that read users from `Password.txt` (`SessionsController`), with a show/hide password button
- **Admin page**, only for logged-in users, that reads saved messages from `storage/messages.txt` (file handling)
- **Quick Exit** button and the **Esc** key leave the site quickly
- Error handling: blocked popups, blocked clipboard, missing `Password.txt`, broken message lines

## How to run

```bash
bundle install
bin/rails server
```

Then open <http://localhost:3000>.

Test logins are in `Password.txt` (format `username:password`). They are plain text for this lab only. A real website would store hashed passwords in a database.
