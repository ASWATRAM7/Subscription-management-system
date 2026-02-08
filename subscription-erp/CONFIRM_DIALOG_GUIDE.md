# 🎭 Animated Confirmation Dialog - Complete Guide

## Overview

Replace ugly browser `confirm()` dialogs with beautiful, animated confirmation modals!

---

## ✨ **Features**

- ✅ **Beautiful Design**: Gradient backgrounds, icons, shadows
- ✅ **Smooth Animations**: Slide-up, scale, fade, pulse effects
- ✅ **3 Variants**: Danger (red), Primary (blue), Success (green)
- ✅ **Promise-based API**: Easy async/await usage
- ✅ **Backdrop Blur**: Premium glassmorphism effect
- ✅ **Responsive**: Works on all devices
- ✅ **Keyboard Support**: ESC to cancel
- ✅ **Click Outside**: Click backdrop to cancel

---

## 🚀 **How to Use**

### **Step 1: Import the Hook**

```typescript
import { useConfirm } from '@/app/components/ConfirmProvider';
```

### **Step 2: Get Confirm Function**

```typescript
const { confirm } = useConfirm();
```

### **Step 3: Use in Your Code**

```typescript
const handleDelete = async () => {
    const confirmed = await confirm({
        title: 'Delete User',
        message: 'Are you sure you want to delete this user? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger',
    });

    if (confirmed) {
        // User clicked "Delete"
        await deleteUser();
    } else {
        // User clicked "Cancel" or closed dialog
        console.log('Cancelled');
    }
};
```

---

## 📝 **Complete Example - Replace Browser Confirm**

### **Before (Ugly Browser Confirm):**

```typescript
const handleDelete = async (id: string) => {
    // ❌ Ugly browser dialog
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        await fetch(`/api/users/${id}`, { method: 'DELETE' });
    }
};
```

### **After (Beautiful Animated Dialog):**

```typescript
'use client';

import { useConfirm } from '@/app/components/ConfirmProvider';
import { useToast } from '@/app/components/ToastProvider';

export default function UsersPage() {
    const { confirm } = useConfirm();
    const toast = useToast();

    const handleDelete = async (id: string) => {
        // ✅ Beautiful animated dialog
        const confirmed = await confirm({
            title: 'Delete User',
            message: 'Are you sure you want to delete this user? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger',
        });

        if (confirmed) {
            try {
                await fetch(`/api/users/${id}`, { method: 'DELETE' });
                toast.success('User deleted successfully!');
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    return (
        <button onClick={() => handleDelete('user-123')}>
            Delete User
        </button>
    );
}
```

---

## 🎨 **Dialog Variants**

### **1. Danger (Red) - For Destructive Actions**

```typescript
const confirmed = await confirm({
    title: 'Delete Item',
    message: 'This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger', // Red theme
});
```

**Use for:**
- Delete operations
- Permanent changes
- Data loss warnings
- Account deactivation

**Visual:**
- Red icon background
- Red confirm button
- Warning triangle icon

---

### **2. Primary (Blue) - For Important Actions**

```typescript
const confirmed = await confirm({
    title: 'Save Changes',
    message: 'Do you want to save your changes?',
    confirmText: 'Save',
    cancelText: 'Discard',
    variant: 'primary', // Blue theme
});
```

**Use for:**
- Save confirmations
- Important decisions
- General confirmations
- Navigation warnings

**Visual:**
- Blue icon background
- Blue confirm button
- Info circle icon

---

### **3. Success (Green) - For Positive Actions**

```typescript
const confirmed = await confirm({
    title: 'Activate User',
    message: 'Activate this user account?',
    confirmText: 'Activate',
    cancelText: 'Cancel',
    variant: 'success', // Green theme
});
```

**Use for:**
- Activation confirmations
- Approval actions
- Positive changes
- Enable features

**Visual:**
- Green icon background
- Green confirm button
- Checkmark icon

---

## 📍 **Real-World Examples**

### **Example 1: Delete User**

```typescript
const handleDelete = async (userId: string) => {
    const confirmed = await confirm({
        title: 'Delete User',
        message: 'Are you sure you want to delete this user? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger',
    });

    if (confirmed) {
        await deleteUser(userId);
        toast.success('User deleted!');
    }
};
```

---

### **Example 2: Deactivate Account**

```typescript
const handleDeactivate = async (userId: string) => {
    const confirmed = await confirm({
        title: 'Deactivate Account',
        message: 'The user will no longer be able to access the system.',
        confirmText: 'Deactivate',
        cancelText: 'Cancel',
        variant: 'danger',
    });

    if (confirmed) {
        await deactivateUser(userId);
        toast.success('Account deactivated!');
    }
};
```

---

### **Example 3: Unsaved Changes**

```typescript
const handleNavigate = async () => {
    if (hasUnsavedChanges) {
        const confirmed = await confirm({
            title: 'Unsaved Changes',
            message: 'You have unsaved changes. Do you want to leave without saving?',
            confirmText: 'Leave',
            cancelText: 'Stay',
            variant: 'primary',
        });

        if (confirmed) {
            router.push('/dashboard');
        }
    }
};
```

---

### **Example 4: Activate User**

```typescript
const handleActivate = async (userId: string) => {
    const confirmed = await confirm({
        title: 'Activate User',
        message: 'This user will gain access to the system.',
        confirmText: 'Activate',
        cancelText: 'Cancel',
        variant: 'success',
    });

    if (confirmed) {
        await activateUser(userId);
        toast.success('User activated!');
    }
};
```

---

## 🎭 **Animation Details**

### **Entry Animations:**
1. **Backdrop**: Fades in (0.3s)
2. **Dialog**: Slides up + scales (0.4s, bouncy)
3. **Icon**: Scales in + rotates (0.5s, delayed)
4. **Title**: Fades up (0.5s, delayed)
5. **Message**: Fades up (0.5s, delayed)
6. **Buttons**: Fade up (0.5s, delayed)

### **Icon Animation:**
- Continuous pulse effect (2s loop)
- Subtle scale animation

### **Button Hover:**
- Lift up effect
- Shadow increase
- Smooth transition

---

## ⚙️ **API Reference**

### **confirm() Options:**

```typescript
interface ConfirmOptions {
    title: string;           // Dialog title
    message: string;         // Dialog message
    confirmText?: string;    // Confirm button text (default: "Confirm")
    cancelText?: string;     // Cancel button text (default: "Cancel")
    variant?: 'danger' | 'primary' | 'success'; // Theme (default: "primary")
}
```

### **Return Value:**

```typescript
Promise<boolean>
// true  = User clicked confirm button
// false = User clicked cancel or closed dialog
```

---

## 🎯 **Usage Patterns**

### **Pattern 1: Simple Confirmation**

```typescript
if (await confirm({ title: 'Confirm', message: 'Are you sure?' })) {
    // Do something
}
```

---

### **Pattern 2: With Toast Feedback**

```typescript
const confirmed = await confirm({
    title: 'Delete Item',
    message: 'This cannot be undone.',
    variant: 'danger',
});

if (confirmed) {
    await deleteItem();
    toast.success('Deleted!');
} else {
    toast.info('Cancelled');
}
```

---

### **Pattern 3: Try-Catch with Confirmation**

```typescript
const confirmed = await confirm({
    title: 'Save Changes',
    message: 'Save your changes?',
    variant: 'primary',
});

if (confirmed) {
    try {
        await saveChanges();
        toast.success('Saved!');
    } catch (error) {
        toast.error('Failed to save');
    }
}
```

---

## 📱 **Responsive Behavior**

### **Desktop:**
- Centered dialog
- Fixed width (480px max)
- Buttons side-by-side

### **Mobile:**
- Full-width dialog (90%)
- Smaller icon
- Buttons stacked vertically
- Cancel button on top

---

## ✅ **Best Practices**

### **1. Use Appropriate Variants**

```typescript
// ✅ Good
await confirm({ variant: 'danger' });  // For delete
await confirm({ variant: 'primary' }); // For save
await confirm({ variant: 'success' }); // For activate

// ❌ Wrong
await confirm({ variant: 'success' }); // For delete
```

---

### **2. Clear, Concise Messages**

```typescript
// ✅ Good
title: 'Delete User'
message: 'This action cannot be undone.'

// ❌ Too verbose
title: 'User Deletion Confirmation Dialog'
message: 'Please confirm that you would like to proceed with the deletion of this user account...'
```

---

### **3. Action-Oriented Button Text**

```typescript
// ✅ Good
confirmText: 'Delete'
confirmText: 'Save'
confirmText: 'Activate'

// ❌ Generic
confirmText: 'OK'
confirmText: 'Yes'
```

---

## 🔄 **Migration Guide**

### **Find and Replace:**

**Old:**
```typescript
if (confirm('Delete this item?')) {
    // delete
}
```

**New:**
```typescript
const { confirm } = useConfirm();

if (await confirm({
    title: 'Delete Item',
    message: 'Are you sure?',
    variant: 'danger',
})) {
    // delete
}
```

---

## 📊 **Summary**

**Component:** `ConfirmDialog.tsx`  
**Provider:** `ConfirmProvider.tsx`  
**Styles:** `ConfirmDialog.module.css`  
**Hook:** `useConfirm()`  

**Variants:**
- `danger` - Red (delete, destructive)
- `primary` - Blue (general, important)
- `success` - Green (activate, positive)

**Returns:** `Promise<boolean>`

---

## 🎉 **Quick Start**

```typescript
'use client';

import { useConfirm } from '@/app/components/ConfirmProvider';

export default function MyPage() {
    const { confirm } = useConfirm();

    const handleAction = async () => {
        const confirmed = await confirm({
            title: 'Confirm Action',
            message: 'Are you sure?',
            variant: 'danger',
        });

        if (confirmed) {
            console.log('Confirmed!');
        }
    };

    return <button onClick={handleAction}>Click Me</button>;
}
```

---

**No more ugly browser confirm() dialogs!** 🎉

**Use beautiful, animated confirmation dialogs instead!** ✨
