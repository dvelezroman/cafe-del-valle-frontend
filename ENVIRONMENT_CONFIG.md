# Angular Environment Configuration Guide

## Overview

The frontend now uses Angular's standard environment configuration system instead of hardcoded values.

## Files Structure

```
src/environments/
├── environment.ts       # Development configuration (used by default)
└── environment.prod.ts  # Production configuration (used when building with --configuration=production)
```

## Configuration Files

### Development ([environment.ts](file:///Users/dvelezroman/Develop/cafe-del-valle/cafe-del-valle-frontend/src/environments/environment.ts))
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Production ([environment.prod.ts](file:///Users/dvelezroman/Develop/cafe-del-valle/cafe-del-valle-frontend/src/environments/environment.prod.ts))
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.cafedelvalle.com/api' // Update with your production API URL
};
```

## How It Works

1. **Development Mode** (`npm start` or `npm run dev`)
   - Uses `environment.ts`
   - API URL: `http://localhost:3000/api`

2. **Production Build** (`npm run build`)
   - Angular automatically replaces `environment.ts` with `environment.prod.ts`
   - Configured in `angular.json` via `fileReplacements`
   - API URL: Production URL from `environment.prod.ts`

## Usage in Services

All services now import from the environment file:

```typescript
import { environment } from '../../environments/environment';

export class SubscriberManagementService {
  private baseUrl = `${environment.apiUrl}/subscription/admin`;
  // ...
}
```

## Updating API URLs

### For Development:
Edit [src/environments/environment.ts](file:///Users/dvelezroman/Develop/cafe-del-valle/cafe-del-valle-frontend/src/environments/environment.ts)

### For Production:
Edit [src/environments/environment.prod.ts](file:///Users/dvelezroman/Develop/cafe-del-valle/cafe-del-valle-frontend/src/environments/environment.prod.ts)

## Note on .env File

The `.env` file in the root is **for documentation only**. Angular doesn't natively support `.env` files like React. Instead, use the `environment.ts` files as described above.

## Deployment Checklist

Before deploying to production:

1. ✅ Update `apiUrl` in `environment.prod.ts` with your production API URL
2. ✅ Build with: `npm run build` (automatically uses production config)
3. ✅ Deploy the contents of `dist/cafe-del-valle-frontend/`

## Build Verification

✅ **Development build**: Uses `environment.ts`
```bash
ng build --configuration=development
```

✅ **Production build**: Uses `environment.prod.ts`
```bash
ng build --configuration=production
# or simply
npm run build
```
