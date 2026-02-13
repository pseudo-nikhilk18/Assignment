# Eventually Consistent Form

A single-page web application demonstrating idempotent submissions, automatic retry with exponential backoff, and eventual consistency using a mock API with randomized behavior.

---

## 🚀 Overview

This application implements a form that collects:

* `email`
* `amount`

Upon submission:

* The UI immediately enters a **pending** state.
* The request is sent to a mock API.
* The API randomly responds with:

  * Immediate success (`200`)
  * Temporary failure (`503`)
  * Delayed success (5–10 seconds)

The system ensures:

* Duplicate submissions are prevented.
* Automatic retries occur on temporary failures.
* No duplicate records are created.
* UI clearly reflects the current state.

---

# 🏗 Architecture

## Tech Stack

**Frontend**

* React (Vite)
* Axios
* Tailwind CSS

**Backend**

* Node.js
* Express.js
* MongoDB (Atlas)
* Mongoose

---

## System Design

```
Client (React)
   ↓
Express API
   ↓
Mock Service (Randomized behavior)
   ↓
MongoDB (Idempotent persistence)
```

---

# 🔁 State Machine

### Backend States

```
pending → success
pending → failed
```

No ambiguous states. No reprocessing after terminal states.

### Frontend States

```
idle
submitting (Attempt 1/3)
retrying (Attempt 2/3 or 3/3)
success
failed
```

The UI always reflects the active state of the logical operation.

---

# 🔐 Duplicate Prevention Strategy

Duplicate prevention is implemented using the **Idempotency Key pattern**.

### How it Works

* A unique `idempotencyKey` is generated for each logical submission.
* The same key is reused across retries.
* Backend enforces:

  * `idempotencyKey` is unique (DB constraint)
  * If a request arrives with an existing key:

    * If status is `success` → return stored result
    * If status is `failed` → return failed
    * If status is `pending` → retry processing

### Why This Is Necessary

Without idempotency:

* Network retries could create duplicate records.
* Slow responses could cause accidental double inserts.
* Double-clicks could generate multiple entries.

With idempotency:

* One logical operation → one database record.
* Retries never create duplicates.
* Terminal states are respected.

---

# 🔁 Retry Logic

Retry is implemented on the frontend with exponential backoff.

### Strategy

* Maximum attempts: **3**
* Attempt 1: Immediate
* Attempt 2: Wait 1 second
* Attempt 3: Wait 2 seconds
* If all attempts fail:

  * Backend is instructed to mark submission as `failed`

### Why Frontend Retry?

* Allows clear UI feedback (Retrying 2/3)
* Keeps business logic visible
* Matches assignment requirement for UI state transparency

---

# 🧠 Design Decisions

## 1. Idempotency Key Generated Per Submission

Each new submission generates a new `idempotencyKey`.

The same key is reused across retries to ensure:

* Only one database record per logical operation.

---

## 2. Button Disabled During In-flight Operations

Prevents:

* Double-click duplicates
* Overlapping submissions
* Race conditions

Button is re-enabled only after terminal state (`success` or `failed`).

---

## 3. Page Refresh Trade-off

The `idempotencyKey` is stored in React state and does not persist across page refresh.

This was an intentional scope decision.

Handling refresh persistence would require:

* Storing key in `sessionStorage` or `localStorage`
* Restoring submission state on mount

Given the 3–5 hour assignment constraint, this was excluded for simplicity while documenting the trade-off.

---

## 4. Backend Terminal State Enforcement

Once a submission reaches:

* `success` → it will never be processed again.
* `failed` → it will never be retried again.

This ensures deterministic behavior and proper eventual consistency modeling.

---

## 5. Rendering Last Submission

After success, the last submission is rendered in UI.

This demonstrates:

* No duplicate records created
* Same idempotencyKey returns same stored record
* Retry does not generate multiple entries

---

# 📦 Folder Structure

### Backend

```
backend/
├── config/
│   └── db.js
├── controllers/
│   └── submissionController.js
├── models/
│   └── submissionModel.js
├── routes/
│   └── submissionRoute.js
├── services/
│   └── mockService.js
├── index.js
```

---

### Frontend

```
frontend/src/
├── api/
│   └── submissionApi.js
├── components/
│   ├── SubmissionForm.jsx
│   ├── StatusDisplay.jsx
│   └── SubmissionResult.jsx
├── hooks/
│   └── useSubmission.js
├── utils/
│   └── generateIdempotencyKey.js
├── App.jsx
```

---

# 🧪 How to Run

### Backend

```
cd backend
npm install
npm run dev
```

Requires `.env`:

```
PORT=4000
MONGO_URI=your_mongodb_atlas_connection_string
```

---

### Frontend

```
cd frontend
npm install
npm run dev
```

---

# ✅ Requirement Mapping

| Requirement                   | Implementation                              |
| ----------------------------- | ------------------------------------------- |
| Prevent duplicate submissions | Idempotency key + DB uniqueness             |
| Retry automatically           | Frontend retry with exponential backoff     |
| No duplicate records          | Backend enforces one record per key         |
| UI reflects state             | Explicit state machine with attempt counter |

---

# 📌 Conclusion

This implementation demonstrates:

* Idempotent API design
* Retry logic with exponential backoff
* Eventual consistency modeling
* Clear UI state transitions
* Proper separation of concerns
* Thoughtful trade-off documentation

The system guarantees that:

> One logical submission results in exactly one database record, regardless of retries or temporary failures.

