# CMS-MVP Frontend Application

The user-facing portal built on top of Lightning-Fast Vite React 18.

## Folder Organization
- **`/pages`**: Holds all primary React layout containers. Separated intrinsically into `auth`, `admin`, `staff`, and `student` layouts based on JWT tokens structure.
- **`/components`**: Reusable component libraries (Navbars, Generic Protections).
- **`/store`**: Extensively managed via the `zustand` library to safely carry the authenticated user state universally.

## Development Constraints
- Utilizing `TailwindCSS` directly appended via `index.css`.
- Avoid touching `App.jsx` functionality with new inline components; always create standalone `page` files mapped to specific routes.
