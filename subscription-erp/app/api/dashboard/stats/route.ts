import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
    try {
        // Run parallel queries for performance
        const [
            activeSubsCount,
            totalRevenueResult,
            pendingInvoicesCount,
            totalCustomersCount,
            recentSubscriptions,
            recentInvoices,
            productsCount,
            plansCount,
            taxesCount
        ] = await Promise.all([
            prisma.subscription.count({ where: { status: 'ACTIVE' } }),
            prisma.invoice.aggregate({
                _sum: { totalAmount: true },
                where: { status: 'PAID' }
            }),
            prisma.invoice.count({ where: { status: { in: ['CONFIRMED', 'DRAFT'] } } }), // Pending payment
            prisma.customer.count(),
            prisma.subscription.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' },
                include: { customer: { include: { user: true } } }
            }),
            prisma.invoice.findMany({
                take: 3,
                orderBy: { createdAt: 'desc' },
                include: { customer: { include: { user: true } } }
            }),
            prisma.product.count(),
            prisma.recurringPlan.count({ where: { isActive: true } }),
            prisma.tax.count({ where: { isActive: true } })
        ]);

        // Combine recent activity
        const activity = [
            ...recentSubscriptions.map(sub => ({
                id: sub.id,
                type: 'subscription',
                title: `New subscription #${sub.subscriptionNumber}`,
                description: `${sub.customer.user.firstName} ${sub.customer.user.lastName}`,
                amount: 0, // Calculate if needed
                date: sub.createdAt
            })),
            ...recentInvoices.map(inv => ({
                id: inv.id,
                type: 'invoice',
                title: `Invoice #${inv.invoiceNumber} generated`,
                description: `${inv.customer.user.firstName} ${inv.customer.user.lastName}`,
                amount: inv.totalAmount,
                date: inv.createdAt
            }))
        ]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5); // Top 5 recent events

        return NextResponse.json({
            stats: {
                activeSubscriptions: activeSubsCount,
                totalRevenue: totalRevenueResult._sum.totalAmount || 0,
                pendingInvoices: pendingInvoicesCount,
                totalCustomers: totalCustomersCount,
            },
            activity,
            system: {
                products: productsCount,
                activePlans: plansCount,
                activeTaxes: taxesCount
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard stats' },
            { status: 500 }
        );
    }
}
