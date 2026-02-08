import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// GET all recurring plans
export async function GET() {
    try {
        const plans = await prisma.recurringPlan.findMany({
            include: {
                _count: {
                    select: {
                        subscriptions: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(plans);
    } catch (error) {
        console.error('Error fetching plans:', error);
        return NextResponse.json(
            { error: 'Failed to fetch plans' },
            { status: 500 }
        );
    }
}

// POST create new plan
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, billingPeriod, price, description, autoClose, closable, pausable, renewable } = body;

        if (!name || !billingPeriod || price === undefined || price === null || price === '') {
            return NextResponse.json(
                { error: 'Name, billing period, and price are required' },
                { status: 400 }
            );
        }

        const plan = await prisma.recurringPlan.create({
            data: {
                name,
                billingPeriod,
                price: parseFloat(price.toString()),
                autoClose: autoClose ?? false,
                closable: closable ?? true,
                pausable: pausable ?? true,
                renewable: renewable ?? true,
                isActive: true,
            },
        });

        return NextResponse.json(plan, { status: 201 });
    } catch (error) {
        console.error('Error creating plan:', error);
        return NextResponse.json(
            { error: `Failed to create plan: ${error instanceof Error ? error.message : String(error)}` },
            { status: 500 }
        );
    }
}

// PUT update plan
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, billingPeriod, price, description, autoClose, closable, pausable, renewable, isActive } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Plan ID is required' },
                { status: 400 }
            );
        }

        const plan = await prisma.recurringPlan.update({
            where: { id },
            data: {
                name,
                billingPeriod,
                price: price !== undefined && price !== null && price !== '' ? parseFloat(price.toString()) : undefined,
                autoClose,
                closable,
                pausable,
                renewable,
                isActive,
            },
        });

        return NextResponse.json(plan);
    } catch (error) {
        console.error('Error updating plan:', error);
        return NextResponse.json(
            { error: 'Failed to update plan' },
            { status: 500 }
        );
    }
}

// DELETE plan
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Plan ID is required' },
                { status: 400 }
            );
        }

        await prisma.recurringPlan.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting plan:', error);
        return NextResponse.json(
            { error: 'Failed to delete plan' },
            { status: 500 }
        );
    }
}
