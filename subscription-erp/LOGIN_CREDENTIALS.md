# 🔐 Login Credentials - SubsERP

## Demo Accounts

Your SubsERP application has 3 pre-configured demo accounts for testing different user roles.

---

## 👨‍💼 Administrator Account

### **Full System Access**

**Email:** `admin@erp.com`  
**Password:** `Admin@123`

### Access Level:
- ✅ Full dashboard access
- ✅ Manage all users
- ✅ Manage products
- ✅ Manage subscriptions
- ✅ Manage customers
- ✅ Manage invoices
- ✅ Manage payments
- ✅ Manage discounts
- ✅ View all reports
- ✅ System settings

### Use This Account For:
- Administrative tasks
- Full system management
- Creating other users
- Viewing all data
- Testing admin features

---

## 👤 Internal User Account

### **Limited Admin Access**

**Email:** `internal@erp.com`  
**Password:** `Internal@123`

### Access Level:
- ✅ Dashboard access
- ✅ Manage customers
- ✅ Manage subscriptions
- ✅ View invoices
- ✅ View payments
- ❌ Cannot manage users
- ❌ Limited system settings

### Use This Account For:
- Customer support tasks
- Subscription management
- Invoice viewing
- Testing internal user features

---

## 👥 Customer Account

### **Customer Portal Access**

**Email:** `customer@example.com`  
**Password:** `Customer@123`

### Access Level:
- ✅ View own subscriptions
- ✅ View own invoices
- ✅ View own payments
- ✅ Update profile
- ❌ Cannot access admin features
- ❌ Cannot view other customers

### Use This Account For:
- Testing customer experience
- Customer portal features
- Self-service functions

---

## 🚀 How to Login

### Step 1: Go to Login Page
Navigate to: `http://localhost:3000/login`

### Step 2: Choose Account
Use one of the credentials above based on what you want to test

### Step 3: Enter Credentials
**For Administrator:**
```
Email: admin@erp.com
Password: Admin@123
```

### Step 4: Click Login
You'll be redirected to the dashboard

---

## 🎯 Quick Login Feature

The login page has **Quick Login** buttons for instant access:

### On Login Page:
1. Look for "Quick Login" section
2. Click one of the three buttons:
   - 👨‍💼 **Admin** - Full access
   - 👤 **Internal User** - Limited access
   - 👥 **Customer** - Customer view
3. Automatically logged in!

---

## 📝 All Credentials Summary

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | admin@erp.com | Admin@123 | Full |
| **Internal** | internal@erp.com | Internal@123 | Limited |
| **Customer** | customer@example.com | Customer@123 | Customer |

---

## 🔐 Password Requirements

If you want to change passwords or create new accounts:
- Minimum 8 characters
- Mix of letters and numbers recommended
- Case-sensitive

---

## 🐛 Troubleshooting

### Issue: "Invalid credentials"
**Solutions:**
1. Check email is exactly: `admin@erp.com`
2. Check password is exactly: `Admin@123`
3. Password is case-sensitive (capital A)
4. No extra spaces

### Issue: "User not found"
**Solution:** Run database seed:
```bash
npm run db:seed
```

### Issue: "Cannot access dashboard"
**Solution:**
1. Clear browser cache
2. Hard refresh: `Ctrl + Shift + R`
3. Try incognito mode
4. Check console for errors

---

## 🎨 Login Page Features

### Quick Login Buttons
- **Admin Button**: Orange icon, instant admin access
- **Internal Button**: Blue icon, instant internal access
- **Customer Button**: Green icon, instant customer access

### Manual Login
- Email input with icon
- Password input with show/hide toggle
- Remember me checkbox
- Forgot password link

---

## ✅ Testing Checklist

### Test Admin Account:
- [ ] Login with admin@erp.com
- [ ] See full dashboard
- [ ] Access all menu items
- [ ] Create/edit products
- [ ] Manage users
- [ ] View reports

### Test Internal Account:
- [ ] Login with internal@erp.com
- [ ] See limited dashboard
- [ ] Access customer management
- [ ] Cannot access user management

### Test Customer Account:
- [ ] Login with customer@example.com
- [ ] See customer portal
- [ ] View own subscriptions
- [ ] Cannot access admin features

---

## 🔄 Creating New Accounts

### Via Signup Page:
1. Go to `localhost:3000/signup`
2. Fill in details
3. New account created with CUSTOMER role

### Via Admin Panel:
1. Login as admin
2. Go to Users section
3. Click "Add User"
4. Choose role (ADMIN, INTERNAL_USER, CUSTOMER)
5. Set password
6. Save

---

## 💡 Pro Tips

### For Development:
- Use **Quick Login** buttons for fast testing
- Keep admin credentials handy
- Test all three roles regularly

### For Demos:
- Start with admin account to show full features
- Switch to customer account to show customer view
- Use internal account for support scenarios

### Security:
- Change default passwords in production
- Use strong passwords
- Enable 2FA (if implemented)

---

## 📧 Password Reset

If you forget a password:

1. Go to `localhost:3000/forgot-password`
2. Enter email address
3. Check console for reset link (dev mode)
4. Click link to reset password

**Note:** Email service must be configured for production use.

---

## 🎉 Quick Start

**Want to login right now?**

1. **Go to:** `http://localhost:3000/login`
2. **Click:** "Admin" quick login button
3. **Or enter:**
   - Email: `admin@erp.com`
   - Password: `Admin@123`
4. **Click:** "Sign In"
5. **Done!** You're in the dashboard 🚀

---

## 📱 Mobile Login

All accounts work on mobile devices:
- Responsive login page
- Touch-friendly buttons
- Mobile-optimized dashboard

---

## 🔗 Useful Links

- **Login Page**: http://localhost:3000/login
- **Signup Page**: http://localhost:3000/signup
- **Forgot Password**: http://localhost:3000/forgot-password
- **Dashboard**: http://localhost:3000/dashboard

---

## ✨ Remember

**Default Admin Credentials:**
```
Email: admin@erp.com
Password: Admin@123
```

**These credentials are for development/testing only!**  
Change them in production for security.

---

**Happy Testing!** 🎉

Use the admin account to explore all features of your SubsERP system!
