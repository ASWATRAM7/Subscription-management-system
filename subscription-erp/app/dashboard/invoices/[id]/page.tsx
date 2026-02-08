'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './invoice.module.css';

interface InvoiceDetails {
    id: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    status: string;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    subscription: {
        subscriptionNumber: string;
        customer: {
            companyName: string;
            phone: string;
            address: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            user: {
                firstName: string;
                lastName: string;
                email: string;
            };
        };
    };
    lines: Array<{
        id: string;
        quantity: number;
        unitPrice: number;
        product: {
            name: string;
        };
    }>;
    payments: Array<{
        id: string;
        amount: number;
        paymentDate: string;
    }>;
}

export default function InvoiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [invoice, setInvoice] = useState<InvoiceDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchInvoice(params.id as string);
        }
    }, [params.id]);

    const fetchInvoice = async (id: string) => {
        try {
            const response = await fetch(`/api/invoices?id=${id}`);
            if (!response.ok) throw new Error('Invoice not found');
            const data = await response.json();
            setInvoice(data);
        } catch (error) {
            console.error('Error fetching invoice:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculatePaidAmount = () => {
        if (!invoice?.payments) return 0;
        return invoice.payments.reduce((sum, p) => sum + p.amount, 0);
    };

    const handleDownload = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className={styles.container}>
                <h1>Invoice not found</h1>
                <button onClick={() => router.back()} className="btn btn-secondary">Go Back</button>
            </div>
        );
    }

    const paidAmount = calculatePaidAmount();
    const amountDue = invoice.totalAmount - paidAmount;
    const customer = invoice.subscription.customer;
    const user = customer.user;

    return (
        <div className={styles.container}>
            {/* Top Bar with Actions */}
            <div className={styles.topBar}>
                <div className={styles.brand}>
                    <span>Subscription ERP</span>
                </div>
                <div className={styles.actions}>
                    <button onClick={() => router.push('/dashboard/invoices')} className="btn btn-secondary">
                        Back to List
                    </button>
                    <button className="btn btn-primary" onClick={() => router.push('/dashboard/payments')}>
                        Register Payment
                    </button>
                    <button className="btn btn-secondary" onClick={handleDownload}>
                        Download / Print
                    </button>
                </div>
            </div>

            {/* Header Section */}
            <div className={styles.header}>
                <div className={styles.reference}>
                    Order / {invoice.subscription.subscriptionNumber} / {invoice.invoiceNumber}
                </div>
                <h1 className={styles.title}>Invoice {invoice.invoiceNumber}</h1>
            </div>

            {/* Info Section */}
            <div className={styles.infoSection}>
                {/* Left Column: Dates & Source */}
                <div className={styles.infoColumn}>
                    <h3>Details</h3>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Invoice Date:</span>
                        <span className={styles.value}>{new Date(invoice.invoiceDate).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Due Date:</span>
                        <span className={styles.value}>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Source:</span>
                        <span className={styles.value}>{invoice.subscription.subscriptionNumber}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Status:</span>
                        <span className={`badge ${invoice.status === 'PAID' ? 'badge-success' :
                                invoice.status === 'OVERDUE' ? 'badge-danger' : 'badge-gray'
                            }`}>
                            {invoice.status}
                        </span>
                    </div>
                </div>

                {/* Right Column: Address */}
                <div className={styles.infoColumn}>
                    <h3>Bill To</h3>
                    <div className={styles.addressBlock}>
                        <strong className={styles.addressLine}>{user.firstName} {user.lastName}</strong>
                        {customer.companyName && <span className={styles.addressLine}>{customer.companyName}</span>}
                        <span className={styles.addressLine}>{customer.address}</span>
                        <span className={styles.addressLine}>
                            {customer.city}, {customer.state} {customer.postalCode}
                        </span>
                        <span className={styles.addressLine}>{customer.country}</span>
                        <span className={styles.addressLine} style={{ marginTop: '8px', color: 'var(--primary-600)' }}>
                            {user.email}
                        </span>
                        {customer.phone && <span className={styles.addressLine}>{customer.phone}</span>}
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className={styles.tableSection}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th style={{ textAlign: 'center' }}>Quantity</th>
                            <th style={{ textAlign: 'right' }}>Unit Price</th>
                            <th style={{ textAlign: 'right' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.lines && invoice.lines.length > 0 ? (
                            invoice.lines.map((line) => (
                                <tr key={line.id}>
                                    <td>{line.product.name}</td>
                                    <td style={{ textAlign: 'center' }}>{line.quantity.toFixed(2)} Unit</td>
                                    <td style={{ textAlign: 'right' }}>${line.unitPrice.toFixed(2)}</td>
                                    <td className={styles.amount}>
                                        ${(line.quantity * line.unitPrice).toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            // Fallback if no lines (e.g. manual invoice)
                            <tr>
                                <td>Subscription Service - {invoice.subscription.subscriptionNumber}</td>
                                <td style={{ textAlign: 'center' }}>1.00 Unit</td>
                                <td style={{ textAlign: 'right' }}>${invoice.totalAmount.toFixed(2)}</td>
                                <td className={styles.amount}>${invoice.totalAmount.toFixed(2)}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer / Totals */}
            <div className={styles.footer}>
                <div className={styles.notes}>
                    <h4>Payment Terms</h4>
                    <p>
                        Please pay by {new Date(invoice.dueDate).toLocaleDateString()}.<br />
                        Thank you for your business!
                    </p>
                </div>

                <div className={styles.totals}>
                    <div className={styles.totalRow}>
                        <span>Untaxed Amount:</span>
                        <span>${invoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className={styles.totalRow}>
                        <span>Tax ({((invoice.taxAmount / (invoice.subtotal || 1)) * 100).toFixed(0)}%):</span>
                        <span>${invoice.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className={`${styles.totalRow} ${styles.final}`}>
                        <span>Total:</span>
                        <span>${invoice.totalAmount.toFixed(2)}</span>
                    </div>

                    {paidAmount > 0 && (
                        <div className={`${styles.totalRow} ${styles.paidRow}`}>
                            <span>Paid on {new Date(invoice.payments[0]?.paymentDate || new Date()).toLocaleDateString()}:</span>
                            <span>${paidAmount.toFixed(2)}</span>
                        </div>
                    )}

                    <div className={`${styles.totalRow} ${styles.dueRow}`}>
                        <span>Amount Due:</span>
                        <span>${amountDue.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
