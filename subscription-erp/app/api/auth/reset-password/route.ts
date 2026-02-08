import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { hashPassword } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date(), // Check if expiry is in the future
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await hashPassword(password);

        // Update user
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return NextResponse.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
