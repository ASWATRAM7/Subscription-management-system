import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// GET all products
export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: {
                variants: true,
                _count: {
                    select: {
                        subscriptionLines: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

// POST create new product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, type, description, salesPrice, costPrice } = body;

        if (!name || !salesPrice || !costPrice) {
            return NextResponse.json(
                { error: 'Name, sales price, and cost price are required' },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: {
                name,
                type: type || 'SERVICE',
                description,
                salesPrice: parseFloat(salesPrice),
                costPrice: parseFloat(costPrice),
                isActive: true,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
}

// PUT update product
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, type, description, salesPrice, costPrice, isActive } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                type,
                description,
                salesPrice: salesPrice ? parseFloat(salesPrice) : undefined,
                costPrice: costPrice ? parseFloat(costPrice) : undefined,
                isActive,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

// DELETE product
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            );
        }

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
