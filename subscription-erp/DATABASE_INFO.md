# 🗄️ Database Configuration - SubsERP

## Database Information

Your SubsERP application is using **SQLite** database for local development.

---

## 📊 **Current Database**

### **Database Type:**
**SQLite** (File-based database)

### **Database Location:**
```
a:\Subscription Management System\subscription-erp\prisma\dev.db
```

### **Connection String:**
```
DATABASE_URL="file:./dev.db"
```

### **Configuration File:**
```
.env (in project root)
```

---

## 🎯 **Why SQLite?**

### **Advantages:**
- ✅ **No installation required** - Works out of the box
- ✅ **Zero configuration** - Just a file
- ✅ **Perfect for development** - Fast and simple
- ✅ **Portable** - Single file contains everything
- ✅ **No server needed** - File-based
- ✅ **Easy backup** - Just copy the .db file

### **Perfect For:**
- Development and testing
- Small to medium applications
- Prototyping
- Local development
- Single-user applications

---

## 📁 **Database File Location**

```
Project Root
└── prisma/
    ├── dev.db          ← Your database file
    ├── dev.db-journal  ← SQLite journal file
    └── schema.prisma   ← Database schema definition
```

**Full Path:**
```
a:\Subscription Management System\subscription-erp\prisma\dev.db
```

---

## 🔧 **Database Schema**

### **Defined In:**
```
prisma/schema.prisma
```

### **Provider:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### **Tables Created:**
Your database contains tables for:
- ✅ Users (Admin, Internal, Customer)
- ✅ Products
- ✅ Subscriptions
- ✅ Invoices
- ✅ Payments
- ✅ Discounts
- ✅ Taxes
- ✅ Recurring Plans
- ✅ Quotations
- ✅ And more...

---

## 🛠️ **Database Tools**

### **Prisma Studio** (Database GUI)
**Currently Running!** 🎉

You have Prisma Studio running in your terminal. This is a visual database browser.

**Access it at:**
```
http://localhost:5555
```

**What you can do:**
- ✅ View all tables
- ✅ Browse data
- ✅ Edit records
- ✅ Add new records
- ✅ Delete records
- ✅ Search and filter

**To open:**
1. Go to `http://localhost:5555` in your browser
2. Click on any table to view data
3. See your admin user, products, etc.

---

## 📝 **Environment Variables**

### **Current Configuration (.env):**
```env
DATABASE_URL="file:./dev.db"
RESEND_API_KEY=re_your_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Database URL Breakdown:**
- `file:` - SQLite file protocol
- `./dev.db` - Relative path to database file
- Resolves to: `prisma/dev.db`

---

## 🔍 **View Your Data**

### **Option 1: Prisma Studio (Recommended)**
```bash
npx prisma studio
```
Then open: `http://localhost:5555`

### **Option 2: SQLite Browser**
Download: https://sqlitebrowser.org/
Open file: `prisma/dev.db`

### **Option 3: Command Line**
```bash
sqlite3 prisma/dev.db
```

---

## 🗂️ **Database Management**

### **View Schema:**
```bash
npx prisma studio
```

### **Reset Database:**
```bash
npx prisma db push --force-reset
```

### **Seed Database:**
```bash
npm run db:seed
```

### **Generate Prisma Client:**
```bash
npx prisma generate
```

### **View Migrations:**
```bash
npx prisma migrate status
```

---

## 💾 **Backup Your Database**

### **Simple Backup:**
Just copy the database file:
```
Copy: prisma/dev.db
To: prisma/dev.db.backup
```

### **Automated Backup Script:**
```bash
# Windows
copy prisma\dev.db prisma\dev.db.backup

# Or with timestamp
copy prisma\dev.db prisma\dev.db.%date:~-4,4%%date:~-10,2%%date:~-7,2%
```

---

## 🔄 **Database Migrations**

### **Current Approach:**
You're using `db push` (schema sync) instead of migrations.

### **Schema Changes:**
When you modify `schema.prisma`:
```bash
npx prisma db push
```

This will:
1. Update the database schema
2. Regenerate Prisma Client
3. Apply changes immediately

---

## 📊 **Current Data**

### **Users:**
- ✅ Admin user (admin@erp.com)
- ✅ Internal user (internal@erp.com)
- ✅ Customer user (customer@example.com)

### **Sample Data:**
- ✅ 3 Products
- ✅ 2 Recurring Plans
- ✅ 2 Tax Rates

**View in Prisma Studio:**
```
http://localhost:5555
```

---

## 🚀 **For Production**

### **Recommended Databases:**
When you deploy to production, consider:

1. **PostgreSQL** (Recommended)
   - Robust and scalable
   - Free tier: Supabase, Neon, Railway
   - Best for production

2. **MySQL**
   - Popular and reliable
   - Free tier: PlanetScale

3. **MongoDB**
   - NoSQL option
   - Free tier: MongoDB Atlas

### **Migration Path:**
```prisma
// Change in schema.prisma
datasource db {
  provider = "postgresql"  // Change from sqlite
  url      = env("DATABASE_URL")
}
```

Then update `.env`:
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
```

---

## 🔐 **Database Security**

### **Current Setup:**
- ✅ Local file-based database
- ✅ No network exposure
- ✅ File system permissions
- ✅ Passwords hashed with bcrypt

### **For Production:**
- Use environment variables
- Enable SSL connections
- Use strong database passwords
- Restrict network access
- Regular backups

---

## 📈 **Database Size**

### **Current:**
Check file size:
```bash
# Windows PowerShell
Get-Item prisma\dev.db | Select-Object Name, Length
```

### **SQLite Limits:**
- Max database size: 281 TB
- Max table size: 281 TB
- Max row size: 1 GB
- Plenty for development!

---

## 🛠️ **Troubleshooting**

### **Database Locked:**
If you get "database is locked" error:
1. Close Prisma Studio
2. Stop dev server
3. Restart dev server
4. Reopen Prisma Studio

### **Schema Out of Sync:**
```bash
npx prisma db push
npx prisma generate
```

### **Corrupt Database:**
```bash
npx prisma db push --force-reset
npm run db:seed
```

---

## 📚 **Useful Commands**

```bash
# View database in browser
npx prisma studio

# Update database schema
npx prisma db push

# Regenerate Prisma Client
npx prisma generate

# Seed database
npm run db:seed

# Format schema file
npx prisma format

# Validate schema
npx prisma validate
```

---

## 🎯 **Quick Access**

### **Database File:**
```
a:\Subscription Management System\subscription-erp\prisma\dev.db
```

### **Prisma Studio:**
```
http://localhost:5555
```

### **Schema File:**
```
a:\Subscription Management System\subscription-erp\prisma\schema.prisma
```

### **Environment Config:**
```
a:\Subscription Management System\subscription-erp\.env
```

---

## ✅ **Summary**

**Database Type:** SQLite  
**Location:** `prisma/dev.db`  
**Size:** Small (few KB/MB)  
**Status:** ✅ Working  
**Data:** ✅ Seeded  
**Admin User:** ✅ Created  

**Access your data:**
- **Prisma Studio:** http://localhost:5555
- **File:** `prisma/dev.db`

---

**Your database is set up and working perfectly!** 🎉

**View your data at: http://localhost:5555** 📊
