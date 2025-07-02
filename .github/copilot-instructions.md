<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

Project: RantBox
Stack: Next.js, React, Tailwind CSS, TypeScript, Firebase, Stripe

## MVP Features Implemented:

### Main Page:
- "Release the Rage" (simple form: text field + "Let it rip!" button)
- "Give Me a Hug" (random message + option to send your own)
- "Be Savage" (same as 1, but with warning: "Anything goes, except names")

### Public Feed (no login required):
- Shows recent posts (without identification)
- "Twitter of Hate" style design (black background, impactful fonts)
- 🔥 (like) and "Share" buttons (copy direct link to post)

### Content Moderation:
- Banned words filter (e.g., names, racism, threats)
- "Report" button for users to flag problems
- Automatic content filtering

### Admin Dashboard:
- View all rants
- Moderate content (hide/restore posts)
- Basic statistics (total posts, reports, etc.)
- Filter posts by status (all, reported, moderated)
- **Firebase Authentication required for access**

### Additional Features:
- Individual post pages for sharing
- Real-time statistics
- Anonymous posting system
- Responsive design (mobile-optimized)
- Dark theme throughout
- **PWA Ready** - Works as mobile app

## Payment System:
- **Credit-based model**: Users buy credit packages instead of paying per post
- **Stripe Integration**: Secure payment processing
- **Package options**: $5 = 6 posts, $10 = 12 posts (better value)
- **Anonymous wallet**: Users identified by Firebase Auth but posts remain anonymous

## Technical Implementation:
- **Firebase Firestore**: Real-time database for posts, users, and stats
- **Firebase Authentication**: Google Sign-in and Email/Password
- **Stripe Payments**: Credit package purchases
- **Progressive Web App (PWA)**: Installable, offline-ready
- TypeScript for type safety
- Tailwind CSS for styling
- Mobile-first responsive design
- SEO-friendly metadata

## File Structure:
- `/src/app/` - Main pages (home, feed, admin, post/[id], buy-credits)
- `/src/lib/firebase.ts` - Firebase configuration and services
- `/src/lib/data.ts` - Data service with Firebase integration
- `/src/contexts/AuthContext.tsx` - Authentication state management
- `/src/components/` - Reusable UI components (AuthModal, etc.)
- `/src/types/` - TypeScript type definitions
- `/src/app/api/` - Stripe payment endpoints
- `/public/` - PWA manifest and service worker
- All components are functional and Firebase-connected

## Environment Variables Required:
- Firebase config (NEXT_PUBLIC_FIREBASE_*)
- Stripe keys (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY)


