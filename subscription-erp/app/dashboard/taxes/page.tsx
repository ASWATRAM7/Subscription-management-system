'use client';

import { useEffect, useState } from 'react';
import { useConfirm } from '@/app/components/ConfirmProvider';
import { useToast } from '@/app/components/ToastProvider';
import styles from '../products/products.module.css';

interface Tax {
    id: string;
    name: string;
    type: string;
    rate: number;
    isActive: boolean;
}

export default function TaxesPage() {
    const { confirm } = useConfirm();
    const toast = useToast();
    const [taxes, setTaxes] = useState<Tax[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTax, setEditingTax] = useState<Tax | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        type: 'PERCENTAGE',
        rate: '',
    });

    useEffect(() => {
        fetchTaxes();
    }, []);

    const fetchTaxes = async () => {
        try {
            const response = await fetch('/api/taxes');
            const data = await response.json();
            setTaxes(data);
        } catch (error) {
            console.error('Error fetching taxes:', error);
            toast.error('Failed to load taxes');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (submitting) return;
        setSubmitting(true);

        try {
            const url = '/api/taxes';
            const method = editingTax ? 'PUT' : 'POST';
            const body = editingTax
                ? { ...formData, id: editingTax.id }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                await fetchTaxes();
                handleCloseModal();
                toast.success(editingTax ? 'Tax updated successfully!' : 'Tax created successfully!');
            } else {
                toast.error('Failed to save tax');
            }
        } catch (error) {
            console.error('Error saving tax:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (tax: Tax) => {
        setEditingTax(tax);
        setFormData({
            name: tax.name,
            type: tax.type,
            rate: tax.rate.toString(),
        });
        setShowModal(true);
    };

    const handleToggleActive = async (tax: Tax) => {
        const action = tax.isActive ? 'deactivate' : 'activate';
        const confirmed = await confirm({
            title: `${action.charAt(0).toUpperCase() + action.slice(1)} Tax`,
            message: `Are you sure you want to ${action} the tax "${tax.name}"?`,
            confirmText: action.charAt(0).toUpperCase() + action.slice(1),
            cancelText: 'Cancel',
            variant: tax.isActive ? 'danger' : 'success',
        });

        if (!confirmed) return;

        try {
            const response = await fetch('/api/taxes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: tax.id,
                    name: tax.name,
                    type: tax.type,
                    rate: tax.rate,
                    isActive: !tax.isActive,
                }),
            });

            if (response.ok) {
                await fetchTaxes();
                toast.success(`Tax ${action}d successfully!`);
            } else {
                toast.error(`Failed to ${action} tax`);
            }
        } catch (error) {
            console.error('Error toggling tax status:', error);
            toast.error('An error occurred');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        const confirmed = await confirm({
            title: 'Delete Tax',
            message: `Are you sure you want to delete the tax "${name}"?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger',
        });

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/taxes?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchTaxes();
                toast.success('Tax deleted successfully!');
            } else {
                toast.error('Failed to delete tax');
            }
        } catch (error) {
            console.error('Error deleting tax:', error);
            toast.error('An error occurred while deleting');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTax(null);
        setFormData({
            name: '',
            type: 'PERCENTAGE',
            rate: '',
        });
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className="spinner"></div>
                <p>Loading taxes...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Tax Management</h1>
                    <p className={styles.subtitle}>Configure tax rules and rates</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    ➕ Add Tax Rule
                </button>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.stats}>
                    <span className="badge badge-primary">{taxes.length} Total</span>
                    <span className="badge badge-success">
                        {taxes.filter(t => t.isActive).length} Active
                    </span>
                </div>
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Tax Name</th>
                            <th>Type</th>
                            <th>Rate</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taxes.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                    No tax rules found
                                </td>
                            </tr>
                        ) : (
                            taxes.map((tax) => (
                                <tr key={tax.id}>
                                    <td><strong>{tax.name}</strong></td>
                                    <td>
                                        <span className="badge badge-gray">{tax.type}</span>
                                    </td>
                                    <td>
                                        {tax.type === 'PERCENTAGE' ? `${tax.rate}%` : `$${tax.rate.toFixed(2)}`}
                                    </td>
                                    <td>
                                        <span className={`badge ${tax.isActive ? 'badge-success' : 'badge-gray'}`}>
                                            {tax.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => handleEdit(tax)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className={`btn btn-sm ${tax.isActive ? 'btn-warning' : 'btn-success'}`}
                                                onClick={() => handleToggleActive(tax)}
                                            >
                                                {tax.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(tax.id, tax.name)}
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
                            <h2>{editingTax ? 'Edit Tax Rule' : 'Add New Tax Rule'}</h2>
                            <button className={styles.closeBtn} onClick={handleCloseModal}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Tax Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Sales Tax, VAT, GST"
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                                <div className="form-group">
                                    <label className="form-label">Type *</label>
                                    <select
                                        className="form-select"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="PERCENTAGE">Percentage</option>
                                        <option value="FIXED">Fixed Amount</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Rate * {formData.type === 'PERCENTAGE' ? '(%)' : '($)'}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        value={formData.rate}
                                        onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                                        placeholder={formData.type === 'PERCENTAGE' ? '10.00' : '5.00'}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="alert alert-info" style={{ marginTop: 'var(--spacing-md)' }}>
                                <strong>Note:</strong> {formData.type === 'PERCENTAGE'
                                    ? 'Percentage tax will be calculated as a percentage of the total amount.'
                                    : 'Fixed tax will be added as a flat amount to each transaction.'}
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : (editingTax ? 'Update Tax Rule' : 'Create Tax Rule')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
