# 🎨 Toast Notification System - Complete Guide

## Overview

Your SubsERP application now has a **premium toast notification system** to replace ugly browser alerts with beautiful, animated notifications!

---

## ✨ **Features**

- ✅ **4 Types**: Success, Error, Warning, Info
- ✅ **Smooth Animations**: Slide-in, scale, fade effects
- ✅ **Auto-dismiss**: Configurable duration
- ✅ **Progress Bar**: Visual countdown
- ✅ **Manual Close**: X button
- ✅ **Multiple Toasts**: Stack notifications
- ✅ **Responsive**: Works on all devices
- ✅ **Premium Design**: Gradients, icons, shadows

---

## 🚀 **How to Use**

### **Step 1: Import the Hook**

```typescript
import { useToast } from '@/app/components/ToastProvider';
```

### **Step 2: Get Toast Functions**

```typescript
const toast = useToast();
```

### **Step 3: Show Notifications**

```typescript
// Success notification
toast.success('Product created successfully!');

// Error notification
toast.error('Failed to save changes');

// Warning notification
toast.warning('This action cannot be undone');

// Info notification
toast.info('New update available');
```

---

## 📝 **Complete Example**

### **In a Component:**

```typescript
'use client';

import { useState } from 'react';
import { useToast } from '@/app/components/ToastProvider';

export default function ProductPage() {
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'New Product' }),
            });

            if (response.ok) {
                toast.success('Product created successfully!');
            } else {
                toast.error('Failed to create product');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleSave}>
            Save Product
        </button>
    );
}
```

---

## 🎯 **All Toast Methods**

### **1. Success Toast**
```typescript
toast.success('Operation completed successfully!');
toast.success('Data saved!', 3000); // Custom duration (3 seconds)
```

**Use for:**
- Successful operations
- Data saved
- Items created/updated
- Actions completed

---

### **2. Error Toast**
```typescript
toast.error('Something went wrong!');
toast.error('Failed to delete item', 7000); // Show for 7 seconds
```

**Use for:**
- Failed operations
- Validation errors
- Server errors
- Permission denied

---

### **3. Warning Toast**
```typescript
toast.warning('This action cannot be undone');
toast.warning('Low storage space', 6000);
```

**Use for:**
- Caution messages
- Confirmations needed
- Resource limits
- Deprecation notices

---

### **4. Info Toast**
```typescript
toast.info('New features available!');
toast.info('Processing in background', 4000);
```

**Use for:**
- General information
- Tips and hints
- Status updates
- Feature announcements

---

## ⚙️ **Advanced Usage**

### **Custom Duration:**
```typescript
// Show for 10 seconds
toast.success('Important message', 10000);

// Show for 2 seconds (quick notification)
toast.info('Copied to clipboard', 2000);
```

### **Generic showToast:**
```typescript
toast.showToast('Custom message', 'success', 5000);
toast.showToast('Another message', 'error', 3000);
```

---

## 🎨 **Toast Types & Colors**

### **Success (Green)**
- Border: Green
- Background: White to light green gradient
- Icon: Checkmark in circle
- Use: Positive actions

### **Error (Red)**
- Border: Red
- Background: White to light red gradient
- Icon: X in circle
- Use: Failures and errors

### **Warning (Yellow)**
- Border: Yellow/Orange
- Background: White to light yellow gradient
- Icon: Triangle with exclamation
- Use: Cautions and warnings

### **Info (Blue)**
- Border: Blue
- Background: White to light blue gradient
- Icon: Info circle
- Use: General information

---

## 📍 **Real-World Examples**

### **Example 1: Form Submission**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
        toast.warning('Please enter a name');
        return;
    }
    
    try {
        const response = await fetch('/api/save', {
            method: 'POST',
            body: JSON.stringify(formData),
        });
        
        if (response.ok) {
            toast.success('Form submitted successfully!');
        } else {
            toast.error('Failed to submit form');
        }
    } catch (error) {
        toast.error('Network error occurred');
    }
};
```

---

### **Example 2: Delete Confirmation**
```typescript
const handleDelete = async (id: string) => {
    toast.warning('Deleting item...', 2000);
    
    try {
        await fetch(`/api/items/${id}`, { method: 'DELETE' });
        toast.success('Item deleted successfully!');
    } catch (error) {
        toast.error('Failed to delete item');
    }
};
```

---

### **Example 3: Copy to Clipboard**
```typescript
const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.info('Copied to clipboard!', 2000);
};
```

---

### **Example 4: Login Success**
```typescript
const handleLogin = async () => {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        
        if (response.ok) {
            toast.success('Welcome back!');
            router.push('/dashboard');
        } else {
            toast.error('Invalid credentials');
        }
    } catch (error) {
        toast.error('Login failed');
    }
};
```

---

## 🔄 **Replace Browser Alerts**

### **Before (Ugly):**
```typescript
alert('Product saved!'); // ❌ Ugly browser popup
```

### **After (Beautiful):**
```typescript
toast.success('Product saved!'); // ✅ Beautiful animated toast
```

---

## 📱 **Responsive Design**

The toast notifications automatically adapt to different screen sizes:

- **Desktop**: Top-right corner, fixed width
- **Tablet**: Top-right corner, responsive width
- **Mobile**: Full width at top, with margins

---

## 🎭 **Animation Details**

### **Entry Animation:**
- Slides in from right
- Bouncy cubic-bezier easing
- Icon scales in with delay
- Content fades in

### **Progress Bar:**
- Animates from full to empty
- Matches toast type color
- Smooth linear animation

### **Exit Animation:**
- Fades out when closed
- Removed from DOM after animation

---

## 🛠️ **Where to Use**

### **Dashboard Pages:**
```typescript
// products/page.tsx
const toast = useToast();

const createProduct = () => {
    toast.success('Product created!');
};
```

### **Forms:**
```typescript
// Any form component
const toast = useToast();

const handleSubmit = () => {
    toast.success('Form submitted!');
};
```

### **API Calls:**
```typescript
// Any API interaction
const toast = useToast();

try {
    await api.call();
    toast.success('Success!');
} catch {
    toast.error('Failed!');
}
```

---

## ✅ **Best Practices**

### **1. Keep Messages Short**
```typescript
// ✅ Good
toast.success('Saved!');
toast.error('Failed to save');

// ❌ Too long
toast.success('Your product has been successfully saved to the database and is now available for customers to purchase!');
```

### **2. Use Appropriate Types**
```typescript
// ✅ Good
toast.success('Product created');  // For success
toast.error('Invalid email');      // For errors
toast.warning('Unsaved changes');  // For warnings
toast.info('Tip: Use shortcuts'); // For info

// ❌ Wrong type
toast.success('Error occurred');   // Don't use success for errors
```

### **3. Set Appropriate Duration**
```typescript
// ✅ Good
toast.success('Saved!', 3000);           // Quick action
toast.error('Server error', 7000);       // Important error
toast.info('Copied!', 2000);             // Very quick

// ❌ Too short/long
toast.error('Critical error', 1000);     // Too short for important message
toast.info('Hello', 30000);              // Too long for simple info
```

---

## 🎨 **Customization**

The toast styles are in `Toast.module.css`. You can customize:

- Colors
- Sizes
- Animations
- Durations
- Positions

---

## 📊 **Summary**

**Component:** `Toast.tsx`  
**Provider:** `ToastProvider.tsx`  
**Styles:** `Toast.module.css`  
**Hook:** `useToast()`  

**Methods:**
- `toast.success(message, duration?)`
- `toast.error(message, duration?)`
- `toast.warning(message, duration?)`
- `toast.info(message, duration?)`

---

## 🎉 **Try It Now!**

Add this to any page:

```typescript
'use client';

import { useToast } from '@/app/components/ToastProvider';

export default function TestPage() {
    const toast = useToast();

    return (
        <div>
            <button onClick={() => toast.success('Success!')}>
                Show Success
            </button>
            <button onClick={() => toast.error('Error!')}>
                Show Error
            </button>
            <button onClick={() => toast.warning('Warning!')}>
                Show Warning
            </button>
            <button onClick={() => toast.info('Info!')}>
                Show Info
            </button>
        </div>
    );
}
```

---

**No more ugly browser alerts! 🎉**

**Use beautiful, animated toast notifications instead!** ✨
