import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
    console.log('🔐 Creating admin user...\n');

    const email = 'admin@erp.com';
    const password = 'Admin@123';

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed');

    // Delete existing user if exists
    try {
        await prisma.user.delete({
            where: { email },
        });
        console.log('🗑️  Deleted existing admin user');
    } catch (e) {
        console.log('ℹ️  No existing admin user to delete');
    }

    // Create new admin user
    const admin = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName: 'System',
            lastName: 'Administrator',
            role: 'ADMIN',
            isActive: true,
        },
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', admin.email);
    console.log('Password:', password);
    console.log('Role:', admin.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Test password
    const isValid = await bcrypt.compare(password, admin.password);
    console.log('\n🧪 Password verification test:', isValid ? '✅ PASS' : '❌ FAIL');

    await prisma.$disconnect();
}

createAdmin().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
});
