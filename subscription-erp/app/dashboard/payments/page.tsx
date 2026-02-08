'use client';

import { useEffect, useState } from 'react';
import { useConfirm } from '@/app/components/ConfirmProvider';
import { useToast } from '@/app/components/ToastProvider';
import styles from '../products/products.module.css';

interface Payment {
    id: string;
    amount: number;
    paymentMethod: string;
    paymentDate: string;
    reference: string | null;
    invoice: {
        invoiceNumber: string;
        totalAmount: number;
        subscription: {
            customer: {
                user: {
                    firstName: string;
                    lastName: string;
                    email: string;
                };
            };
        };
    };
}

interface Invoice {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    subscription: {
        customer: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    };
}

export default function PaymentsPage() {
    const { confirm } = useConfirm();
    const toast = useToast();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        invoiceId: '',
        amount: '',
        paymentMethod: 'CREDIT_CARD',
        paymentDate: new Date().toISOString().split('T')[0],
        reference: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [payRes, invRes] = await Promise.all([
                fetch('/api/payments'),
                fetch('/api/invoices'),
            ]);

            const payData = await payRes.json();
            const invData = await invRes.json();

            if (Array.isArray(payData)) {
                setPayments(payData);
            } else {
                console.error('Payments API error:', payData);
                toast.error('Failed to load payments');
            }

            if (Array.isArray(invData)) {
                setInvoices(invData);
            } else {
                console.error('Invoices API error:', invData);
                toast.error('Failed to load invoices');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (submitting) return; // Prevent double submission

        setSubmitting(true);

        try {
            const url = '/api/payments';
            const method = editingPayment ? 'PUT' : 'POST';
            const body = editingPayment
                ? { ...formData, id: editingPayment.id }
                : formData;

            console.log('Submitting payment:', body);

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                await fetchData();
                handleCloseModal();
                toast.success(editingPayment ? 'Payment updated successfully!' : 'Payment recorded successfully!');
            } else {
                console.error('API error:', data);
                toast.error(data.error || 'Failed to save payment');
            }
        } catch (error) {
            console.error('Error saving payment:', error);
            toast.error('An error occurred while saving payment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (payment: Payment) => {
        setEditingPayment(payment);
        setFormData({
            invoiceId: payment.invoice.invoiceNumber,
            amount: payment.amount.toString(),
            paymentMethod: payment.paymentMethod,
            paymentDate: payment.paymentDate.split('T')[0],
            reference: payment.reference || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string, invoiceNumber: string) => {
        const confirmed = await confirm({
            title: 'Delete Payment',
            message: `Are you sure you want to delete the payment for ${invoiceNumber}?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger',
        });

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/payments?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchData();
                toast.success('Payment deleted successfully!');
            } else {
                toast.error('Failed to delete payment');
            }
        } catch (error) {
            console.error('Error deleting payment:', error);
            toast.error('An error occurred while deleting');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingPayment(null);
        setFormData({
            invoiceId: '',
            amount: '',
            paymentMethod: 'CREDIT_CARD',
            paymentDate: new Date().toISOString().split('T')[0],
            reference: '',
        });
    };

    const filteredPayments = payments.filter(pay =>
        pay.invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${pay.invoice.subscription.customer.user.firstName} ${pay.invoice.subscription.customer.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pay.reference?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getMethodBadge = (method: string) => {
        const badges: Record<string, string> = {
            CREDIT_CARD: 'badge-primary',
            DEBIT_CARD: 'badge-primary',
            BANK_TRANSFER: 'badge-success',
            PAYPAL: 'badge-warning',
            STRIPE: 'badge-primary',
            OTHER: 'badge-gray',
        };
        return badges[method] || 'badge-gray';
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className="spinner"></div>
                <p>Loading payments...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Payments</h1>
                    <p className={styles.subtitle}>Track customer payments</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    ➕ Add Payment
                </button>
            </div>

            <div className={styles.toolbar}>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: '400px' }}
                />
                <div className={styles.stats}>
                    <span className="badge badge-primary">{payments.length} Total</span>
                    <span className="badge badge-success">
                        ${payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)} Received
                    </span>
                </div>
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Payment Date</th>
                            <th>Customer</th>
                            <th>Invoice</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Reference / Note</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                                    No payments found
                                </td>
                            </tr>
                        ) : (
                            filteredPayments.map((pay) => (
                                <tr key={pay.id}>
                                    <td>{new Date(pay.paymentDate).toLocaleDateString()}</td>
                                    <td>
                                        <div>
                                            <strong>{pay.invoice.subscription.customer.user.firstName} {pay.invoice.subscription.customer.user.lastName}</strong>
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                                                {pay.invoice.subscription.customer.user.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{pay.invoice.invoiceNumber}</td>
                                    <td><strong>${pay.amount.toFixed(2)}</strong></td>
                                    <td>
                                        <span className={`badge ${getMethodBadge(pay.paymentMethod)}`}>
                                            {pay.paymentMethod.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td>
                                        <code style={{ fontSize: '0.8125rem' }}>
                                            {pay.reference || '-'}
                                        </code>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => handleEdit(pay)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(pay.id, pay.invoice.invoiceNumber)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2>{editingPayment ? 'Edit Payment' : 'Add New Payment'}</h2>
                            <button className={styles.closeBtn} onClick={handleCloseModal}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                                <div className="form-group">
                                    <label className="form-label">Invoice *</label>
                                    <select
                                        className="form-select"
                                        value={formData.invoiceId}
                                        onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Invoice</option>
                                        {invoices.map((inv) => (
                                            <option key={inv.id} value={inv.id}>
                                                {inv.invoiceNumber} - {inv.subscription.customer.user.firstName} {inv.subscription.customer.user.lastName} (${inv.totalAmount.toFixed(2)})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Amount *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                                <div className="form-group">
                                    <label className="form-label">Payment Method *</label>
                                    <select
                                        className="form-select"
                                        value={formData.paymentMethod}
                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                    >
                                        <option value="CREDIT_CARD">Credit Card</option>
                                        <option value="DEBIT_CARD">Debit Card</option>
                                        <option value="BANK_TRANSFER">Bank Transfer</option>
                                        <option value="PAYPAL">PayPal</option>
                                        <option value="STRIPE">Stripe</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Payment Date *</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.paymentDate}
                                        onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Reference / Note</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.reference}
                                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                    placeholder="Check #, Transaction ID, etc."
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : (editingPayment ? 'Update Payment' : 'Record Payment')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
