# Hotel Booking API

A RESTful backend API for the Hotel Booking platform built with Node.js, Express, and MongoDB.

---

## Tech Stack

- **Runtime:** Node.js with ES Modules
- **Framework:** Express 5
- **Database:** MongoDB + Mongoose 8
- **Auth:** JWT + bcryptjs
- **Payments:** Stripe
- **Email:** Nodemailer (Gmail SMTP)
- **Dev:** nodemon + dotenv

---

## Project Structure

```
api/
├── controllers/
│   ├── auth.js             # Register, login, email verification
│   ├── booking.js          # Booking CRUD + revenue stats
│   ├── hotel.js            # Hotel CRUD + count helpers
│   ├── payment.js          # Stripe payment intents & webhooks
│   ├── recommendation.js   # Pearson CF recommendation engine
│   ├── review.js           # Hotel reviews
│   ├── room.js             # Room CRUD + availability
│   └── user.js             # User CRUD
├── models/
│   ├── Booking.js
│   ├── Hotel.js
│   ├── Room.js
│   └── User.js
├── routes/
│   ├── auth.js
│   ├── bookings.js
│   ├── hotels.js
│   ├── payment.js
│   ├── recommendations.js
│   ├── review.js
│   ├── rooms.js
│   └── users.js
├── utils/
│   ├── emailService.js     # Verification & welcome emails
│   ├── error.js            # createError helper
│   └── verifyToken.js      # JWT middleware
└── index.js                # Entry point (port 8800)
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account or local MongoDB instance
- Stripe account
- Gmail account with an [App Password](https://myaccount.google.com/apppasswords)

### Installation

```bash
# 1. Navigate to the api folder
cd api

# 2. Install dependencies
npm install

# 3. Create your .env file (see Environment Variables below)

# 4. Start the development server
npm start
```

You should see:

```
Connected to backend!
connected to database!
```

---

## Environment Variables

Create a `.env` file in the `api/` directory:

```env
MONGO=mongodb+srv://<user>:<password>@cluster.mongodb.net/booking
JWT=your-secret-jwt-key

EMAIL_USER=youremail@gmail.com
EMAIL_PASSWORD=your-gmail-app-password   # Use a Gmail App Password, not your real password
CLIENT_URL=http://localhost:5173
APP_NAME=Hotel Booking

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...          # Optional, needed for webhook validation
```

> ⚠️ Never commit your `.env` file. Make sure it's listed in `.gitignore`.

---

## Authentication

JWTs are stored as `httpOnly` cookies (`access_token`). Three middleware levels are available in `utils/verifyToken.js`:

| Middleware    | Access                  |
| ------------- | ----------------------- |
| `verifyToken` | Any authenticated user  |
| `verifyUser`  | Resource owner or admin |
| `verifyAdmin` | Admins only             |

---

## API Endpoints

### Auth — `/api/auth`

| Method | Route                           | Description                                 | Auth   |
| ------ | ------------------------------- | ------------------------------------------- | ------ |
| POST   | `/api/auth/register`            | Register new user + send verification email | Public |
| GET    | `/api/auth/verify/:token`       | Verify email via token                      | Public |
| POST   | `/api/auth/resend-verification` | Resend verification email                   | Public |
| POST   | `/api/auth/login`               | Login (requires verified email)             | Public |

### Users — `/api/users`

| Method | Route            | Description     | Auth  |
| ------ | ---------------- | --------------- | ----- |
| GET    | `/api/users`     | Get all users   | Admin |
| GET    | `/api/users/:id` | Get single user | User  |
| PUT    | `/api/users/:id` | Update user     | User  |
| DELETE | `/api/users/:id` | Delete user     | User  |

### Hotels — `/api/hotels`

| Method | Route                     | Description                                              | Auth   |
| ------ | ------------------------- | -------------------------------------------------------- | ------ |
| POST   | `/api/hotels`             | Create a hotel                                           | Admin  |
| PUT    | `/api/hotels/:id`         | Update a hotel                                           | Admin  |
| DELETE | `/api/hotels/:id`         | Delete hotel + all its rooms                             | Admin  |
| GET    | `/api/hotels/:id`         | Get single hotel                                         | Public |
| GET    | `/api/hotels`             | Get hotels (supports `min`, `max`, `limit` query params) | Public |
| GET    | `/api/hotels/countByCity` | Count hotels per city                                    | Public |
| GET    | `/api/hotels/countByType` | Count hotels by property type                            | Public |
| GET    | `/api/hotels/room/:id`    | Get all rooms for a hotel                                | Public |
| POST   | `/api/hotels/:id/reviews` | Submit a review                                          | User   |

### Rooms — `/api/rooms`

| Method | Route                         | Description                     | Auth   |
| ------ | ----------------------------- | ------------------------------- | ------ |
| POST   | `/api/rooms/:hotelid`         | Create room + link to hotel     | Admin  |
| PUT    | `/api/rooms/:id`              | Update room details             | Admin  |
| PUT    | `/api/rooms/availability/:id` | Update room unavailable dates   | User   |
| DELETE | `/api/rooms/:id/:hotelid`     | Delete room + remove from hotel | Admin  |
| GET    | `/api/rooms/:id`              | Get single room                 | Public |
| GET    | `/api/rooms`                  | Get all rooms                   | Public |

### Bookings — `/api/bookings`

| Method | Route                              | Description                            | Auth   |
| ------ | ---------------------------------- | -------------------------------------- | ------ |
| POST   | `/api/bookings`                    | Create a booking                       | User   |
| GET    | `/api/bookings`                    | Get all bookings                       | Admin  |
| GET    | `/api/bookings/revenue`            | Revenue statistics                     | Admin  |
| GET    | `/api/bookings/:id`                | Get single booking                     | User   |
| GET    | `/api/bookings/user/:userId`       | Get all bookings for a user            | User   |
| GET    | `/api/bookings/hotel/:hotelId`     | Get hotel bookings (date range filter) | Public |
| PUT    | `/api/bookings/:id/status`         | Update booking status                  | Admin  |
| PUT    | `/api/bookings/:id/payment-status` | Update payment status                  | Admin  |
| PUT    | `/api/bookings/:id/cancel`         | Cancel own booking (frees room dates)  | User   |
| DELETE | `/api/bookings/:id`                | Delete a booking                       | Admin  |

### Payments — `/api/payment`

| Method | Route                        | Description                      | Auth   |
| ------ | ---------------------------- | -------------------------------- | ------ |
| POST   | `/api/payment/create-intent` | Create Stripe payment intent     | User   |
| POST   | `/api/payment/confirm`       | Confirm payment + update booking | User   |
| POST   | `/api/payment/webhook`       | Stripe webhook handler           | Public |
| POST   | `/api/payment/refund`        | Process a refund                 | User   |

### Recommendations — `/api/recommendations`

| Method | Route                                  | Description                            | Auth  |
| ------ | -------------------------------------- | -------------------------------------- | ----- |
| GET    | `/api/recommendations/:userId`         | Get personalized hotel recommendations | User  |
| GET    | `/api/recommendations/similar/:userId` | Get similar users (analytics)          | Admin |

---

## Data Models

### User

`username`, `email`, `password` (hashed), `country`, `city`, `phone`, `img`, `isAdmin`, `isVerified`, `verificationToken`, `verificationTokenExpiry`

### Hotel

`name`, `type`, `city`, `address`, `distance`, `photos[]`, `title`, `desc`, `rating`, `reviews` (count), `userReviews[]` (embedded), `rooms[]`, `cheapestPrice`, `featured`

### Room

`title`, `price`, `maxPeople`, `desc`, `hotelId`, `roomNumbers[]` — each with a `number` and `unavailableDates[]`

### Booking

`user`, `hotel`, `room[]` (array of `{roomId, roomNumber}`), `checkInDate`, `checkOutDate`, `totalPrice`, `guests`, `status` (pending/confirmed/cancelled), `paymentMethod`, `isPaid`, `hasRated`

---

## Recommendation Engine

Uses **Pearson Correlation collaborative filtering**:

1. Builds a user-ratings map from all embedded hotel reviews
2. Computes Pearson similarity between the target user and every other user
3. Predicts ratings for unrated hotels using a weighted average of the top-k similar users
4. Returns the top 10 hotels ranked by predicted rating
5. Falls back to popular hotels (rating ≥ 4) if the user has no ratings yet

---

## Error Handling

All errors are passed through a global Express error handler. Response shape:

```json
{
  "success": false,
  "status": 404,
  "message": "Booking not found",
  "stack": "..."
}
```

---

## Scripts

| Command     | Description                            |
| ----------- | -------------------------------------- |
| `npm start` | Start server with nodemon on port 8800 |
