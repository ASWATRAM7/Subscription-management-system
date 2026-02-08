import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkLogin() {
    console.log('🔍 Checking login credentials...\n');

    const email = 'admin@erp.com';
    const password = 'Admin@123';

    // Find user
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log('❌ User not found with email:', email);
        console.log('\n💡 Run: npm run db:seed');
        return;
    }

    console.log('✅ User found:');
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Name:', user.firstName, user.lastName);
    console.log('   Role:', user.role);
    console.log('   Active:', user.isActive);
    console.log('   Password Hash:', user.password.substring(0, 20) + '...');

    // Test password
    const isValid = await bcrypt.compare(password, user.password);

    console.log('\n🔐 Password Test:');
    console.log('   Input Password:', password);
    console.log('   Password Valid:', isValid ? '✅ YES' : '❌ NO');

    if (isValid) {
        console.log('\n🎉 Login credentials are CORRECT!');
        console.log('   Email:', email);
        console.log('   Password:', password);
    } else {
        console.log('\n❌ Password does NOT match!');
        console.log('   Try resetting the password or re-seeding the database.');
    }

    await prisma.$disconnect();
}

checkLogin().catch(console.error);
