
# Remove Visual Guides from Pre-Hajj India Section

## Overview
This plan removes the "Visual Guides" section (containing Grand Mosque Guide, Madinah Landmarks, and Cybersecurity Awareness cards) from the Pre-Hajj India page.

## Changes Required

### 1. Update PreHajjIndiaPage.tsx
- Remove the import statement for `BeforeHajjGuides` component (line 8)
- Remove the `<BeforeHajjGuides />` component usage (line 60)

### 2. Delete BeforeHajjGuides.tsx (Optional)
Since the `BeforeHajjGuides` component will no longer be used, it can be deleted to keep the codebase clean. However, if you plan to use it elsewhere in the future, it can be kept.

---

## Technical Details

**File: `src/pages/PreHajjIndiaPage.tsx`**

Remove line 8:
```typescript
import { BeforeHajjGuides } from "@/components/BeforeHajjGuides";
```

Remove lines 59-60:
```typescript
{/* Visual Guides Section */}
<BeforeHajjGuides />
```

**File: `src/components/BeforeHajjGuides.tsx`**
- Delete this file entirely (optional but recommended for cleanup)

---

## Result
After implementation, the Pre-Hajj India page will show:
1. Back button
2. Page title and subtitle
3. Pre-Hajj Notifications section
4. The standard section cards (Haj Committee, Embassies, Training, etc.)

The Visual Guides section with the three image cards will be completely removed.
