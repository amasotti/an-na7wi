# Login Feature Implementation Plan

## Overview

This document outlines the implementation plan for adding a comprehensive authentication and authorization system to the an-na7wi Arabic learning application. The system will support Google SSO and username/password authentication with role-based access control.

## Current Architecture Analysis

### Backend (Kotlin + Quarkus)
- **Framework**: Quarkus 3.25+ with no current authentication/authorization
- **Database**: PostgreSQL with Flyway migrations
- **API Structure**: RESTful APIs under `/api/v1/`
- **Controllers**: No security annotations found - all endpoints are currently public

### Frontend (Nuxt 4 + TypeScript)
- **Framework**: Nuxt 4.0.2 with Vue 3 Composition API
- **State Management**: Pinia stores (textStore, wordStore, rootStore)
- **No authentication state management currently exists**

## Requirements

### User Roles
1. **Admin (Owner)** - Full CRUD access to all resources
2. **ReadOnly User** - Can view all content but cannot create/edit/delete

### Authentication Methods
1. **Google SSO** - Primary authentication method
2. **Username/Password** - Fallback authentication method

### Access Control
- **Admin actions**: Create, Update, Delete texts/words/annotations/roots
- **ReadOnly actions**: View all content, search, browse
- **Public endpoints**: Health checks, metrics (if needed)

## Implementation Plan

### Phase 1: Backend Authentication Setup

#### 1.1 Dependencies & Configuration
```kotlin
// Add to build.gradle.kts
implementation("io.quarkus:quarkus-oidc")
implementation("io.quarkus:quarkus-security")
implementation("io.quarkus:quarkus-security-jpa")
implementation("io.quarkus:quarkus-elytron-security-oauth2")
```

#### 1.2 Database Schema Extensions
**Migration: V13__Add_User_Authentication.sql**
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100),
    password_hash VARCHAR(255), -- Only for username/password auth
    google_sub VARCHAR(255) UNIQUE, -- Google subject ID
    role VARCHAR(20) NOT NULL DEFAULT 'READONLY',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    last_login TIMESTAMP,
    
    CONSTRAINT users_email_check CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'),
    CONSTRAINT users_role_check CHECK (role IN ('ADMIN', 'READONLY')),
    CONSTRAINT users_auth_method_check CHECK (
        (password_hash IS NOT NULL AND google_sub IS NULL) OR
        (password_hash IS NULL AND google_sub IS NOT NULL)
    )
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_sub ON users(google_sub);
CREATE INDEX idx_users_role ON users(role);

-- Insert admin user (to be configured via environment variables)
INSERT INTO users (email, role, username, is_active) 
VALUES ('${ADMIN_EMAIL}', 'ADMIN', 'admin', true);
```

#### 1.3 User Entity & Repository
```kotlin
// entity/User.kt
@Entity
@Table(name = "users")
class User : PanacheEntity() {
    @Column(nullable = false, unique = true)
    lateinit var email: String
    
    var username: String? = null
    
    @Column(name = "password_hash")
    var passwordHash: String? = null
    
    @Column(name = "google_sub", unique = true)
    var googleSub: String? = null
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var role: UserRole = UserRole.READONLY
    
    @Column(name = "is_active", nullable = false)
    var isActive: Boolean = true
    
    // timestamps, etc.
}

enum class UserRole {
    ADMIN, READONLY
}

// repository/UserRepository.kt
@ApplicationScoped
class UserRepository : PanacheRepository<User> {
    fun findByEmail(email: String): User? = find("email", email).firstResult()
    fun findByGoogleSub(googleSub: String): User? = find("googleSub", googleSub).firstResult()
}
```

#### 1.4 Authentication Service
```kotlin
// service/AuthService.kt
@ApplicationScoped
class AuthService {
    @Inject
    lateinit var userRepository: UserRepository
    
    fun authenticateWithGoogle(googleToken: String): User {
        // Validate Google token and extract user info
        // Create user if doesn't exist, update last_login
    }
    
    fun authenticateWithPassword(email: String, password: String): User {
        // Validate password hash
        // Update last_login
    }
    
    fun createUser(email: String, role: UserRole = UserRole.READONLY): User {
        // Create new user
    }
}
```

#### 1.5 Security Configuration
```kotlin
// config/SecurityConfig.kt
@ApplicationScoped
class SecurityConfig {
    
    @ConfigProperty(name = "google.oauth.client-id")
    lateinit var googleClientId: String
    
    // JWT and session configuration
}
```

#### 1.6 Secure Controllers
Add security annotations to existing controllers:

```kotlin
// Example for TextController.kt
@GET
@RolesAllowed("ADMIN", "READONLY")
fun getAllTexts(/* params */): Response { /* ... */ }

@POST
@RolesAllowed("ADMIN")
fun createText(textDTO: TextRequestDTO): Response { /* ... */ }

@PUT
@Path("/{id}")
@RolesAllowed("ADMIN")
fun updateText(/* params */): Response { /* ... */ }

@DELETE
@Path("/{id}")
@RolesAllowed("ADMIN")
fun deleteText(@PathParam("id") id: UUID): Response { /* ... */ }
```

#### 1.7 Authentication Controller
```kotlin
// controller/v1/AuthController.kt
@Path("/api/v1/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class AuthController {
    
    @POST
    @Path("/google")
    fun authenticateWithGoogle(request: GoogleAuthRequest): Response { /* ... */ }
    
    @POST
    @Path("/login")
    fun login(request: LoginRequest): Response { /* ... */ }
    
    @POST
    @Path("/logout")
    @RolesAllowed("ADMIN", "READONLY")
    fun logout(): Response { /* ... */ }
    
    @GET
    @Path("/profile")
    @RolesAllowed("ADMIN", "READONLY")
    fun getProfile(): Response { /* ... */ }
}
```

### Phase 2: Frontend Authentication Implementation

#### 2.1 User Store
```typescript
// stores/userStore.ts
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isReadOnly = computed(() => user.value?.role === 'READONLY')
  
  async function loginWithGoogle(googleToken: string): Promise<void> { /* ... */ }
  async function loginWithPassword(email: string, password: string): Promise<void> { /* ... */ }
  async function logout(): Promise<void> { /* ... */ }
  async function getProfile(): Promise<void> { /* ... */ }
  
  return {
    user, token, isAuthenticated, isAdmin, isReadOnly,
    loginWithGoogle, loginWithPassword, logout, getProfile
  }
})
```

#### 2.2 Authentication Pages
```vue
<!-- pages/login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold">Sign in to an-na7wi</h2>
      </div>
      
      <!-- Google Sign In -->
      <button @click="signInWithGoogle" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
        <GoogleIcon class="mr-2" />
        Continue with Google
      </button>
      
      <!-- Divider -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300" />
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <!-- Email/Password Form -->
      <form @submit.prevent="signInWithPassword">
        <div class="space-y-4">
          <div>
            <input v-model="email" type="email" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Email address" />
          </div>
          <div>
            <input v-model="password" type="password" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Password" />
          </div>
          <button type="submit" :disabled="loading" class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50">
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
```

#### 2.3 Authentication Middleware
```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()
  
  if (!userStore.isAuthenticated) {
    return navigateTo('/login')
  }
})

// middleware/admin.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()
  
  if (!userStore.isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access required'
    })
  }
})
```

#### 2.4 Update Existing Components
- Add conditional rendering based on user role for edit/delete buttons
- Update all forms to check `isAdmin` before showing
- Add authentication checks to API calls

### Phase 3: Integration & Security

#### 3.1 CORS & API Integration
Update CORS configuration to handle authentication headers:
```properties
quarkus.http.cors.headers=Content-Type,Authorization,X-Requested-With
```

#### 3.2 Error Handling
- 401 Unauthorized responses redirect to login
- 403 Forbidden responses show appropriate error messages

#### 3.3 Token Management
- Implement JWT with refresh tokens
- Secure token storage (httpOnly cookies recommended)
- Automatic token refresh

### Phase 4: Testing Strategy

#### 4.1 Backend Tests
```kotlin
// Test security annotations
@QuarkusTest
class AuthControllerTest {
    @Test
    fun `should require authentication for protected endpoints`() { /* ... */ }
    
    @Test
    fun `should allow admin to create texts`() { /* ... */ }
    
    @Test
    fun `should deny readonly users from creating texts`() { /* ... */ }
}
```

#### 4.2 Frontend Tests
```typescript
// Test authentication flows
describe('Authentication', () => {
  it('should redirect to login when not authenticated', () => { /* ... */ })
  it('should show admin buttons for admin users', () => { /* ... */ })
  it('should hide admin buttons for readonly users', () => { /* ... */ })
})
```

## Configuration

### Environment Variables
```bash
# Backend
ADMIN_EMAIL=your-email@domain.com
GOOGLE_OAUTH_CLIENT_ID=your-google-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-jwt-secret

# Frontend
GOOGLE_CLIENT_ID=your-google-client-id
```

### Application Properties
```properties
# Google OAuth
quarkus.oidc.client-id=${GOOGLE_OAUTH_CLIENT_ID}
quarkus.oidc.credentials.secret=${GOOGLE_OAUTH_CLIENT_SECRET}

# JWT
quarkus.smallrye-jwt.enabled=true
mp.jwt.verify.publickey.location=META-INF/publicKey.pem
```

## Migration Strategy

1. **Phase 1**: Implement backend authentication (non-breaking)
2. **Phase 2**: Add frontend authentication pages
3. **Phase 3**: Enable security on backend endpoints gradually
4. **Phase 4**: Full rollout with user onboarding

## Security Considerations

1. **Password Storage**: Use bcrypt with appropriate rounds
2. **Token Security**: Short-lived JWT with secure refresh mechanism
3. **Google OAuth**: Validate tokens server-side
4. **CSRF Protection**: Implement CSRF tokens for state-changing operations
5. **Rate Limiting**: Implement rate limiting for authentication endpoints
6. **Audit Logging**: Log authentication events and admin actions

## Future Enhancements

1. **User Management**: Admin interface to manage users
2. **Password Reset**: Email-based password reset flow
3. **Two-Factor Authentication**: Optional 2FA for admin users
4. **API Keys**: For potential mobile app or third-party integrations
5. **User Preferences**: Per-user settings and preferences