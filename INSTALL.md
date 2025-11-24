# Installation Guide

This project has two separate package installations:

1. **Angular Frontend** - Root level packages
2. **Node.js Backend** - Backend server packages

## Quick Install (All Packages)

### Option 1: Manual Installation

```bash
# Install Angular packages (root level)
npm install

# Install backend packages
cd projects/backend
npm install
cd ../..
```

### Option 2: Using npm scripts (if available)

```bash
npm run install:all
```

## Detailed Installation

### 1. Angular Frontend Packages

From the **root directory** of the project:

```bash
npm install
```

This installs:
- Angular 20 and related packages
- Angular Elements
- PrimeNG
- Development dependencies (TypeScript, Karma, etc.)

### 2. Backend Server Packages

Navigate to the backend directory and install:

```bash
cd projects/backend
npm install
```

This installs:
- `express` - Web server framework
- `cors` - CORS middleware
- `body-parser` - Request body parsing
- `multer` - File upload handling
- `pg` - PostgreSQL client
- `@google-cloud/storage` - Google Cloud Storage client
- `openai` - OpenAI API client
- `dotenv` - Environment variable management

## Backend Environment Setup

The backend requires a `.env` file in `projects/backend/` with the following variables:

```env
# Database Configuration
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_db_password
DB_PORT=5432

# Google Cloud Storage
GCP_KEYFILE_PATH=path/to/your/gcp-keyfile.json
GCP_BUCKET_NAME=your-bucket-name

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Server Port (optional, defaults to 3000)
PORT=3000
```

### Creating .env File

1. Copy the template file:
   ```bash
   cd projects/backend
   # On Linux/Mac:
   cp env.template .env
   # On Windows:
   copy env.template .env
   ```

2. Or create manually:
   ```bash
   cd projects/backend
   # On Linux/Mac:
   touch .env
   # On Windows:
   type nul > .env
   ```

3. Edit `.env` and add your configuration values (use `env.template` as a reference)

## Verification

### Check Angular Installation

```bash
# From root directory
npm list @angular/core
```

### Check Backend Installation

```bash
# From projects/backend directory
npm list express
```

## Running the Projects

### Start Backend Server

```bash
cd projects/backend
node server.js
```

The server will start on `http://localhost:3000` (or the port specified in `.env`)

### Start Angular Development Server

```bash
# From root directory
npm start
# or
ng serve
```

The Angular app will start on `http://localhost:4200`

## Troubleshooting

### Issue: Backend packages not installing

**Solution:**
- Ensure you're in the `projects/backend` directory
- Check Node.js version (should be 14+)
- Try deleting `node_modules` and `package-lock.json`, then reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Issue: Angular packages not installing

**Solution:**
- Ensure you're in the root directory
- Check Node.js and npm versions
- Try clearing cache:
  ```bash
  npm cache clean --force
  npm install
  ```

### Issue: Backend server won't start

**Solution:**
- Verify `.env` file exists and has all required variables
- Check database connection settings
- Ensure PostgreSQL is running (if using local database)
- Verify Google Cloud credentials file path is correct
- Check OpenAI API key is valid

## Package Versions

### Angular Packages
- Angular: ^20.0.0
- Angular Elements: Latest
- PrimeNG: ^20.3.0

### Backend Packages
- Express: ^5.1.0
- PostgreSQL (pg): ^8.16.3
- OpenAI: ^6.9.1
- Google Cloud Storage: ^7.17.3

## Next Steps

After installation:

1. **Set up backend environment** - Create `.env` file with your configuration
2. **Set up database** - Create PostgreSQL database and tables
3. **Configure Google Cloud** - Set up GCS bucket and service account
4. **Get OpenAI API key** - Sign up at https://platform.openai.com/
5. **Build Angular Element** - Run `npm run build:element:prod`
6. **Start backend** - Run `node projects/backend/server.js`
7. **Start frontend** - Run `npm start`

For more information, see:
- [ANGULAR_ELEMENT_USAGE.md](./ANGULAR_ELEMENT_USAGE.md) - Using the chatbot element
- [QUICK_START.md](./QUICK_START.md) - Quick start guide

