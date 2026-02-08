'use client';

import { useEffect, useState } from 'react';
import { useConfirm } from '@/app/components/ConfirmProvider';
import { useToast } from '@/app/components/ToastProvider';
import styles from '../products/products.module.css';

interface Plan {
    id: string;
    name: string;
    billingPeriod: string;
    price: number;
    description: string | null;
    autoClose: boolean;
    closable: boolean;
    pausable: boolean;
    renewable: boolean;
    isActive: boolean;
    _count: {
        subscriptions: number;
    };
}

export default function PlansPage() {
    const { confirm } = useConfirm();
    const toast = useToast();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        billingPeriod: 'MONTHLY',
        price: '',
        description: '',
        autoClose: false,
        closable: true,
        pausable: true,
        renewable: true,
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await fetch('/api/plans');
            const data = await response.json();
            setPlans(data);
        } catch (error) {
            console.error('Error fetching plans:', error);
            toast.error('Failed to load plans');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (submitting) return;
        setSubmitting(true);

        try {
            const url = '/api/plans';
            const method = editingPlan ? 'PUT' : 'POST';
            const body = editingPlan
                ? { ...formData, id: editingPlan.id }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                await fetchPlans();
                handleCloseModal();
                toast.success(editingPlan ? 'Plan updated successfully!' : 'Plan created successfully!');
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to save plan');
            }
        } catch (error) {
            console.error('Error saving plan:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (plan: Plan) => {
        setEditingPlan(plan);
        setFormData({
            name: plan.name,
            billingPeriod: plan.billingPeriod,
            price: plan.price.toString(),
            description: plan.description || '',
            autoClose: plan.autoClose,
            closable: plan.closable,
            pausable: plan.pausable,
            renewable: plan.renewable,
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string, name: string) => {
        const confirmed = await confirm({
            title: 'Delete Plan',
            message: `Are you sure you want to delete the plan "${name}"?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger',
        });

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/plans?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchPlans();
                toast.success('Plan deleted successfully!');
            } else {
                toast.error('Failed to delete plan');
            }
        } catch (error) {
            console.error('Error deleting plan:', error);
            toast.error('An error occurred while deleting');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingPlan(null);
        setFormData({
            name: '',
            billingPeriod: 'MONTHLY',
            price: '',
            description: '',
            autoClose: false,
            closable: true,
            pausable: true,
            renewable: true,
        });
    };

    const filteredPlans = plans.filter(plan =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className="spinner"></div>
                <p>Loading plans...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Recurring Plans</h1>
                    <p className={styles.subtitle}>Manage billing plans and cycles</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    ➕ Add Plan
                </button>
            </div>

            <div className={styles.toolbar}>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Search plans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: '400px' }}
                />
                <div className={styles.stats}>
                    <span className="badge badge-primary">{plans.length} Total</span>
                    <span className="badge badge-success">
                        {plans.filter(p => p.isActive).length} Active
                    </span>
                </div>
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Plan Name</th>
                            <th>Billing Period</th>
                            <th>Price</th>
                            <th>Subscriptions</th>
                            <th>Options</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPlans.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                                    No plans found
                                </td>
                            </tr>
                        ) : (
                            filteredPlans.map((plan) => (
                                <tr key={plan.id}>
                                    <td>
                                        <div>
                                            <strong>{plan.name}</strong>
                                            {plan.description && (
                                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                                                    {plan.description}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-primary">{plan.billingPeriod}</span>
                                    </td>
                                    <td>${plan.price.toFixed(2)}</td>
                                    <td>
                                        <span className="badge badge-gray">{plan._count.subscriptions}</span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px', fontSize: '0.75rem' }}>
                                            {plan.closable && <span className="badge badge-gray">Closable</span>}
                                            {plan.pausable && <span className="badge badge-gray">Pausable</span>}
                                            {plan.renewable && <span className="badge badge-gray">Renewable</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${plan.isActive ? 'badge-success' : 'badge-gray'}`}>
                                            {plan.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => handleEdit(plan)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(plan.id, plan.name)}
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
                            <h2>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</h2>
                            <button className={styles.closeBtn} onClick={handleCloseModal}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Plan Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                                <div className="form-group">
                                    <label className="form-label">Billing Period *</label>
                                    <select
                                        className="form-select"
                                        value={formData.billingPeriod}
                                        onChange={(e) => setFormData({ ...formData, billingPeriod: e.target.value })}
                                    >
                                        <option value="DAILY">Daily</option>
                                        <option value="WEEKLY">Weekly</option>
                                        <option value="MONTHLY">Monthly</option>
                                        <option value="YEARLY">Yearly</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Price *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ fontWeight: '600', marginBottom: 'var(--spacing-md)', display: 'block' }}>
                                    Plan Options
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                    <label className="checkbox" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.closable}
                                            onChange={(e) => setFormData({ ...formData, closable: e.target.checked })}
                                        />
                                        <span>Closable</span>
                                    </label>
                                    <label className="checkbox" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.pausable}
                                            onChange={(e) => setFormData({ ...formData, pausable: e.target.checked })}
                                        />
                                        <span>Pausable</span>
                                    </label>
                                    <label className="checkbox" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.renewable}
                                            onChange={(e) => setFormData({ ...formData, renewable: e.target.checked })}
                                        />
                                        <span>Renewable</span>
                                    </label>
                                    <label className="checkbox" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.autoClose}
                                            onChange={(e) => setFormData({ ...formData, autoClose: e.target.checked })}
                                        />
                                        <span>Auto Close</span>
                                    </label>
                                </div>
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : (editingPlan ? 'Update Plan' : 'Create Plan')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
