# 🗒️ Swing Notes API

Detta blev ett fullstackprojekt där användare kan skapa och hantera anteckningar via ett säkert API. Applikationen är byggd med **Node.js + Express**, **PostgreSQL** och **React (Vite)**. Autentisering sker via **JWT (access + refresh tokens)**.

---

## 🧰 Tekniker som används

- **Backend**: Node.js, Express
- **Databas**: PostgreSQL
- **Autentisering**: JWT (accessToken + refreshToken)
- **Hashning**: bcryptjs
- **Frontend**: React + Vite
- **Token-förnyelse**: automatiskt med `fetchWithAuth`
- **Sökoptimering**: `lodash.debounce` används för att minska API-anrop vid sökning
- **Dokumentation**: Swagger (`/api-docs` eller finns länk i frontend som leder hit) 

---

## 🚀 Kom igång

### Backend

```bash
cd server
cp .env.example .env   # Skapa .env och fyll i värden
npm install
npm run dev
````

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔐 Autentisering

Autentisering sker med JWT:

* **accessToken** – 15 minuter
* **refreshToken** – 7 dagar

> **Notering:** RefreshToken hanteras ännu inte via `cookie`, utan lagras på klientsidan (t.ex. `localStorage`).

Alla skyddade API-anrop kräver:

```
Authorization: Bearer <accessToken>
```

När `accessToken` går ut försöker klienten automatiskt hämta en ny via:

```http
POST /api/user/refresh-token
```

---

## 📘 API Endpoints

| Metod  | Endpoint                  | Beskrivning                      |
| ------ | ------------------------- | -------------------------------- |
| GET    | `/api/notes`              | Hämta alla anteckningar          |
| POST   | `/api/notes`              | Skapa en anteckning              |
| PUT    | `/api/notes/:id`          | Uppdatera anteckning             |
| DELETE | `/api/notes/:id`          | Ta bort anteckning               |
| GET    | `/api/notes/search?q=`    | Sök efter titel (VG-krav)        |
| POST   | `/api/user/signup`        | Skapa konto                      |
| POST   | `/api/user/login`         | Logga in (returnerar tokens)     |
| POST * | `/api/user/refresh-token` | Hämta ny access-token            |
| GET  * | `/api/user/me`            | Hämta info om inloggad användare |

---

## 🧾 Note-objekt

```json
{
  "id": "uuid",
  "title": "Max 50 tecken",
  "text": "Max 300 tecken",
  "createdAt": "ISODate",
  "modifiedAt": "ISODate"
}
```

---

## 🔁 Automatisk token-förnyelse

När access-token går ut (efter 15 minuter), sker en automatisk förnyelse om refresh-token är giltig. Du ser detta i konsolen som:

```
[🔁] Access-token förnyad automatiskt
```

Om både access och refresh är ogiltiga loggas användaren ut.

---

## 🐛 Felhantering

Alla fel returneras som JSON med statuskoder enligt:

* `200 OK` – Lyckad förfrågan
* `400 Bad Request` – Felaktig indata
* `401 Unauthorized` – Saknar eller ogiltig token
* `403 Forbidden` – Token ogiltig eller vägrad åtkomst
* `404 Not Found` – Resurs saknas
* `500 Internal Server Error` – Serverfel

---

## 📊 Betygskriterier

### Godkänt

* [x] Alla endpoints finns med.
* [x] Allt sparas i en PostgreSQL-databas.
* [x] Det finns API-dokumentation i Swagger.
* [x] JSON Web Token används för att skapa en inloggad session.
* [x] Lösenord är hashade med `bcryptjs`.

### Väl godkänt

* [x] Sökning bland anteckningar via titel med `/api/notes/search`.
---

## 🔮 Kommande funktioner

* [ ] 🛡️ Flytta refresh-token till `httpOnly cookie`
* [ ] 👥 Grupper: Se anteckningar från andra i samma grupp
* [ ] 🗂️ Delade anteckningar i realtid
* [ ] 🧪 Enhetstester för endpoints

---

## 🧪 Testkonto

För att snabbt komma igång:

* **Användarnamn:** `demo`
* **Lösenord:** `demo123`

---

## 📄 Swagger

API-dokumentation finns på:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

```
