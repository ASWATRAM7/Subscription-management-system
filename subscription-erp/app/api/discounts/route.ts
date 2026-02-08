import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// GET all discounts
export async function GET() {
    try {
        const discounts = await prisma.discount.findMany({
            include: {
                products: {
                    include: {
                        product: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                subscriptions: {
                    include: {
                        subscription: {
                            select: {
                                subscriptionNumber: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(discounts);
    } catch (error) {
        console.error('Error fetching discounts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch discounts' },
            { status: 500 }
        );
    }
}

// POST create new discount
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, code, type, value, startDate, endDate, isActive } = body;

        if (!name || !code || !type || value === undefined) {
            return NextResponse.json(
                { error: 'Name, code, type, and value are required' },
                { status: 400 }
            );
        }

        const discount = await prisma.discount.create({
            data: {
                name,
                code,
                type,
                value: parseFloat(value),
                startDate: startDate ? new Date(startDate) : new Date(),
                endDate: endDate ? new Date(endDate) : null,
                isActive: isActive ?? true,
            },
        });

        return NextResponse.json(discount, { status: 201 });
    } catch (error) {
        console.error('Error creating discount:', error);
        return NextResponse.json(
            { error: 'Failed to create discount' },
            { status: 500 }
        );
    }
}

// PUT update discount
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, code, type, value, startDate, endDate, isActive } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Discount ID is required' },
                { status: 400 }
            );
        }

        const discount = await prisma.discount.update({
            where: { id },
            data: {
                name,
                code,
                type,
                value: value ? parseFloat(value) : undefined,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                isActive,
            },
        });

        return NextResponse.json(discount);
    } catch (error) {
        console.error('Error updating discount:', error);
        return NextResponse.json(
            { error: 'Failed to update discount' },
            { status: 500 }
        );
    }
}

// DELETE discount
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Discount ID is required' },
                { status: 400 }
            );
        }

        await prisma.discount.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting discount:', error);
        return NextResponse.json(
            { error: 'Failed to delete discount' },
            { status: 500 }
        );
    }
}
