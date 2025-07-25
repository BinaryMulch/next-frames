# Bug Tracking Document

This document tracks identified bugs in the Next Frames codebase that need to be fixed.

## Critical Bugs (Fix First)

### ✅ Bug #1: Variable Name Mismatch in uploadImage.js
**File:** `app/actions/uploadImage.js:59`  
**Status:** FIXED  
**Priority:** Critical  
**Description:** Using undefined variable name in error logging
```javascript
// Current (broken):
console.error("Storage Error: ", storageError);

// Should be:
console.error("Storage Error: ", error);
```

### ✅ Bug #2: Wrong Variable in deleteFromStorage Call  
**File:** `app/actions/uploadImage.js:30`  
**Status:** FIXED  
**Priority:** Critical  
**Description:** Cleanup function uses wrong variable name, causing storage files to remain after failed uploads
```javascript
// Current (broken):
deleteFromStorage(supabase, file.storageId);

// Should be:
deleteFromStorage(supabase, storageId);
```

### ✅ Bug #3: Move Direction Logic Inverted
**Files:** `app/actions/moveUpImage.js` and `app/actions/moveDownImage.js`  
**Status:** FIXED  
**Priority:** Critical  
**Description:** "Move up" increases order_position instead of decreasing it, causing inverted behavior

**moveUpImage.js fixes needed:**
```javascript
// Line 26 - Current (broken):
.eq("order_position", image.order_position + 1);
// Should be:
.eq("order_position", image.order_position - 1);

// Line 41 - Current (broken):
.update({order_position: image.order_position + 1})
// Should be:
.update({order_position: image.order_position - 1})
```

**moveDownImage.js fixes needed:**
```javascript
// Line 26 - Current (broken):
.eq("order_position", image.order_position - 1);
// Should be:
.eq("order_position", image.order_position + 1);

// Line 40 - Current (broken):
.update({order_position: image.order_position - 1})
// Should be:
.update({order_position: image.order_position + 1})
```

## Security Issues

### ✅ Bug #4: Authentication Bypassed in getAllImages
**File:** `app/actions/getAllImages.js:10-17`  
**Status:** FIXED  
**Priority:** High  
**Description:** Authentication check is commented out, allowing unauthorized access to images
```javascript
// Current: Authentication is commented out
/*
const {data: authData, error: authError} = await supabase.auth.getUser();
if (authError || !authData.user) {
    console.error("Auth Error: ", authError);
    return null;
}
*/

// Should be: Uncomment and enable authentication
```

### ✅ Bug #5: Missing Error Handling in getAllImages
**File:** `app/actions/getAllImages.js:20-22`  
**Status:** FIXED  
**Priority:** High  
**Description:** Database query has no error handling, could crash application
```javascript
// Current (no error handling):
const {data} = await supabase
    .from("images")
    .select();

// Should include error handling:
const {data, error} = await supabase
    .from("images")
    .select();

if (error) {
    console.error("Database Error: ", error);
    return [];
}
```

## Logic Issues

### ✅ Bug #6: No Success/Failure Feedback in Image Upload
**File:** `components/ImageUploadCard.jsx:40, 60`  
**Status:** FIXED  
**Priority:** Medium  
**Description:** Always shows success toast even if upload fails
```javascript
// Current: Always shows success
const success = await uploadImage(files);
toast.success("File uploaded!");

// Should check success status:
const success = await uploadImage(files);
if (success) {
    toast.success("File uploaded!");
} else {
    toast.error("Upload failed!");
}
```

### ✅ Bug #7: Missing File Type Validation
**File:** `components/ImageUploadCard.jsx`  
**Status:** FIXED  
**Priority:** Medium  
**Description:** UI mentions supported file types but doesn't validate them

**Suggested fix:** Add file type validation:
```javascript
const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
const invalidFiles = Array.from(files).filter(file => !validTypes.includes(file.type));

if (invalidFiles.length > 0) {
    toast.error("Invalid file type! Only JPG, PNG, GIF, SVG allowed.");
    return false;
}
```

### ✅ Bug #8: Race Condition in Image Reordering
**Files:** `app/actions/moveUpImage.js`, `app/actions/moveDownImage.js`  
**Status:** FIXED  
**Priority:** Medium  
**Description:** Simultaneous move operations could create duplicate order_position values

**Suggested fix:** Add database transaction or locking mechanism

### ✅ Bug #9: Carousel Index Bounds Risk
**File:** `components/carousel.jsx:33-36`  
**Status:** FIXED  
**Priority:** Low  
**Description:** Race condition where currentIndex might exceed array length when images change

**Current logic is good but could be more defensive:**
```javascript
// Additional safety check:
if (currentIndex >= images.length && images.length > 0) {
    setCurrentIndex(0);
}
```

## Minor Issues

### 🔧 Bug #10: Inconsistent Error Messages
**File:** `app/actions/moveDownImage.js:44-45`  
**Status:** Not Fixed  
**Priority:** Low  
**Description:** Error messages say "Move Up Error" but should say "Move Down Error"
```javascript
// Current (inconsistent):
console.log("Move Up Error: ", updateAboveError);
console.log("Move Up Error: ", updateThisError);

// Should be:
console.log("Move Down Error: ", updateAboveError);
console.log("Move Down Error: ", updateThisError);
```

## Additional Bugs Found (Re-Analysis)

### ✅ Bug #11: Move Up/Down Buttons Commented Out
**File:** `components/imageCard.jsx:16-17`  
**Status:** FIXED  
**Priority:** Medium  
**Description:** Move up/down functionality is disabled (commented out) in the UI
```javascript
// Current (commented out):
{/* <MoveUpButton image={image} /> */}
{/* <MoveDownButton image={image} /> */}

// Should be enabled:
<MoveUpButton image={image} />
<MoveDownButton image={image} />
```

### ✅ Bug #12: Missing setIsLoading(false) in Delete Operation
**File:** `components/deleteButton.jsx:25`  
**Status:** FIXED  
**Priority:** Medium  
**Description:** Loading state not reset in delete function, causing UI to remain in loading state on failure
```javascript
// Current (missing setIsLoading):
const success = await deleteImage(id, storageId);
if (!success) {
    toast.error("File could not be deleted!");
    return; // Missing setIsLoading(false)
}

// Should be:
const success = await deleteImage(id, storageId);
if (!success) {
    toast.error("File could not be deleted!");
    setIsLoading(false);
    return;
}
```

### ✅ Bug #13: Missing setIsLoading(false) in Move Operations
**File:** `components/moveUpButton.jsx:16`  
**Status:** FIXED  
**Priority:** Low  
**Description:** Loading state never gets reset after move operation
```javascript
// Current (missing setIsLoading):
const handleMoveClick = async () => {
    setIsLoading(true);
    await moveUpImage(image);
    handleImageUpdate();
    // Missing setIsLoading(false)
}

// Should include:
setIsLoading(false);
```

### ✅ Bug #14: Debug Console.log Left in Production Code
**File:** `app/actions/moveUpImage.js:30`  
**Status:** FIXED  
**Priority:** Low  
**Description:** Debug console.log statement should be removed
```javascript
// Remove this line:
console.log(data)
```

### ✅ Bug #15: Inconsistent Error Messages (Still Exists)
**File:** `app/actions/moveDownImage.js:44-45`  
**Status:** FIXED  
**Priority:** Low  
**Description:** Error messages still say "Move Up Error" in moveDown function
```javascript
// Current (still incorrect):
console.log("Move Up Error: ", updateAboveError);
console.log("Move Up Error: ", updateThisError);

// Should be:
console.log("Move Down Error: ", updateAboveError);
console.log("Move Down Error: ", updateThisError);
```

## New Bugs Found (Second Re-Analysis)

### ✅ Bug #16: Dead Code in Slideshow Page
**File:** `app/slideshow/page.jsx:34-40`  
**Status:** FIXED  
**Priority:** Low  
**Description:** Commented out code that should be removed for cleaner codebase
```javascript
// Remove this commented code block:
/*
const imageData = await getAllImages();

const images = imageData.map(
    (image) => (image.url)
)
*/
```

### ✅ Bug #17: Client-Side Redirect in Navbar
**File:** `components/navbar.jsx:14`  
**Status:** FIXED  
**Priority:** Medium  
**Description:** Using server-side redirect in client component will cause error
```javascript
// Current (incorrect):
import { redirect } from 'next/navigation';
const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/login"); // This won't work in client component
}

// Should use:
window.location.href = '/login';
// or use router.push() from next/navigation
```

### ✅ Bug #18: Missing File Input Multiple Attribute
**File:** `components/ImageUploadCard.jsx:113`  
**Status:** FIXED  
**Priority:** Medium  
**Description:** File input doesn't allow multiple file selection but code handles multiple files
```javascript
// Current (single file only):
<input ... type="file" ... />

// Should be (to match multi-file handling logic):
<input ... type="file" multiple ... />
```

### ✅ Bug #19: Inconsistent Equality Operators
**File:** `app/slideshow/page.jsx:46`  
**Status:** FIXED  
**Priority:** Low  
**Description:** Using loose equality instead of strict equality
```javascript
// Current:
!images || images.length == 0

// Should be:
!images || images.length === 0
```

### ✅ Bug #20: Missing Error Handling in ImagesContext
**File:** `app/context/imagesContext.js:15-17`  
**Status:** FIXED  
**Priority:** Medium  
**Description:** handleImageUpdate has no error handling
```javascript
// Current (no error handling):
const handleImageUpdate = async () => {
    const data = await getAllImages();
    setImages(data);
}

// Should include error handling:
const handleImageUpdate = async () => {
    try {
        const data = await getAllImages();
        setImages(data || []);
    } catch (error) {
        console.error("Error updating images: ", error);
        setImages([]);
    }
}
```

## Latest Bugs Found (Third Deep Analysis)

### ✅ Bug #21: Inconsistent Equality in Move Operations
**Files:** `app/actions/moveUpImage.js:20`, `app/actions/moveDownImage.js:20`  
**Status:** FIXED  
**Priority:** Low  
**Description:** Using loose equality instead of strict equality in boundary checks
```javascript
// Current (inconsistent):
if (image.order_position == images[0].order_position) return false;
if (image.order_position == images[images.length - 1].order_position) return false;

// Should be:
if (image.order_position === images[0].order_position) return false;
if (image.order_position === images[images.length - 1].order_position) return false;
```

### ✅ Bug #22: Missing Database Transaction in Move Operations
**Files:** `app/actions/moveUpImage.js`, `app/actions/moveDownImage.js`  
**Status:** FIXED  
**Priority:** Medium  
**Description:** Move operations could leave database in inconsistent state if one update fails
```javascript
// Current: Two separate updates without transaction
const {error: updateAboveError} = await supabase...
const {error: updateThisError} = await supabase...

// Should use database transaction or implement rollback logic
```

### ✅ Bug #23: No Cleanup on Storage Upload Failure
**File:** `app/actions/uploadImage.js:22`  
**Status:** FIXED  
**Priority:** Medium  
**Description:** If storage upload fails, the loop continues without cleaning up previous successful uploads
```javascript
// Current: Early return leaves orphaned storage files
if (!storageSuccess) return false;

// Should clean up previously uploaded files in the loop
```

### ✅ Bug #24: Inconsistent Equality in Image Preview
**File:** `components/imagePreview.jsx:17`  
**Status:** FIXED  
**Priority:** Low  
**Description:** Using loose equality instead of strict equality
```javascript
// Current:
if (imagePreviewUrl != previousUrl) {

// Should be:
if (imagePreviewUrl !== previousUrl) {
```

### ✅ Bug #25: Hard-coded Supabase URL in Next.js Config
**File:** `next.config.mjs:12`  
**Status:** FIXED  
**Priority:** Medium  
**Description:** Supabase hostname is hard-coded, should use environment variable
```javascript
// Current (hard-coded):
hostname: "olspbesdefesqvhvbohi.supabase.co",

// Should be dynamic:
hostname: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '').split('.')[0] + '.supabase.co',
```

### ✅ Bug #26: Missing Revalidation in Move Operations  
**Files:** `app/actions/moveUpImage.js`, `app/actions/moveDownImage.js`  
**Status:** FIXED  
**Priority:** Low  
**Description:** Move operations don't revalidate paths like delete does
```javascript
// Missing after successful move:
revalidatePath("/slideshow");
```

### ✅ Bug #27: Order Position Gaps After Deletion
**File:** `app/actions/deleteImage.js`  
**Status:** FIXED  
**Priority:** Medium  
**Description:** Deleting images creates gaps in order_position sequence (1,2,4,5...)
```javascript
// After deletion, should compact order positions
// Current: No compaction logic
// Should add: Renumber remaining images to close gaps
```

---

## How to Use This Document

1. **Start with Critical Bugs** - Fix bugs #1-3 first as they cause immediate functionality issues
2. **Address Security Issues** - Fix bugs #4-5 to secure the application
3. **Handle Logic Issues** - Fix bugs #6-9 to improve user experience
4. **Clean up Minor Issues** - Fix bug #10 for consistency

Mark each bug as **Fixed** when completed and test thoroughly before moving to the next issue.