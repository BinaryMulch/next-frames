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

### 🛡️ Bug #4: Authentication Bypassed in getAllImages
**File:** `app/actions/getAllImages.js:10-17`  
**Status:** Not Fixed  
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

### 🛡️ Bug #5: Missing Error Handling in getAllImages
**File:** `app/actions/getAllImages.js:20-22`  
**Status:** Not Fixed  
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

### 🐛 Bug #6: No Success/Failure Feedback in Image Upload
**File:** `components/ImageUploadCard.jsx:40, 60`  
**Status:** Not Fixed  
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

### 🐛 Bug #7: Missing File Type Validation
**File:** `components/ImageUploadCard.jsx`  
**Status:** Not Fixed  
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

### 🐛 Bug #8: Race Condition in Image Reordering
**Files:** `app/actions/moveUpImage.js`, `app/actions/moveDownImage.js`  
**Status:** Not Fixed  
**Priority:** Medium  
**Description:** Simultaneous move operations could create duplicate order_position values

**Suggested fix:** Add database transaction or locking mechanism

### 🐛 Bug #9: Carousel Index Bounds Risk
**File:** `components/carousel.jsx:33-36`  
**Status:** Not Fixed  
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

### 🐛 Bug #11: Move Up/Down Buttons Commented Out
**File:** `components/imageCard.jsx:16-17`  
**Status:** Not Fixed  
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

### 🐛 Bug #12: Missing setIsLoading(false) in Delete Operation
**File:** `components/deleteButton.jsx:25`  
**Status:** Not Fixed  
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

### 🐛 Bug #13: Missing setIsLoading(false) in Move Operations
**File:** `components/moveUpButton.jsx:16`  
**Status:** Not Fixed  
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

### 🐛 Bug #14: Debug Console.log Left in Production Code
**File:** `app/actions/moveUpImage.js:30`  
**Status:** Not Fixed  
**Priority:** Low  
**Description:** Debug console.log statement should be removed
```javascript
// Remove this line:
console.log(data)
```

### 🐛 Bug #15: Inconsistent Error Messages (Still Exists)
**File:** `app/actions/moveDownImage.js:44-45`  
**Status:** Not Fixed  
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

---

## How to Use This Document

1. **Start with Critical Bugs** - Fix bugs #1-3 first as they cause immediate functionality issues
2. **Address Security Issues** - Fix bugs #4-5 to secure the application
3. **Handle Logic Issues** - Fix bugs #6-9 to improve user experience
4. **Clean up Minor Issues** - Fix bug #10 for consistency

Mark each bug as **Fixed** when completed and test thoroughly before moving to the next issue.