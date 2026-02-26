# UrbanNest

A full-stack real estate platform where users can browse properties, connect with sellers, and discover their dream home.

## Tech Stack

### Frontend

| Technology       | Version | Purpose                                        |
| ---------------- | ------- | ---------------------------------------------- |
| React            | 19.2    | UI framework                                   |
| TypeScript       | 5.9     | Type-safe JavaScript                           |
| Vite             | 7.2     | Build tool and dev server                      |
| Tailwind CSS     | 4.1     | Utility-first CSS framework                    |
| shadcn/ui        | -       | Component library built on Radix UI            |
| React Router DOM | 7.13    | Client-side routing                            |
| Firebase SDK     | 12.9    | Authentication (email/password + Google OAuth) |
| Lucide React     | -       | Icon library                                   |
| Sonner           | -       | Toast notifications                            |
| Orval            | 7.13    | OpenAPI client code generation                 |

### Backend

| Technology         | Purpose                     |
| ------------------ | --------------------------- |
| Spring Boot (Java) | REST API server             |
| PostgreSQL         | Relational database         |
| Firebase Admin SDK | Token verification and auth |

### AWS Services

| Service                   | Purpose                                                   |
| ------------------------- | --------------------------------------------------------- |
| EC2                       | Hosts the Spring Boot backend                             |
| ECR                       | Docker container registry for backend images              |
| RDS                       | Managed PostgreSQL database                               |
| S3 (`urbannest-s3`)       | Private bucket for user-uploaded files (profile pictures) |
| S3 (`urbannest-frontend`) | Static hosting for the built frontend                     |
| CloudFront                | CDN that serves the frontend from S3 with HTTPS           |
| ACM                       | SSL/TLS certificates for custom domains                   |
| IAM                       | Access management for CI/CD and service permissions       |

### External Services

| Service                 | Purpose                                        |
| ----------------------- | ---------------------------------------------- |
| Firebase Authentication | User sign-in (email/password and Google OAuth) |
| Porkbun                 | Domain registrar and DNS management            |
| GitHub Actions          | CI/CD pipeline for frontend deployment         |

## Architecture

```
                        https://urbannest.website
                                  |
                              CloudFront
                                  |
                          S3 (urbannest-frontend)
                          (React SPA static files)

                    https://backend.urbannest.website
                                  |
                            EC2 (Spring Boot)
                              /        \
                           RDS          S3 (urbannest-s3)
                       (PostgreSQL)     (file storage)
```

## Project Structure

```
src/
├── api/
│   ├── generated.ts          # Auto-generated API client (orval)
│   ├── model/                # Auto-generated TypeScript interfaces (orval)
│   ├── custom-fetch.ts       # Custom fetch mutator with Firebase auth token injection
│   └── types.ts              # Context type definitions
├── components/
│   ├── auth/utilities/       # Firebase auth functions (login, register, logout)
│   ├── common/
│   │   ├── header/           # Public header with nav links
│   │   └── footer/           # Site footer with social links
│   ├── icons/                # Custom icon components
│   ├── layout/               # Navbar (authenticated dropdown)
│   └── ui/                   # shadcn/ui components (button, card, dialog, etc.)
├── config/
│   └── firebase.ts           # Firebase initialization
├── contexts/
│   ├── AuthContext.tsx        # Firebase auth state (currentUser, loggedIn)
│   └── UserContext.tsx        # Backend user data (profile, role)
├── hooks/
│   ├── useAuth.ts            # Access auth context
│   └── useUser.ts            # Access user context
├── pages/
│   ├── HomePage.tsx           # Landing page
│   ├── LoginPage.tsx          # Email/password + Google login
│   ├── SignupPage.tsx         # User registration
│   └── ProfilePage.tsx        # Profile view/edit with image upload
├── App.tsx                    # Routes and layout
└── main.tsx                   # Entry point
orval.config.ts                # Orval configuration (OpenAPI → TypeScript)
```

## Routes

| Path       | Page    | Access                   |
| ---------- | ------- | ------------------------ |
| `/`        | Home    | All users                |
| `/login`   | Login   | Guests only              |
| `/signup`  | Signup  | Guests only              |
| `/profile` | Profile | Authenticated users only |

## API Client

The API client is auto-generated from the backend's OpenAPI spec using [Orval](https://orval.dev). Generated files live in `src/api/generated.ts` and `src/api/model/`.

```bash
# Regenerate after backend API changes
npm run sync-api
```

A custom fetch mutator (`src/api/custom-fetch.ts`) automatically injects the Firebase ID token and prepends the `/api` prefix to all requests.

### Endpoints

| Function             | Method | Endpoint                      | Description                   |
| -------------------- | ------ | ----------------------------- | ----------------------------- |
| `createUser`         | POST   | `/api/users`                  | Register a new user           |
| `getCurrentUser`     | GET    | `/api/users/me`               | Get current user's profile    |
| `updateCurrentUser`  | PATCH  | `/api/users/me`               | Update profile fields         |
| `getListings`        | GET    | `/api/listings`               | Search published listings     |
| `createListing`      | POST   | `/api/listings`               | Create a listing              |
| `getListingById`     | GET    | `/api/listings/{id}`          | Get a listing by ID           |
| `updateListingById`  | PATCH  | `/api/listings/{id}`          | Update a listing              |
| `deleteListingById`  | DELETE | `/api/listings/{id}`          | Delete a listing              |
| `getMyListings`      | GET    | `/api/listings/my`            | Get my listings               |
| `getMySavedListings` | GET    | `/api/listings/saved`         | Get my saved listings         |
| `getMyFavorites`     | GET    | `/api/listings/favorites`     | Get my favorite listings      |
| `saveListing`        | POST   | `/api/listings/{id}/save`     | Save a listing                |
| `unsaveListing`      | DELETE | `/api/listings/{id}/save`     | Unsave a listing              |
| `addFavorite`        | POST   | `/api/listings/{id}/favorite` | Favorite a listing            |
| `removeFavorite`     | DELETE | `/api/listings/{id}/favorite` | Unfavorite a listing          |
| `getUploadUrl`       | POST   | `/api/s3/upload-request`      | Get S3 presigned upload URL   |
| `getDownloadUrl`     | GET    | `/api/s3/download-url`        | Get S3 presigned download URL |
| `deleteObject`       | DELETE | `/api/s3`                     | Delete an S3 object           |
| `health`             | GET    | `/api/health`                 | Health check                  |

All endpoints (except `getListings` and `health`) require a Firebase ID token via `Authorization: Bearer <token>` header.

## CI/CD Pipeline

On every push to `main`, GitHub Actions:

1. Checks out the code
2. Installs dependencies (`npm ci`)
3. Builds the project (`npm run build`) with environment variables from GitHub Secrets
4. Syncs the `dist/` output to the S3 frontend bucket
5. Invalidates the CloudFront cache

## Environment Variables

| Variable                            | Description                       |
| ----------------------------------- | --------------------------------- |
| `VITE_API_BASE_URL`                 | Backend API base URL              |
| `VITE_FIREBASE_AUTH_API_KEY`        | Firebase API key                  |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase auth domain              |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase project ID               |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase storage bucket           |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID      |
| `VITE_FIREBASE_APP_ID`              | Firebase app ID                   |
| `VITE_FIREBASE_MEASUREMENT_ID`      | Firebase analytics measurement ID |

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Regenerate API client from backend OpenAPI spec
npm run sync-api

# Lint
npm run lint

# Format
npm run format
```

## Code Quality

- **ESLint** with TypeScript-aware rules
- **Prettier** for consistent formatting
- **Husky** + **lint-staged** for pre-commit hooks (auto-formats staged files)
