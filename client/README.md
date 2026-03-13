# Hotel Booking Client

The frontend for the Hotel Booking platform built with React 19 and Vite. The landing page with popular recommendations is shown if the user hasn't logged in or has logged in for the first time. After a user books a hotel, stays there, and submits a rating, the system begins building a user–ratings profile based on all hotel reviews. It then calculates similarity between users using Pearson Correlation and predicts ratings for hotels the user has not yet reviewed. Based on these predictions, the homepage dynamically displays personalized hotel recommendations tailored to the user's preferences.

---

## Recommendation Flow

| Condition                                    | Behaviour                                                 |
| -------------------------------------------- | --------------------------------------------------------- |
| Not logged in / First login / No ratings yet | Shows popular hotels (rating ≥ 4, sorted by review count) |
| Logged in + has rated at least one hotel     | Shows personalized recommendations                        |

**Personalized flow:**

```
User logs in → Books a hotel → Stays → Rates the hotel
  → System builds user-ratings map from all reviews
  → Calculates Pearson Correlation with other users
  → Predicts ratings for unrated hotels
  → Shows personalized recommendations on Home page
```

---

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 7
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios
- **Payments:** Stripe (`@stripe/react-stripe-js`)
- **Date Picker:** react-date-range + date-fns
- **Icons:** FontAwesome + react-icons

---

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── featured/           # Featured cities section
│   │   ├── featuredProperties/ # Featured hotel cards
│   │   ├── footer/             # Footer
│   │   ├── header/             # Search header with date picker
│   │   ├── mailList/           # Newsletter subscription
│   │   ├── navbar/             # Top navigation bar
│   │   ├── payment/            # Stripe payment form
│   │   ├── propertyList/       # Property type browse section
│   │   ├── recommended/        # Personalized recommendations
│   │   ├── reserve/            # Room reservation modal
│   │   └── searchItem/         # Hotel card in search results
│   ├── context/
│   │   ├── AuthContext.jsx     # Auth state (user, login, logout)
│   │   └── SearchContext.jsx   # Search state (city, dates, options)
│   ├── hooks/
│   │   └── useFetch.js         # Generic data fetching hook
│   ├── pages/
│   │   ├── Home/               # Landing page
│   │   ├── list/               # Search results with filters
│   │   ├── listHotels/         # All hotels browse page
│   │   ├── hotelDetails/       # Hotel detail + booking
│   │   ├── login/              # Login page
│   │   ├── register/           # Register page
│   │   ├── myBookings/         # User's booking history
│   │   ├── userProfile/        # User profile
│   │   ├── verifyEmail/        # Email verification handler
│   │   └── resendVerification/ # Resend verification email
│   ├── App.jsx                 # Routes
│   └── main.jsx                # Entry point
└── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- API server running on port 8800 (see `api/README.md`)

### Installation

```bash
# 1. Navigate to the client folder
cd client

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app runs at `http://localhost:5173`. API requests to `/api/*` are proxied to `http://localhost:8800`.

---

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

---

## Pages & Routes

| Route                  | Component            | Description                                                        |
| ---------------------- | -------------------- | ------------------------------------------------------------------ |
| `/`                    | `Home`               | Landing page with recommendations, featured cities, property types |
| `/hotels`              | `List`               | Search results with destination, date, and price filters           |
| `/allhotels`           | `AllHotel`           | Browse all hotels                                                  |
| `/hotels/:id`          | `Hotel`              | Hotel detail page with photo gallery and booking                   |
| `/login`               | `Login`              | Login form                                                         |
| `/register`            | `Register`           | Registration form                                                  |
| `/my-bookings`         | `MyBookings`         | Authenticated user's booking history                               |
| `/verify-email/:token` | `VerifyEmail`        | Handles email verification link                                    |
| `/resend-verification` | `ResendVerification` | Request a new verification email                                   |

---

## State Management

State is managed via React Context + `useReducer`. No external state library is used.

### AuthContext

Persists user session to `localStorage`. Exposes `user`, `loading`, `error`, and `dispatch`.

| Action          | Description         |
| --------------- | ------------------- |
| `LOGIN_START`   | Sets loading state  |
| `LOGIN_SUCCESS` | Stores user payload |
| `LOGIN_FAILURE` | Stores error        |
| `LOGOUT`        | Clears user         |

### SearchContext

Holds the active search query across pages. Exposes `city`, `dates`, `options`, and `dispatch`.

| Action         | Description             |
| -------------- | ----------------------- |
| `NEW_SEARCH`   | Sets new search payload |
| `RESET_SEARCH` | Resets to initial state |

---

## useFetch Hook

A generic data fetching hook wrapping Axios. Refetching is supported for search results.

```js
const { data, loading, error, reFetch } = useFetch(
  "/api/hotels?city=Kathmandu",
);
```

---

## API Proxy

Vite is configured to proxy all `/api` requests to the backend, so no CORS issues in development:

```js
// vite.config.js
server: {
  proxy: {
    "/api": {
      target: "http://localhost:8800",
      changeOrigin: true,
      secure: false,
    },
  },
},
```
