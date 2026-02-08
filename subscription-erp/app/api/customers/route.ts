import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { hashPassword } from '@/app/lib/auth';

// GET all customers
export async function GET() {
    try {
        const customers = await prisma.customer.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        isActive: true,
                    },
                },
                subscriptions: {
                    select: {
                        id: true,
                        status: true,
                        lines: {
                            select: {
                                quantity: true,
                                unitPrice: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Calculate total amount for each subscription
        const customersWithTotal = customers.map(customer => ({
            ...customer,
            subscriptions: customer.subscriptions.map(sub => ({
                id: sub.id,
                status: sub.status,
                totalAmount: sub.lines.reduce((sum, line) => sum + (line.quantity * line.unitPrice), 0),
            })),
        }));

        return NextResponse.json(customersWithTotal);
    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch customers' },
            { status: 500 }
        );
    }
}

// POST create new customer
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, firstName, lastName, companyName, phone, address, city, state, postalCode, country } = body;

        if (!email || !firstName || !lastName) {
            return NextResponse.json(
                { error: 'Email, first name, and last name are required' },
                { status: 400 }
            );
        }

        // Create user first
        const hashedPassword = await hashPassword('Customer@123'); // Default password

        const customer = await prisma.customer.create({
            data: {
                companyName,
                phone,
                address,
                city,
                state,
                postalCode,
                country,
                user: {
                    create: {
                        email,
                        firstName,
                        lastName,
                        password: hashedPassword,
                        role: 'CUSTOMER',
                        isActive: true,
                    },
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        return NextResponse.json(customer, { status: 201 });
    } catch (error) {
        console.error('Error creating customer:', error);
        return NextResponse.json(
            { error: 'Failed to create customer' },
            { status: 500 }
        );
    }
}

// PUT update customer
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, companyName, phone, address, city, state, postalCode, country, firstName, lastName } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Customer ID is required' },
                { status: 400 }
            );
        }

        const customer = await prisma.customer.update({
            where: { id },
            data: {
                companyName,
                phone,
                address,
                city,
                state,
                postalCode,
                country,
                user: {
                    update: {
                        firstName,
                        lastName,
                    },
                },
            },
            include: {
                user: true,
            },
        });

        return NextResponse.json(customer);
    } catch (error) {
        console.error('Error updating customer:', error);
        return NextResponse.json(
            { error: 'Failed to update customer' },
            { status: 500 }
        );
    }
}

// DELETE customer
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Customer ID is required' },
                { status: 400 }
            );
        }

        // Get customer to find user ID
        const customer = await prisma.customer.findUnique({
            where: { id },
            select: { userId: true },
        });

        if (!customer) {
            return NextResponse.json(
                { error: 'Customer not found' },
                { status: 404 }
            );
        }

        // Delete customer (will cascade delete user due to schema)
        await prisma.customer.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting customer:', error);
        return NextResponse.json(
            { error: 'Failed to delete customer' },
            { status: 500 }
        );
    }
}
