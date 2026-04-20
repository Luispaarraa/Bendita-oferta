# Bendita Oferta - Specification

## 1. Project Overview
- **Project Name**: Bendita Oferta
- **Type**: Single Page Web Application
- **Core Functionality**: Social platform for sharing and discovering deals from convenience stores with image uploads, comments, and real-time updates
- **Target Users**: Shoppers looking for the best deals in convenience stores (OXXO, 7-Eleven, Extra, etc.)

## 2. UI/UX Specification

### Layout Structure
- **Header**: Fixed top navigation with logo, search bar, and "New Post" button
- **Main Content**: Two-column layout on desktop (feed + sidebar), single column on mobile
- **Feed Section**: Cards displaying posts with images, details, and comments
- **Sidebar**: Trending deals, top contributors, store filters

### Responsive Breakpoints
- Mobile: < 768px (single column)
- Tablet: 768px - 1024px (compressed two-column)
- Desktop: > 1024px (full two-column)

### Visual Design

#### Color Palette
- **Background Primary**: #0D0D0D (deep black)
- **Background Secondary**: #1A1A1A (card backgrounds)
- **Background Tertiary**: #252525 (input fields, hover states)
- **Accent Primary**: #00FF88 (neon green - deals/savings)
- **Accent Secondary**: #FF6B35 (orange - alerts/urgency)
- **Accent Tertiary**: #7B68EE (purple - premium features)
- **Text Primary**: #FFFFFF
- **Text Secondary**: #A0A0A0
- **Text Muted**: #666666
- **Border Color**: #333333

#### Typography
- **Font Family**: "Outfit" (headings), "DM Sans" (body) from Google Fonts
- **Logo**: 28px bold
- **Headings**: 20px semibold
- **Body**: 15px regular
- **Small/Meta**: 13px regular

#### Spacing System
- Base unit: 8px
- Card padding: 24px
- Section gaps: 32px
- Element gaps: 16px

#### Visual Effects
- Card shadows: 0 4px 20px rgba(0, 255, 136, 0.05)
- Hover transitions: 0.3s ease
- Border radius: 12px (cards), 8px (buttons/inputs)
- Glow effect on accent elements: 0 0 20px rgba(0, 255, 136, 0.3)

### Components

#### Header
- Logo with icon (left)
- Search input with icon (center)
- "Nueva Oferta" button with + icon (right)
- Backdrop blur effect

#### Post Card
- Store badge (top-left corner with store icon)
- User avatar + username + timestamp
- Deal title (bold)
- Original price (strikethrough) + discounted price (accent color)
- Description text
- Image container (max-height 400px, object-fit cover)
- Action bar: Like, Comment, Share buttons
- Comment section (collapsible)

#### Comment Component
- User avatar
- Username + timestamp
- Comment text
- Reply button

#### New Post Modal
- Overlay with blur backdrop
- Form fields: Store selector, Title, Description, Prices, Image upload
- Drag & drop image zone
- Submit and Cancel buttons

#### Store Filter Pills
- Horizontal scrollable pills
- Active state with accent color
- Stores: OXXO, 7-Eleven, Extra, Soriana, Chedraui, Walmart, Elektra

## 3. Functionality Specification

### Core Features
1. **View Posts**: Scrollable feed of deals with images
2. **Create Post**: Modal form to submit new deals with:
   - Store selection (dropdown)
   - Deal title
   - Description
   - Original price
   - Discounted price
   - Image upload (file input + drag & drop)
3. **Comment System**: Add comments to any post
4. **Like System**: Like posts to show appreciation
5. **Search**: Filter posts by keyword
6. **Store Filter**: Filter by specific store

### User Interactions
- Click "Nueva Oferta" → Opens modal
- Click store pill → Filters feed by store
- Click comment icon → Expands comment section
- Click image in new post → Opens file picker
- Drag image to drop zone → Uploads image
- Click like → Toggles like state with animation

### Data Handling
- All data stored in localStorage (persistence)
- Default seed data with sample posts
- Auto-generate timestamps relative to now

### Edge Cases
- Empty state when no posts match filter
- Image upload validation (max 5MB, jpg/png only)
- Long text truncation with "ver más"
- Handle broken image URLs gracefully

## 4. Acceptance Criteria

### Visual Checkpoints
- [ ] Dark theme with neon green accents visible
- [ ] Cards have subtle glow effect on hover
- [ ] Smooth transitions on all interactive elements
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] Images display correctly in cards
- [ ] Modal has backdrop blur effect

### Functional Checkpoints
- [ ] Can create new post with all fields
- [ ] Can upload and preview images
- [ ] Can add comments to posts
- [ ] Can like/unlike posts
- [ ] Can filter by store
- [ ] Can search posts
- [ ] Data persists after page reload
- [ ] Default posts load on first visit
