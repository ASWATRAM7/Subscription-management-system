import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// GET all subscriptions or single subscription by ID
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        const whereClause = id ? { id } : {};

        const subscriptions = await prisma.subscription.findMany({
            where: whereClause,
            include: {
                customer: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
                plan: {
                    select: {
                        name: true,
                        billingPeriod: true,
                        price: true,
                    },
                },
                lines: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                description: true,
                                salesPrice: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Calculate total amount from lines or plan and map plan -> recurringPlan
        const subscriptionsWithTotal = subscriptions.map(sub => {
            let total = 0;
            if (sub.lines && sub.lines.length > 0) {
                total = sub.lines.reduce((sum, line) => sum + (line.quantity * line.unitPrice), 0);
            } else if (sub.plan) {
                total = sub.plan.price || 0;
            }
            return {
                ...sub,
                recurringPlan: sub.plan, // Frontend compatibility
                totalAmount: total,
            };
        });

        return NextResponse.json(subscriptionsWithTotal);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subscriptions' },
            { status: 500 }
        );
    }
}

// POST create new subscription
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { customerId, planId, recurringPlanId, subscriptionNumber, startDate, endDate, status, lines } = body;

        // Support both planId and recurringPlanId for compatibility
        const actualPlanId = planId || recurringPlanId;

        if (!customerId) {
            return NextResponse.json(
                { error: 'Customer is required' },
                { status: 400 }
            );
        }

        // Auto-generate Subscription Number if Draft or missing
        const finalSubscriptionNumber = (!subscriptionNumber || subscriptionNumber === 'Draft')
            ? `SUB-${Date.now()}`
            : subscriptionNumber;

        // Ensure expirationDate is set (required by schema)
        // Use provided endDate or default to 1 month from start
        const start = startDate ? new Date(startDate) : new Date();
        const expiration = endDate ? new Date(endDate) : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);

        const subscription = await prisma.subscription.create({
            data: {
                customerId,
                planId: actualPlanId,
                subscriptionNumber: finalSubscriptionNumber,
                startDate: start,
                expirationDate: expiration,
                status: status || 'DRAFT',
                lines: {
                    create: Array.isArray(lines) ? lines.map((line: any) => ({
                        productId: line.productId,
                        quantity: Number(line.quantity),
                        unitPrice: Number(line.unitPrice)
                    })) : []
                }
            },
            include: {
                customer: {
                    include: {
                        user: true,
                    },
                },
                plan: true,
                lines: true
            },
        });

        // Map plan back to recurringPlan for frontend consistency
        const responseSub = {
            ...subscription,
            recurringPlan: subscription.plan,
        };

        return NextResponse.json(responseSub, { status: 201 });
    } catch (error) {
        console.error('Error creating subscription:', error);
        return NextResponse.json(
            { error: 'Failed to create subscription: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}

// PUT update subscription
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, endDate, planId, recurringPlanId } = body;

        const actualPlanId = planId || recurringPlanId;

        if (!id) {
            return NextResponse.json(
                { error: 'Subscription ID is required' },
                { status: 400 }
            );
        }

        const subscription = await prisma.subscription.update({
            where: { id },
            data: {
                status,
                expirationDate: endDate ? new Date(endDate) : undefined,
                planId: actualPlanId,
            },
            include: {
                customer: {
                    include: {
                        user: true,
                    },
                },
                plan: true,
            },
        });

        // Map plan back to recurringPlan
        const responseSub = {
            ...subscription,
            recurringPlan: subscription.plan,
        };

        return NextResponse.json(responseSub);
    } catch (error) {
        console.error('Error updating subscription:', error);
        return NextResponse.json(
            { error: 'Failed to update subscription' },
            { status: 500 }
        );
    }
}

// DELETE subscription
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Subscription ID is required' },
                { status: 400 }
            );
        }

        await prisma.subscription.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting subscription:', error);
        return NextResponse.json(
            { error: 'Failed to delete subscription' },
            { status: 500 }
        );
    }
}
