import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// GET all taxes
export async function GET() {
    try {
        const taxes = await prisma.tax.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(taxes);
    } catch (error) {
        console.error('Error fetching taxes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch taxes' },
            { status: 500 }
        );
    }
}

// POST create new tax
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, type, rate } = body;

        if (!name || !type || rate === undefined) {
            return NextResponse.json(
                { error: 'Name, type, and rate are required' },
                { status: 400 }
            );
        }

        const tax = await prisma.tax.create({
            data: {
                name,
                type,
                rate: parseFloat(rate),
                isActive: true,
            },
        });

        return NextResponse.json(tax, { status: 201 });
    } catch (error) {
        console.error('Error creating tax:', error);
        return NextResponse.json(
            { error: 'Failed to create tax' },
            { status: 500 }
        );
    }
}

// PUT update tax
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, type, rate, isActive } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Tax ID is required' },
                { status: 400 }
            );
        }

        const tax = await prisma.tax.update({
            where: { id },
            data: {
                name,
                type,
                rate: rate ? parseFloat(rate) : undefined,
                isActive,
            },
        });

        return NextResponse.json(tax);
    } catch (error) {
        console.error('Error updating tax:', error);
        return NextResponse.json(
            { error: 'Failed to update tax' },
            { status: 500 }
        );
    }
}

// DELETE tax
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Tax ID is required' },
                { status: 400 }
            );
        }

        await prisma.tax.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting tax:', error);
        return NextResponse.json(
            { error: 'Failed to delete tax' },
            { status: 500 }
        );
    }
}
