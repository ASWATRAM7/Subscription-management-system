import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// GET all payments
export async function GET() {
    try {
        const payments = await prisma.payment.findMany({
            include: {
                invoice: {
                    include: {
                        subscription: {
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
                            },
                        },
                    },
                },
            },
            orderBy: {
                paymentDate: 'desc',
            },
        });

        return NextResponse.json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch payments' },
            { status: 500 }
        );
    }
}

// POST create new payment
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { invoiceId, amount, paymentMethod, paymentDate, reference } = body;

        if (!invoiceId || !amount) {
            return NextResponse.json(
                { error: 'Invoice and amount are required' },
                { status: 400 }
            );
        }

        const payment = await prisma.payment.create({
            data: {
                invoiceId,
                amount: parseFloat(amount),
                paymentMethod: paymentMethod || 'CREDIT_CARD',
                paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
                reference,
            },
            include: {
                invoice: {
                    include: {
                        subscription: {
                            include: {
                                customer: {
                                    include: {
                                        user: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(payment, { status: 201 });
    } catch (error) {
        console.error('Error creating payment:', error);
        return NextResponse.json(
            { error: 'Failed to create payment' },
            { status: 500 }
        );
    }
}

// PUT update payment
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, amount, paymentMethod, reference } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Payment ID is required' },
                { status: 400 }
            );
        }

        const payment = await prisma.payment.update({
            where: { id },
            data: {
                amount: amount ? parseFloat(amount) : undefined,
                paymentMethod,
                reference,
            },
            include: {
                invoice: {
                    include: {
                        subscription: {
                            include: {
                                customer: {
                                    include: {
                                        user: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(payment);
    } catch (error) {
        console.error('Error updating payment:', error);
        return NextResponse.json(
            { error: 'Failed to update payment' },
            { status: 500 }
        );
    }
}

// DELETE payment
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Payment ID is required' },
                { status: 400 }
            );
        }

        await prisma.payment.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting payment:', error);
        return NextResponse.json(
            { error: 'Failed to delete payment' },
            { status: 500 }
        );
    }
}
