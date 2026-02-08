# Subscription Management System - Implementation Plan

## 1. Project Overview
A centralized web application for managing subscriptions, billing, products, and users. The system will handle the complete subscription lifecycle, from product configuration to invoicing and reporting.

## 2. Technology Stack
- **Framework**: Next.js (React) - For a robust, server-rendered full-stack application.
- **Language**: TypeScript - For type safety and better developer experience.
- **Database**: SQLite (via Prisma ORM) - Lightweight, serverless, and easy to set up for a self-contained application.
- **Styling**: Vanilla CSS (CSS Modules) - Custom, premium design with animations and glassmorphism effects (No Tailwind, as per standard protocol unless requested).
- **Authentication**: NextAuth.js (or custom JWT) - For secure Admin and User authentication.

## 3. Core Modules & Features
### Phase 1: Foundation & Setup
- [ ] Initialize Next.js project.
- [ ] Set up Prisma with SQLite.
- [ ] Configure global styles (CSS variables, typography, dark/light mode base).
- [ ] Implement robust Project Structure (components, lib, hooks).

### Phase 2: Authentication & User Roles
- [ ] Database Schema for Users (Admin, Internal, Customer).
- [ ] Login/Signup pages with validation.
- [ ] Role-based middleware/protection.

### Phase 3: Product & Plan Management
- [ ] Admin Dashboard layout.
- [ ] CRUD for Products and Variants.
- [ ] CRUD for Recurring Plans (billing period, price, etc.).

### Phase 4: Subscription Lifecycle
- [ ] Subscription creation wizard (Select Customer -> Plan -> Addons).
- [ ] Status workflow (Draft -> Active -> Cancelled).
- [ ] Auto-generation of Invoices.

### Phase 5: Billing & Payments
- [ ] Invoice management (View, Print, Send).
- [ ] Payment recording and status updates.
- [ ] Tax and Discount logic application.

### Phase 6: Reporting & Analytics
- [ ] Dashboard widgets (Active Subscriptions, Revenue, MRR).
- [ ] Data visualization (Charts/Graphs).

## 4. Design Aesthetics
- **Theme**: Premium, clean, trusted corporate SaaS look.
- **Palette**: Deep blues/purples for branding, clean whites/grays for content, subtle gradients.
- **Interactions**: Smooth transitions, hover effects on tables/cards, micro-interactions for buttons.

## 5. Next Steps
1. Initialize the Next.js application.
2. Install dependencies (Prisma, etc.).
3. Define the Database Schema.
