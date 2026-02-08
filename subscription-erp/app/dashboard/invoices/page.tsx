'use client';

import { useEffect, useState } from 'react';
import { useConfirm } from '@/app/components/ConfirmProvider';
import { useToast } from '@/app/components/ToastProvider';
import styles from '../products/products.module.css';

interface Invoice {
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
            user: {
                firstName: string;
                lastName: string;
                email: string;
            };
        };
    };
    payments: Array<{
        id: string;
        amount: number;
    }>;
}

interface Subscription {
    id: string;
    subscriptionNumber: string;
    customer: {
        user: {
            firstName: string;
            lastName: string;
        };
    };
}

export default function InvoicesPage() {
    const { confirm } = useConfirm();
    const toast = useToast();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        subscriptionId: '',
        invoiceNumber: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'DRAFT',
        subtotal: '',
        taxAmount: '',
        totalAmount: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // Auto-calculate total
        const sub = parseFloat(formData.subtotal) || 0;
        const tax = parseFloat(formData.taxAmount) || 0;
        setFormData(prev => ({ ...prev, totalAmount: (sub + tax).toFixed(2) }));
    }, [formData.subtotal, formData.taxAmount]);

    const fetchData = async () => {
        try {
            const [invRes, subsRes] = await Promise.all([
                fetch('/api/invoices'),
                fetch('/api/subscriptions'),
            ]);

            const invData = await invRes.json();
            const subsData = await subsRes.json();

            if (Array.isArray(invData)) setInvoices(invData);
            if (Array.isArray(subsData)) setSubscriptions(subsData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (submitting) return;
        setSubmitting(true);

        try {
            const url = '/api/invoices';
            const method = editingInvoice ? 'PUT' : 'POST';
            const body = editingInvoice
                ? { ...formData, id: editingInvoice.id }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                await fetchData();
                handleCloseModal();
                toast.success(editingInvoice ? 'Invoice updated successfully!' : 'Invoice created successfully!');
            } else {
                toast.error('Failed to save invoice');
            }
        } catch (error) {
            console.error('Error saving invoice:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (invoice: Invoice) => {
        setEditingInvoice(invoice);
        setFormData({
            subscriptionId: invoice.subscription.subscriptionNumber,
            invoiceNumber: invoice.invoiceNumber,
            invoiceDate: invoice.invoiceDate.split('T')[0],
            dueDate: invoice.dueDate.split('T')[0],
            status: invoice.status,
            subtotal: invoice.subtotal.toString(),
            taxAmount: invoice.taxAmount.toString(),
            totalAmount: invoice.totalAmount.toString(),
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string, number: string) => {
        const confirmed = await confirm({
            title: 'Delete Invoice',
            message: `Are you sure you want to delete invoice #${number}?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger',
        });

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/invoices?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchData();
                toast.success('Invoice deleted successfully!');
            } else {
                toast.error('Failed to delete invoice');
            }
        } catch (error) {
            console.error('Error deleting invoice:', error);
            toast.error('An error occurred while deleting');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingInvoice(null);
        setFormData({
            subscriptionId: '',
            invoiceNumber: '',
            invoiceDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'DRAFT',
            subtotal: '',
            taxAmount: '',
            totalAmount: '',
        });
    };

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch =
            inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${inv.subscription.customer.user.firstName} ${inv.subscription.customer.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        const badges: Record<string, string> = {
            DRAFT: 'badge-gray',
            SENT: 'badge-primary',
            PAID: 'badge-success',
            OVERDUE: 'badge-danger',
            CANCELLED: 'badge-gray',
        };
        return badges[status] || 'badge-gray';
    };

    const getPaidAmount = (payments: Invoice['payments']) => {
        return payments.reduce((sum, p) => sum + p.amount, 0);
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className="spinner"></div>
                <p>Loading invoices...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Invoices</h1>
                    <p className={styles.subtitle}>Manage customer invoices</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    ➕ Add Invoice
                </button>
            </div>

            <div className={styles.toolbar}>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: '300px' }}
                />
                <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ maxWidth: '200px' }}
                >
                    <option value="ALL">All Status</option>
                    <option value="DRAFT">Draft</option>
                    <option value="SENT">Sent</option>
                    <option value="PAID">Paid</option>
                    <option value="OVERDUE">Overdue</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
                <div className={styles.stats}>
                    <span className="badge badge-primary">{invoices.length} Total</span>
                    <span className="badge badge-success">
                        {invoices.filter(i => i.status === 'PAID').length} Paid
                    </span>
                </div>
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Invoice #</th>
                            <th>Customer</th>
                            <th>Subscription</th>
                            <th>Due Date</th>
                            <th>Amount</th>
                            <th>Paid</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.length === 0 ? (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                                    No invoices found
                                </td>
                            </tr>
                        ) : (
                            filteredInvoices.map((inv) => (
                                <tr key={inv.id}>
                                    <td><strong>{inv.invoiceNumber}</strong></td>
                                    <td>
                                        <div>
                                            <strong>{inv.subscription.customer.user.firstName} {inv.subscription.customer.user.lastName}</strong>
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                                                {inv.subscription.customer.user.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{inv.subscription.subscriptionNumber}</td>
                                    <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
                                    <td>${inv.totalAmount.toFixed(2)}</td>
                                    <td>${getPaidAmount(inv.payments).toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(inv.status)}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => window.location.href = `/dashboard/invoices/${inv.id}`}
                                            >
                                                View
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => handleEdit(inv)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(inv.id, inv.invoiceNumber)}
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
                            <h2>{editingInvoice ? 'Edit Invoice' : 'Add New Invoice'}</h2>
                            <button className={styles.closeBtn} onClick={handleCloseModal}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                                <div className="form-group">
                                    <label className="form-label">Invoice Number *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.invoiceNumber}
                                        onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                                        placeholder="INV-001"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Subscription *</label>
                                    <select
                                        className="form-select"
                                        value={formData.subscriptionId}
                                        onChange={(e) => setFormData({ ...formData, subscriptionId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Subscription</option>
                                        {subscriptions.map((sub) => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.subscriptionNumber} - {sub.customer.user.firstName} {sub.customer.user.lastName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-lg)' }}>
                                <div className="form-group">
                                    <label className="form-label">Invoice Date *</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.invoiceDate}
                                        onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Due Date *</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Status *</label>
                                    <select
                                        className="form-select"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="DRAFT">Draft</option>
                                        <option value="SENT">Sent</option>
                                        <option value="PAID">Paid</option>
                                        <option value="OVERDUE">Overdue</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-lg)' }}>
                                <div className="form-group">
                                    <label className="form-label">Subtotal *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        value={formData.subtotal}
                                        onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Tax Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        value={formData.taxAmount}
                                        onChange={(e) => setFormData({ ...formData, taxAmount: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Total Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        value={formData.totalAmount}
                                        readOnly
                                        style={{ background: 'var(--gray-100)', fontWeight: '600' }}
                                    />
                                </div>
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : (editingInvoice ? 'Update Invoice' : 'Create Invoice')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
