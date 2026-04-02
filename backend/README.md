# CMS-MVP Backend Engine

The data routing and structural validation architecture of the CMS system.

## Modular MVC Setup
This codebase employs an industry-standard Separation of Concerns.
- **Controllers** (`src/controllers/`): Business logic, token generation, API algorithms, database filtering.
- **Routes** (`src/routes/`): Pure endpoint routing utilizing mapped HTTP verbs (GET, POST, PUT, DELETE).
- **Models** (`src/models/`): Mongoose schema bindings.

## Essential Scripts
Typically managed from the root monorepo, however, you can invoke them individually if inside this directory:
- `npm run dev` - Initializes nodemon for rapid development resets.
- `npm start` - Initiates the raw bare-metal node loop. (Serves `/frontend/dist/index.html` implicitly if `NODE_ENV=production`).
