# 🚀 Subscription Management ERP

A comprehensive, production-ready ERP system for managing subscription-based businesses. Built with Next.js, TypeScript, Prisma, and SQLite.

## ✨ Features

### Core Modules
- **👥 User Management** - Role-based access control (Admin, Internal User, Customer)
- **📦 Product Management** - Products with variants and flexible pricing
- **🔄 Recurring Plans** - Daily, Weekly, Monthly, and Yearly billing cycles
- **📋 Subscriptions** - Complete lifecycle management (Draft → Active → Closed)
- **💰 Invoicing** - Automated invoice generation with taxes and discounts
- **💳 Payments** - Multiple payment methods and tracking
- **🏷️ Discounts** - Flexible discount rules (Fixed/Percentage)
- **📊 Tax Management** - Configurable tax rates and types
- **📄 Quotation Templates** - Reusable subscription templates
- **📈 Reports & Analytics** - Revenue, subscriptions, and payment tracking

### Key Capabilities
- ✅ **Role-Based Access Control** - Admin, Internal User, and Customer roles
- ✅ **Automated Billing** - Recurring invoice generation
- ✅ **Status Workflows** - Subscription and invoice state management
- ✅ **Tax & Discount Engine** - Automatic calculation and application
- ✅ **Audit Trail** - Track who created/modified records
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Enhanced UX** - Animated dialogs and toast notifications for seamless interaction

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT + bcrypt
- **Styling**: Vanilla CSS (Premium design system)
- **UI**: React 19

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with sample data
npm run db:seed
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Default Login Credentials

After seeding, you can log in with:

### Admin Account
- **Email**: `admin@erp.com`
- **Password**: `Admin@123`
- **Access**: Full system control

### Internal User Account
- **Email**: `internal@erp.com`
- **Password**: `Internal@123`
- **Access**: Limited operational access

### Customer Account
- **Email**: `customer@example.com`
- **Password**: `Customer@123`
- **Access**: Customer portal

## 📁 Project Structure

```
subscription-erp/
├── app/
│   ├── lib/                 # Utilities and helpers
│   │   ├── prisma.ts       # Database client
│   │   └── auth.ts         # Authentication utilities
│   ├── api/                # API routes
│   ├── (auth)/             # Authentication pages
│   ├── dashboard/          # Main application
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.ts             # Database seeder
│   └── migrations/         # Database migrations
└── public/                 # Static assets
```

## 🗄️ Database Schema

### Core Entities
- **User** - System users with role-based access
- **Customer** - Extended user profile for customers
- **Product** - Products and services
- **ProductVariant** - Product variations (size, brand, etc.)
- **RecurringPlan** - Billing plans and cycles
- **Subscription** - Customer subscriptions
- **Invoice** - Generated invoices
- **Payment** - Payment records
- **Tax** - Tax rules and rates
- **Discount** - Discount campaigns
- **QuotationTemplate** - Reusable subscription templates

### Relationships
- Users can have multiple subscriptions
- Subscriptions generate invoices
- Invoices can have multiple payments
- Products can have variants, taxes, and discounts
- Subscriptions follow recurring plans

## 🎨 Design System

The application uses a premium SaaS design system with:
- **Color Palette**: Professional blues and purples
- **Typography**: Inter font family
- **Components**: Cards, buttons, forms, tables, badges
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first approach

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Password Validation**: Enforced complexity rules
- **Role-Based Access**: Granular permissions
- **SQL Injection Protection**: Prisma ORM parameterized queries

## 📊 Business Logic

### Subscription Workflow
1. **Draft** - Initial creation
2. **Quotation** - Sent to customer
3. **Confirmed** - Customer accepted
4. **Active** - Currently running
5. **Closed** - Completed or cancelled

### Invoice Workflow
1. **Draft** - Generated from subscription
2. **Confirmed** - Ready for payment
3. **Paid** - Payment received
4. **Cancelled** - Voided

### Payment Terms
- Immediate
- Net 15, 30, 45, 60 days
- End of month

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-in-production"
```

## 🚢 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Database Migration
```bash
npx prisma migrate deploy
```

## 📚 API Documentation

The application provides REST API endpoints for all modules:

- `POST /api/auth/login` - User authentication
- `POST /api/auth/signup` - User registration
- `GET /api/products` - List products
- `POST /api/subscriptions` - Create subscription
- `GET /api/invoices` - List invoices
- And more...

## 🤝 Contributing

This is a hackathon/demo project. Feel free to fork and customize for your needs.

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🎯 Hackathon Notes

This project demonstrates:
- **Real-world ERP workflow** - Complete subscription business lifecycle
- **Business logic focus** - Not just UI, but operational problem-solving
- **Industry-ready thinking** - Modular, scalable system design
- **Production patterns** - Authentication, validation, error handling

## 🐛 Known Limitations

- SQLite is used for simplicity (consider PostgreSQL for production)
- Email notifications not implemented
- Payment gateway integration not included
- Advanced reporting/analytics pending

## 📞 Support

For questions or issues, please create an issue in the repository.

---

**Built with ❤️ for the Subscription Management Hackathon**
