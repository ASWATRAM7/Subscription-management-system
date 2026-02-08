import { PrismaClient, UserRole, ProductType, BillingPeriod, TaxType, DiscountType, SubscriptionStatus, InvoiceStatus, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database with comprehensive data...\n');

    // ============================================
    // USERS
    // ============================================
    console.log('👥 Creating users...');

    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@erp.com' },
        update: {},
        create: {
            email: 'admin@erp.com',
            password: adminPassword,
            firstName: 'System',
            lastName: 'Administrator',
            role: UserRole.ADMIN,
            isActive: true,
        },
    });
    console.log('✅ Admin user created');

    const internalPassword = await bcrypt.hash('Internal@123', 10);
    const internalUser = await prisma.user.upsert({
        where: { email: 'internal@erp.com' },
        update: {},
        create: {
            email: 'internal@erp.com',
            password: internalPassword,
            firstName: 'Sarah',
            lastName: 'Johnson',
            role: UserRole.INTERNAL_USER,
            isActive: true,
            createdBy: admin.id,
        },
    });
    console.log('✅ Internal user created');

    const customerPassword = await bcrypt.hash('Customer@123', 10);
    const customers = await Promise.all([
        prisma.user.upsert({
            where: { email: 'john.doe@acme.com' },
            update: {},
            create: {
                email: 'john.doe@acme.com',
                password: customerPassword,
                firstName: 'John',
                lastName: 'Doe',
                role: UserRole.CUSTOMER,
                isActive: true,
            },
        }),
        prisma.user.upsert({
            where: { email: 'jane.smith@techcorp.com' },
            update: {},
            create: {
                email: 'jane.smith@techcorp.com',
                password: customerPassword,
                firstName: 'Jane',
                lastName: 'Smith',
                role: UserRole.CUSTOMER,
                isActive: true,
            },
        }),
        prisma.user.upsert({
            where: { email: 'mike.wilson@startup.io' },
            update: {},
            create: {
                email: 'mike.wilson@startup.io',
                password: customerPassword,
                firstName: 'Mike',
                lastName: 'Wilson',
                role: UserRole.CUSTOMER,
                isActive: true,
            },
        }),
        prisma.user.upsert({
            where: { email: 'emily.brown@enterprise.com' },
            update: {},
            create: {
                email: 'emily.brown@enterprise.com',
                password: customerPassword,
                firstName: 'Emily',
                lastName: 'Brown',
                role: UserRole.CUSTOMER,
                isActive: true,
            },
        }),
        prisma.user.upsert({
            where: { email: 'david.lee@solutions.net' },
            update: {},
            create: {
                email: 'david.lee@solutions.net',
                password: customerPassword,
                firstName: 'David',
                lastName: 'Lee',
                role: UserRole.CUSTOMER,
                isActive: true,
            },
        }),
    ]);
    console.log(`✅ Created ${customers.length} customer users`);

    // ============================================
    // PRODUCTS
    // ============================================
    console.log('\n📦 Creating products...');

    const products = await Promise.all([
        prisma.product.upsert({
            where: { id: 'prod-cloud-storage' },
            update: {},
            create: {
                id: 'prod-cloud-storage',
                name: 'Cloud Storage Pro',
                type: ProductType.SERVICE,
                description: 'Premium cloud storage solution with 1TB capacity, advanced security, and 24/7 support',
                salesPrice: 99.99,
                costPrice: 40.00,
                isActive: true,
            },
        }),
        prisma.product.upsert({
            where: { id: 'prod-email-marketing' },
            update: {},
            create: {
                id: 'prod-email-marketing',
                name: 'Email Marketing Suite',
                type: ProductType.SERVICE,
                description: 'Complete email marketing automation platform with analytics and A/B testing',
                salesPrice: 149.99,
                costPrice: 60.00,
                isActive: true,
            },
        }),
        prisma.product.upsert({
            where: { id: 'prod-crm' },
            update: {},
            create: {
                id: 'prod-crm',
                name: 'CRM Software',
                type: ProductType.SERVICE,
                description: 'Customer relationship management system with sales pipeline and reporting',
                salesPrice: 299.99,
                costPrice: 120.00,
                isActive: true,
            },
        }),
        prisma.product.upsert({
            where: { id: 'prod-analytics' },
            update: {},
            create: {
                id: 'prod-analytics',
                name: 'Business Analytics Dashboard',
                type: ProductType.SERVICE,
                description: 'Real-time business intelligence and analytics platform',
                salesPrice: 199.99,
                costPrice: 80.00,
                isActive: true,
            },
        }),
        prisma.product.upsert({
            where: { id: 'prod-backup' },
            update: {},
            create: {
                id: 'prod-backup',
                name: 'Automated Backup Service',
                type: ProductType.SERVICE,
                description: 'Automated daily backups with instant recovery',
                salesPrice: 79.99,
                costPrice: 30.00,
                isActive: true,
            },
        }),
        prisma.product.upsert({
            where: { id: 'prod-support' },
            update: {},
            create: {
                id: 'prod-support',
                name: 'Priority Support Package',
                type: ProductType.SERVICE,
                description: '24/7 priority support with dedicated account manager',
                salesPrice: 499.99,
                costPrice: 200.00,
                isActive: true,
            },
        }),
        prisma.product.upsert({
            where: { id: 'prod-api' },
            update: {},
            create: {
                id: 'prod-api',
                name: 'API Access Pro',
                type: ProductType.SERVICE,
                description: 'Unlimited API calls with advanced features and webhooks',
                salesPrice: 249.99,
                costPrice: 100.00,
                isActive: true,
            },
        }),
        prisma.product.upsert({
            where: { id: 'prod-security' },
            update: {},
            create: {
                id: 'prod-security',
                name: 'Advanced Security Suite',
                type: ProductType.SERVICE,
                description: 'Enterprise-grade security with encryption and compliance tools',
                salesPrice: 399.99,
                costPrice: 150.00,
                isActive: true,
            },
        }),
    ]);
    console.log(`✅ Created ${products.length} products`);

    // ============================================
    // RECURRING PLANS
    // ============================================
    console.log('\n📅 Creating recurring plans...');

    const plans = await Promise.all([
        prisma.recurringPlan.upsert({
            where: { id: 'plan-monthly-basic' },
            update: {},
            create: {
                id: 'plan-monthly-basic',
                name: 'Monthly Basic',
                price: 49.99,
                billingPeriod: BillingPeriod.MONTHLY,
                minimumQuantity: 1,
                autoClose: false,
                closable: true,
                pausable: true,
                renewable: true,
                isActive: true,
            },
        }),
        prisma.recurringPlan.upsert({
            where: { id: 'plan-monthly-standard' },
            update: {},
            create: {
                id: 'plan-monthly-standard',
                name: 'Monthly Standard',
                price: 99.99,
                billingPeriod: BillingPeriod.MONTHLY,
                minimumQuantity: 1,
                autoClose: false,
                closable: true,
                pausable: true,
                renewable: true,
                isActive: true,
            },
        }),
        prisma.recurringPlan.upsert({
            where: { id: 'plan-monthly-premium' },
            update: {},
            create: {
                id: 'plan-monthly-premium',
                name: 'Monthly Premium',
                price: 199.99,
                billingPeriod: BillingPeriod.MONTHLY,
                minimumQuantity: 1,
                autoClose: false,
                closable: true,
                pausable: true,
                renewable: true,
                isActive: true,
            },
        }),
        prisma.recurringPlan.upsert({
            where: { id: 'plan-yearly-basic' },
            update: {},
            create: {
                id: 'plan-yearly-basic',
                name: 'Yearly Basic',
                price: 499.99,
                billingPeriod: BillingPeriod.YEARLY,
                minimumQuantity: 1,
                autoClose: false,
                closable: true,
                pausable: true,
                renewable: true,
                isActive: true,
            },
        }),
        prisma.recurringPlan.upsert({
            where: { id: 'plan-yearly-standard' },
            update: {},
            create: {
                id: 'plan-yearly-standard',
                name: 'Yearly Standard',
                price: 999.99,
                billingPeriod: BillingPeriod.YEARLY,
                minimumQuantity: 1,
                autoClose: false,
                closable: true,
                pausable: true,
                renewable: true,
                isActive: true,
            },
        }),
        prisma.recurringPlan.upsert({
            where: { id: 'plan-yearly-premium' },
            update: {},
            create: {
                id: 'plan-yearly-premium',
                name: 'Yearly Premium',
                price: 1999.99,
                billingPeriod: BillingPeriod.YEARLY,
                minimumQuantity: 1,
                autoClose: false,
                closable: true,
                pausable: true,
                renewable: true,
                isActive: true,
            },
        }),
    ]);
    console.log(`✅ Created ${plans.length} recurring plans`);

    // ============================================
    // TAXES
    // ============================================
    console.log('\n💰 Creating taxes...');

    const taxes = await Promise.all([
        prisma.tax.upsert({
            where: { id: 'tax-sales' },
            update: {},
            create: {
                id: 'tax-sales',
                name: 'Sales Tax',
                type: TaxType.PERCENTAGE,
                rate: 10.0,
                description: 'Standard sales tax',
                isActive: true,
            },
        }),
        prisma.tax.upsert({
            where: { id: 'tax-vat' },
            update: {},
            create: {
                id: 'tax-vat',
                name: 'VAT',
                type: TaxType.PERCENTAGE,
                rate: 20.0,
                description: 'Value Added Tax',
                isActive: true,
            },
        }),
        prisma.tax.upsert({
            where: { id: 'tax-gst' },
            update: {},
            create: {
                id: 'tax-gst',
                name: 'GST',
                type: TaxType.PERCENTAGE,
                rate: 18.0,
                description: 'Goods and Services Tax',
                isActive: true,
            },
        }),
    ]);
    console.log(`✅ Created ${taxes.length} taxes`);

    // ============================================
    // DISCOUNTS
    // ============================================
    console.log('\n🎁 Creating discounts...');

    const discounts = await Promise.all([
        prisma.discount.upsert({
            where: { id: 'disc-new-customer' },
            update: {},
            create: {
                id: 'disc-new-customer',
                name: 'New Customer Discount',
                code: 'WELCOME20',
                type: DiscountType.PERCENTAGE,
                value: 20.0,
                minimumPurchase: 100.00,
                minimumQuantity: 1,
                startDate: new Date(),
                endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                limitUsage: 100,
                currentUsage: 15,
                isActive: true,
            },
        }),
        prisma.discount.upsert({
            where: { id: 'disc-summer' },
            update: {},
            create: {
                id: 'disc-summer',
                name: 'Summer Sale',
                code: 'SUMMER2026',
                type: DiscountType.PERCENTAGE,
                value: 15.0,
                minimumPurchase: 50.00,
                minimumQuantity: 1,
                startDate: new Date(),
                endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                limitUsage: 200,
                currentUsage: 45,
                isActive: true,
            },
        }),
        prisma.discount.upsert({
            where: { id: 'disc-enterprise' },
            update: {},
            create: {
                id: 'disc-enterprise',
                name: 'Enterprise Discount',
                code: 'ENTERPRISE50',
                type: DiscountType.FIXED,
                value: 50.0,
                minimumPurchase: 500.00,
                minimumQuantity: 5,
                startDate: new Date(),
                endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                limitUsage: 50,
                currentUsage: 8,
                isActive: true,
            },
        }),
    ]);
    console.log(`✅ Created ${discounts.length} discounts`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👥 Users: ${1 + 1 + customers.length} (1 Admin, 1 Internal, ${customers.length} Customers)`);
    console.log(`📦 Products: ${products.length}`);
    console.log(`📅 Recurring Plans: ${plans.length}`);
    console.log(`💰 Taxes: ${taxes.length}`);
    console.log(`🎁 Discounts: ${discounts.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('\n📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👨‍💼 Admin:');
    console.log('   Email: admin@erp.com');
    console.log('   Password: Admin@123');
    console.log('');
    console.log('👤 Internal User:');
    console.log('   Email: internal@erp.com');
    console.log('   Password: Internal@123');
    console.log('');
    console.log('👥 Customer Users (all use same password):');
    console.log('   Email: john.doe@acme.com');
    console.log('   Email: jane.smith@techcorp.com');
    console.log('   Email: mike.wilson@startup.io');
    console.log('   Email: emily.brown@enterprise.com');
    console.log('   Email: david.lee@solutions.net');
    console.log('   Password: Customer@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
