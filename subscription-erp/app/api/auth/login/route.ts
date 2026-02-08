import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { verifyPassword, generateToken } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check if user is active
        if (!user.isActive) {
            return NextResponse.json(
                { error: 'Account is deactivated. Please contact administrator.' },
                { status: 403 }
            );
        }

        // Verify password
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        // Return user data (without password)
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            token,
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'An error occurred during login' },
            { status: 500 }
        );
    }
}
