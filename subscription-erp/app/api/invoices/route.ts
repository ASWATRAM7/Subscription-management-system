import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// GET all invoices
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            const invoice = await prisma.invoice.findUnique({
                where: { id },
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
                                            // address is on Customer model, not User
                                        },
                                    },
                                },
                            },
                        },
                    },
                    lines: {
                        include: {
                            product: true,
                        },
                    },
                    payments: true,
                    customer: {
                        include: {
                            user: true,
                        }
                    }
                },
            });

            if (!invoice) {
                return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
            }

            return NextResponse.json(invoice);
        }

        const invoices = await prisma.invoice.findMany({
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
                lines: {
                    include: {
                        product: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                payments: {
                    select: {
                        id: true,
                        amount: true,
                        paymentDate: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return NextResponse.json(
            { error: 'Failed to fetch invoices' },
            { status: 500 }
        );
    }
}

// POST create new invoice
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { subscriptionId, invoiceNumber, invoiceDate, dueDate, status } = body;

        if (!subscriptionId || !invoiceNumber) {
            return NextResponse.json(
                { error: 'Subscription and invoice number are required' },
                { status: 400 }
            );
        }

        // Fetch subscription to get customerId
        const subscription = await prisma.subscription.findUnique({
            where: { id: subscriptionId },
            select: { customerId: true },
        });

        if (!subscription) {
            return NextResponse.json(
                { error: 'Subscription not found' },
                { status: 404 }
            );
        }

        const invoice = await prisma.invoice.create({
            data: {
                subscriptionId,
                customerId: subscription.customerId,
                invoiceNumber,
                invoiceDate: invoiceDate ? new Date(invoiceDate) : new Date(),
                dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                status: status || 'DRAFT',
                subtotal: 0,
                taxAmount: 0,
                totalAmount: 0,
            },
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
        });

        return NextResponse.json(invoice, { status: 201 });
    } catch (error) {
        console.error('Error creating invoice:', error);
        return NextResponse.json(
            { error: 'Failed to create invoice' },
            { status: 500 }
        );
    }
}

// PUT update invoice
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, subtotal, taxAmount, totalAmount, dueDate } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Invoice ID is required' },
                { status: 400 }
            );
        }

        const invoice = await prisma.invoice.update({
            where: { id },
            data: {
                status,
                subtotal: subtotal ? parseFloat(subtotal) : undefined,
                taxAmount: taxAmount ? parseFloat(taxAmount) : undefined,
                totalAmount: totalAmount ? parseFloat(totalAmount) : undefined,
                dueDate: dueDate ? new Date(dueDate) : undefined,
            },
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
        });

        return NextResponse.json(invoice);
    } catch (error) {
        console.error('Error updating invoice:', error);
        return NextResponse.json(
            { error: 'Failed to update invoice' },
            { status: 500 }
        );
    }
}

// DELETE invoice
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Invoice ID is required' },
                { status: 400 }
            );
        }

        await prisma.invoice.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        return NextResponse.json(
            { error: 'Failed to delete invoice' },
            { status: 500 }
        );
    }
}
