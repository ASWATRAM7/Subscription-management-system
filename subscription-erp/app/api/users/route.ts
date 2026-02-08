import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { hashPassword } from '@/app/lib/auth';

// GET all users
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

// POST create new user
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, firstName, lastName, role, password } = body;

        if (!email || !firstName || !lastName || !role) {
            return NextResponse.json(
                { error: 'Email, first name, last name, and role are required' },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(password || 'User@123');

        const user = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                role,
                password: hashedPassword,
                isActive: true,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        );
    }
}

// PUT update user
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, firstName, lastName, role, isActive, password } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const updateData: any = {
            firstName,
            lastName,
            role,
            isActive,
        };

        if (password) {
            updateData.password = await hashPassword(password);
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}

// DELETE user
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}
