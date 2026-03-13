# Hotel Booking Admin

The admin dashboard for the Hotel Booking platform built with React 19 and Vite.

---

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 7
- **Routing:** React Router DOM v7
- **UI Components:** MUI (Material UI v7) + MUI X Data Grid
- **Charts:** Recharts
- **Progress:** react-circular-progressbar
- **HTTP Client:** Axios
- **Styling:** SCSS
- **Date Utility:** date-fns

---

## Project Structure

```
admin/
├── src/
│   ├── components/
│   │   ├── chart/              # Revenue line chart (Recharts)
│   │   ├── datatable/          # Generic MUI DataGrid for list pages
│   │   ├── datatableBookings/  # Bookings-specific DataGrid
│   │   ├── featured/           # Revenue progress (circular progress bar)
│   │   ├── navbar/             # Top navigation bar
│   │   ├── sidebar/            # Sidebar with nav links + logout
│   │   ├── table/              # Latest transactions table
│   │   └── widget/             # Stat cards (users, hotels, rooms)
│   ├── context/
│   │   ├── AuthContext.jsx     # Auth state (user, login, logout)
│   │   ├── darkModeContext.jsx # Dark mode toggle state
│   │   └── darkModeReducer.jsx # Dark mode reducer
│   ├── hooks/
│   │   └── useFetch.jsx        # Generic data fetching hook (Axios)
│   ├── pages/
│   │   ├── home/               # Dashboard (widgets, charts, transactions)
│   │   ├── list/               # Generic list page (users, hotels, rooms)
│   │   ├── single/             # Detail views (user, hotel, room)
│   │   ├── new/                # Add new user form
│   │   ├── newHotel/           # Add new hotel form
│   │   ├── newRoom/            # Add new room form
│   │   ├── edit/               # Edit forms (user, hotel, room)
│   │   ├── bookingsList/       # Bookings management page
│   │   └── login/              # Admin login page
│   ├── datatablesource.jsx     # Column definitions for DataGrids
│   ├── formSource.jsx          # Input field definitions for forms
│   ├── App.jsx                 # Routes + ProtectedRoute wrapper
│   └── style/
│       ├── index.scss          # Global styles
│       └── dark.scss           # Dark mode overrides
└── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- API server running on port 8800 (see `api/README.md`)
- An admin account (`isAdmin: true`) in the database

### Installation

```bash
# 1. Navigate to the admin folder
cd admin

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The dashboard runs at `http://localhost:5173`. API requests to `/api/*` are proxied to `http://localhost:8800`.

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

All routes except `/login` are protected — unauthenticated users are redirected to `/login`.

| Route              | Component      | Description                                           |
| ------------------ | -------------- | ----------------------------------------------------- |
| `/login`           | `Login`        | Admin login page                                      |
| `/`                | `Home`         | Dashboard with stats, charts, and recent transactions |
| `/users`           | `List`         | All users in a DataGrid                               |
| `/users/:id`       | `Single`       | User detail view                                      |
| `/users/new`       | `New`          | Add a new user                                        |
| `/users/edit/:id`  | `EditUser`     | Edit user details                                     |
| `/hotels`          | `List`         | All hotels in a DataGrid                              |
| `/hotels/:id`      | `HotelSingle`  | Hotel detail view                                     |
| `/hotels/new`      | `NewHotel`     | Add a new hotel                                       |
| `/hotels/edit/:id` | `EditHotel`    | Edit hotel details                                    |
| `/rooms`           | `List`         | All rooms in a DataGrid                               |
| `/rooms/:id`       | `RoomSingle`   | Room detail view                                      |
| `/rooms/new`       | `NewRoom`      | Add a new room                                        |
| `/rooms/edit/:id`  | `EditRoom`     | Edit room details                                     |
| `/bookings`        | `BookingsList` | All bookings with status management                   |
| `*`                | Redirect       | Falls back to `/`                                     |

---

## State Management

### AuthContext

Persists the logged-in admin to `localStorage`. Exposes `user`, `loading`, `error`, and `dispatch`.

| Action          | Description               |
| --------------- | ------------------------- |
| `LOGIN_START`   | Sets loading state        |
| `LOGIN_SUCCESS` | Stores user payload       |
| `LOGIN_FAILURE` | Stores error              |
| `LOGOUT`        | Clears user and redirects |

### DarkModeContext

Toggles dark mode via the two colour swatches at the bottom of the sidebar.

| Action  | Description          |
| ------- | -------------------- |
| `LIGHT` | Switch to light mode |
| `DARK`  | Switch to dark mode  |

---

## Key Components

### Sidebar

Navigation links for Dashboard, Users, Hotels, Rooms, and Bookings. Also shows the logged-in admin's profile link and a logout button that clears auth state and redirects to `/`.

### Widget

Stat cards on the dashboard showing live counts of users, hotels, and rooms fetched from the API.

### Datatable

A reusable MUI X DataGrid component. Column definitions are passed in via `datatablesource.jsx` — separate configs exist for `userColumns`, `hotelColumns`, and `roomColumns`.

### Chart

A Recharts line chart showing revenue over the last 6 months.

### Featured

A circular progress bar showing current month revenue against a target, powered by the `/api/bookings/revenue` endpoint.

---

## useFetch Hook

Same pattern as the client — a generic Axios wrapper with `reFetch` support:

```js
const { data, loading, error, reFetch } = useFetch("/api/users");
```

---

## API Proxy

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

---

## Access Control

The admin panel is only usable by accounts with `isAdmin: true` in the database. The `ProtectedRoute` wrapper in `App.jsx` redirects any unauthenticated visitor to `/login`. There is no self-registration — admin accounts must be created directly in the database or via the API.
