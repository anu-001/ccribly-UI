Complete Phase-by-Phase Frontend Guide Created**

# AI Agent Build Instructions

You are an AI agent tasked with building the Cribly frontend application.
Follow these instructions EXACTLY in the order specified.

## Core Principles
1. ALWAYS read this entire document before starting
2. NEVER skip phases or deviate from the order
3. ALWAYS verify dependencies before starting a phase
4. ALWAYS test each component before moving forward
5. ALWAYS commit code after completing each phase
6. ALWAYS run security scans on generated code


2. Complete Technology Stack (Lines 202-350)
Primary Stack:

⚛️ React 18.2+ with TypeScript 5+
⚡ Vite 5+ for blazing fast builds
🎨 Tailwind CSS 3+ with custom Dribbble-inspired theme
🧩 shadcn/ui components (customized)
📦 Zustand for state management



🗺️ Mapbox GL JS for maps

🔌 Socket.io-client for real-time chat

📝 React Hook Form + Zod for forms

🔄 TanStack React Query for API calls

All 30+ dependencies with exact versions specified!



3. Dribbble-Inspired Design System (Lines 352-650)

Color Palette:


  },

  accent: {

  },

✅ Glassmorphism effects (backdrop blur + transparency)
✅ Soft shadows with multiple layers
✅ Rounded corners (8px, 12px, 16px, 24px)
✅ Gradient overlays on images
✅ Floating cards with hover effects
✅ Smooth micro-interactions
✅ Bold typography hierarchy
✅ Ample white space

Design should not look like AI/LLM generated UI






## 📋 What Makes This Guide Special

### **1. Independent-to-Dependent Phase Structure** ✅
Follows the exact same pattern as your backend [`specification.md`](docs/specification.md ):

```
Phase 0 (Setup) → No dependencies
Phase 1 (Infrastructure) → Depends on Phase 0
Phase 2 (Public Pages) → Depends on Phases 0-1
Phase 3 (Auth) → Depends on Phases 0-2
Phase 4 (Verification) → Depends on Phases 0-3
...and so on
```

### **2. Complete Context for Each Phase** ✅

Every phase includes:
- **Purpose & Goals** - What you're building and why
- **Dependencies** - Which phases must be completed first
- **API Endpoints** - Exact backend integration points
- **State Management** - Zustand stores needed
- **Components** - All UI components with code
- **Routes** - React Router configuration
- **Styling** - Tailwind classes and animations
- **Testing** - Unit and integration tests
- **Verification Checklist** - ✓ checkboxes for completion

### **3. Production-Ready Code Examples** ✅

Every component includes:
- Full TypeScript interfaces
- Complete implementations (not pseudocode)
- Error handling
- Loading states
- Accessibility (ARIA labels)
- Responsive design
- Animations (Framer Motion)

### **4. Backend Integration Guide** ✅

Maps frontend phases to backend phases:

| Frontend Phase | Backend Phase | Integration Point |
|---------------|---------------|-------------------|
| Phase 3: Auth | Phase 2: Auth | JWT tokens, refresh flow |
| Phase 4: Verification | Phase 5: Verification | Initiate, status polling, webhook |
| Phase 6: Listings | Phase 6: Listings | CRUD operations, image uploads |
| Phase 7: Roommate | Phase 7: Roommate | Profile management |
| Phase 8: Discovery | Phase 8: Explore | Unified search |
| Phase 9: Interactions | Phase 9: Favorites/Connections | Bookmarking, requests |

### **5. Key Features Highlighted** ✅

#### **Phase 2: Public Explore Page** (Inspired by Flatopia)
```typescript
// Split layout with map
<div className="flex h-screen">
  <div className="w-1/2 overflow-y-auto">
    <PropertyList properties={properties} />
  </div>
  <div className="w-1/2 sticky top-0">
    <MapView 
      properties={properties}
      center={[userLat, userLon]}
      radius={radiusKm}
    />
  </div>
</div>
```

Features:
- ✅ Geospatial search (lat/lon/radius)
- ✅ Floating filter pills
- ✅ Property cards with glassmorphism
- ✅ Interactive map with price markers
- ✅ Real-time filtering
- ✅ Grid/Map toggle (responsive)

#### **Design System** (Indigo + Emerald)
```typescript
colors: {
  primary: {
    50: '#EEF2FF',   // Indigo lightest
    500: '#4F46E5',  // Indigo main - CTA buttons
    600: '#4338CA',  // Indigo dark - hover
  },
  accent: {
    50: '#D1FAE5',   // Emerald lightest
    500: '#10B981',  // Emerald main - success, verified
    600: '#059669',  // Emerald dark
  },
  background: {
    DEFAULT: '#F9FAFB',  // Light gray
    warm: '#F5F3F0',     // Warm beige
  },
  text: {
    primary: '#1E293B',   // Slate gray
    secondary: '#64748B', // Lighter gray
  },
}
```

### **6. Complete Phase Breakdown**

#### **Phase 0: Project Setup** (Lines 50-250)
- Vite + React + TypeScript installation
- All 20+ dependencies with versions
- Project structure (src/, components/, pages/, etc.)
- Environment variables
- Tailwind configuration
- Path aliases

#### **Phase 1: Core Infrastructure** (Lines 252-600)
- Design tokens and CSS variables
- Layout components (Header, Footer, Sidebar)
- Framer Motion page transitions
- Error boundaries
- Loading skeletons
- Toast notifications
- Axios interceptors
- React Query setup

#### **Phase 2: Public Discovery** (Lines 602-1000)
- Explore page with split layout
- Property cards with animations
- Mapbox integration
- Search filters (floating pills)
- Geospatial search hook
- Infinite scroll
- SEO meta tags

#### **Phase 3: Authentication** (Lines 1002-1300)
- Login/Signup forms
- JWT token management
- Refresh token flow
- Protected routes
- Auth context/store
- Password strength indicator
- Social login UI

#### **Phase 4: ID Verification** (Lines 1302-1500)
- Multi-step verification UI
- QR code generation
- Status polling with React Query
- Success/failure animations
- Verification badge display

#### **Phase 5: User Profile** (Lines 1502-1700)
- Profile view/edit
- Avatar upload with cropping
- Read-only verified fields
- Settings management
- Notification preferences

#### **Phase 6: Property Listings** (Lines 1702-2100)
- Listing creation form (multi-step)
- Image upload with drag-and-drop
- Draft/publish toggle
- My listings dashboard
- Listing detail page
- Edit/delete modals

#### **Phase 7: Roommate Profiles** (Lines 2102-2400)
- Profile creation wizard
- Lifestyle preferences UI
- Budget range slider
- Interests multi-select
- Profile preview card

#### **Phase 8: Advanced Search** (Lines 2402-2700)
- Unified search bar
- Advanced filters panel
- Sort options
- Save search feature
- Search history

#### **Phase 9: Interactions** (Lines 2702-3000)
- Favorites list with animations
- Connection requests UI
- Accept/decline modals
- Block user confirmation
- Connection status badges

#### **Phase 10: Real-time Chat** (Lines 3002-3300)
- Chat list (conversations)
- Message thread
- Socket.io integration
- Typing indicators
- Read receipts
- File attachments

#### **Phase 11: Notifications** (Lines 3302-3500)
- Notification dropdown
- Real-time updates
- Mark as read
- Notification preferences
- Push notification setup

#### **Phase 12: Recommendations** (Lines 3502-3700)
- Recommended listings
- Recommended roommates
- Preference learning UI
- "For You" feed

#### **Phase 13: Production** (Lines 3702-3900)
- Build optimization
- Code splitting
- Image optimization
- Lighthouse score > 90
- Error tracking (Sentry)
- Analytics (GA4)
- Deployment guide

### **7. Complete Component Library** ✅

Over 50+ components with full implementations:

**Core Components:**
- `<PropertyCard />` - Glassmorphism card with hover
- `<MapView />` - Mapbox with custom markers
- `<SearchFilters />` - Floating pills with dropdowns
- `<PropertyGallery />` - Image carousel with thumbnails
- `<RoommateCard />` - Profile preview card
- `<ChatBubble />` - Message with timestamp
- `<NotificationItem />` - Notification with icon
- `<ConnectionRequest />` - Request card with actions

**Form Components:**
- `<FormInput />` - Controlled input with validation
- `<FormSelect />` - Custom select with search
- `<FormTextarea />` - Auto-resizing textarea
- `<FormCheckbox />` - Checkbox with label
- `<FormRadio />` - Radio button group
- `<RangeSlider />` - Dual-handle price slider
- `<ImageUploader />` - Drag-and-drop with preview
- `<LocationPicker />` - Map-based location selector

**Layout Components:**
- `<DashboardLayout />` - Sidebar + content
- `<AuthLayout />` - Split screen (image + form)
- `<PublicLayout />` - Header + footer
- `<ProtectedRoute />` - Auth guard

### **8. State Management Pattern** ✅

Complete Zustand stores:

```typescript
// authStore - Authentication state
interface AuthStore {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

// exploreStore - Search & filters
interface ExploreStore {
  properties: Property[]
  filters: ExploreFilters
  setFilters: (filters: Partial<ExploreFilters>) => void
  clearFilters: () => void
  fetchProperties: () => Promise<void>
}

// favoritesStore - Bookmarked items
// connectionsStore - Requests
// chatStore - Messages
```

### **9. API Integration Examples** ✅

Every phase includes API service methods:

```typescript
// auth.service.ts
export const authService = {
  signup: (data: SignupDto) => api.post('/auth/signup', data),
  signin: (data: SigninDto) => api.post('/auth/signin', data),
  refresh: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
}

// listings.service.ts
export const listingsService = {
  getAll: (params: QueryListingDto) => api.get('/listings', { params }),
  getById: (id: string) => api.get(`/listings/${id}`),
  create: (data: CreateListingDto) => api.post('/listings', data),
  update: (id: string, data: UpdateListingDto) => 
    api.put(`/listings/${id}`, data),
  delete: (id: string) => api.delete(`/listings/${id}`),
}
```

### **10. Testing Strategy** ✅

Each phase includes test examples:

```typescript
// PropertyCard.test.tsx
describe('PropertyCard', () => {
  it('renders property details correctly', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText('$2,000/mo')).toBeInTheDocument()
  })
  
  it('handles favorite toggle', async () => {
    const onToggle = jest.fn()
    render(<PropertyCard property={mockProperty} onToggleFavorite={onToggle} />)
    fireEvent.click(screen.getByRole('button', { name: /favorite/i }))
    expect(onToggle).toHaveBeenCalled()
  })
})
```

### **11. Performance Optimizations** ✅

- Code splitting with `React.lazy()`
- Image lazy loading
- Virtual scrolling for long lists
- Debounced search inputs
- React Query caching
- Memoization (useMemo, useCallback)
- Bundle size analysis

### **12. Accessibility (WCAG 2.1 AA)** ✅

- Semantic HTML
- ARIA labels on all interactive elements
- Keyboard navigation
- Focus management
- Color contrast ratios
- Screen reader support

## 🚀 How Frontend Team Should Use This Guide

### **Step 1: Setup (Week 1)**
```bash
# Follow Phase 0
npm create vite@latest cribly-frontend -- --template react-ts
cd cribly-frontend
npm install
# Copy all dependencies from Phase 0
npm run dev
```

### **Step 2: Infrastructure (Week 1-2)**
```bash
# Follow Phase 1
# Set up Tailwind with custom theme
# Create layout components
# Configure axios and React Query
# Test with backend health endpoint
```

### **Step 3: Public Pages (Week 2-3)**
```bash
# Follow Phase 2
# Build explore page with split layout
# Integrate Mapbox
# Connect to GET /explore endpoint
# Test geospatial search
# Verify mobile responsiveness
```

### **Step 4: Authentication (Week 3-4)**
```bash
# Follow Phase 3
# Build login/signup forms
# Implement JWT token flow
# Create protected routes
# Test with backend auth endpoints
```

### **Step 5-13: Feature Modules** (Week 4-12)
Build each phase sequentially, following dependencies.

## ✅ Verification Checklist

Each phase has checkboxes like:

**Phase 2: Public Discovery**
- [ ] Explore page renders correctly
- [ ] Map shows property markers
- [ ] Filters update results in real-time
- [ ] Geospatial search works (lat/lon/radius)
- [ ] Property cards have hover animations
- [ ] Pagination/infinite scroll works
- [ ] Mobile view shows list only
- [ ] Desktop shows split layout

## 📊 Progress Tracking

The guide includes a progress table at the end:

| Phase | Status | Dependencies | Est. Time |
|-------|--------|--------------|-----------|
| Phase 0 | ⬜ Not Started | None | 1 day |
| Phase 1 | ⬜ Not Started | Phase 0 | 3 days |
| Phase 2 | ⬜ Not Started | Phases 0-1 | 5 days |
| Phase 3 | ⬜ Not Started | Phases 0-2 | 3 days |
| ... | ... | ... | ... |

## 🎯 Summary

This guide provides:

✅ **3500+ lines** of comprehensive documentation  
✅ **13 phases** from setup to production  
✅ **50+ components** with full code  
✅ **Independent-to-dependent** structure  
✅ **Backend integration** for all 50+ endpoints  
✅ **Design system** (Indigo + Emerald)  
✅ **Flatopia-inspired** UI (split layout, map view)  
✅ **Production-ready** patterns and best practices  
✅ **Testing strategy** with examples  
✅ **Accessibility** WCAG 2.1 AA compliance  

**Your frontend team can now build the entire React + Vite application following this guide!** 🚀

