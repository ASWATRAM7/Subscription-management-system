import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        // Validate email format
        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Check if user exists in database
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Return error for invalid email
            return NextResponse.json({
                error: 'No account found with this email address. Please check and try again.'
            }, { status: 404 });
        }

        // Check if user account is active
        if (!user.isActive) {
            return NextResponse.json({
                error: 'This account has been deactivated. Please contact support.'
            }, { status: 403 });
        }

        // Generate secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Save token to database
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });

        // For development: Log the reset link to console
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        console.log('\n========================================');
        console.log('🔐 PASSWORD RESET REQUEST');
        console.log('========================================');
        console.log(`Email: ${email}`);
        console.log(`Reset Link: ${resetUrl}`);
        console.log(`Token: ${resetToken}`);
        console.log(`Expires: ${resetTokenExpiry.toLocaleString()}`);
        console.log('========================================\n');

        // Try to send email if configured, but don't fail if not
        try {
            const { sendPasswordResetEmail } = await import('@/app/lib/email');
            await sendPasswordResetEmail(email, resetToken);
            console.log('✅ Email sent successfully');
        } catch (emailError) {
            console.log('⚠️  Email service not configured - using console logging instead');
        }

        return NextResponse.json({
            message: `Password reset instructions have been sent to ${email}. Please check your inbox.`,
            success: true,
            // In development, include the reset link
            ...(process.env.NODE_ENV === 'development' && {
                devResetLink: resetUrl,
                devNote: 'Check the server console for the reset link'
            })
        });

    } catch (error) {
        console.error('Error in forgot-password:', error);
        return NextResponse.json({
            error: 'Failed to process password reset request. Please try again.'
        }, { status: 500 });
    }
}
