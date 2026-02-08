'use client';

import { useEffect, useState } from 'react';
import { useConfirm } from '@/app/components/ConfirmProvider';
import { useToast } from '@/app/components/ToastProvider';
import styles from './discounts.module.css';

interface Discount {
    id: string;
    name: string;
    code: string;
    type: string;
    value: number;
    startDate: string;
    endDate: string | null;
    isActive: boolean;
    products: Array<{
        product: {
            name: string;
        };
    }>;
    subscriptions: Array<{
        subscription: {
            subscriptionNumber: string;
        };
    }>;
}

export default function DiscountsPage() {
    const { confirm } = useConfirm();
    const toast = useToast();
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        type: 'PERCENTAGE',
        value: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        isActive: true,
    });

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const fetchDiscounts = async () => {
        try {
            const response = await fetch('/api/discounts');
            const data = await response.json();

            if (Array.isArray(data)) {
                setDiscounts(data);
            } else {
                console.error('API returned error:', data);
                setDiscounts([]);
                toast.error('Failed to load discounts');
            }
        } catch (error) {
            console.error('Error fetching discounts:', error);
            setDiscounts([]);
            toast.error('Failed to load discounts');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (submitting) return;
        setSubmitting(true);

        try {
            const url = '/api/discounts';
            const method = editingDiscount ? 'PUT' : 'POST';
            const body = editingDiscount
                ? { ...formData, id: editingDiscount.id, value: parseFloat(formData.value) }
                : { ...formData, value: parseFloat(formData.value) };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                await fetchDiscounts();
                handleCloseModal();
                toast.success(editingDiscount ? 'Discount updated successfully!' : 'Discount created successfully!');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to save discount');
            }
        } catch (error) {
            console.error('Error saving discount:', error);
            toast.error('An error occurred while saving the discount');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (discount: Discount) => {
        setEditingDiscount(discount);
        setFormData({
            name: discount.name,
            code: discount.code,
            type: discount.type,
            value: discount.value.toString(),
            startDate: discount.startDate.split('T')[0],
            endDate: discount.endDate ? discount.endDate.split('T')[0] : '',
            isActive: discount.isActive,
        });
        setShowModal(true);
    };

    const handleToggleActive = async (discount: Discount) => {
        const action = discount.isActive ? 'deactivate' : 'activate';
        const confirmed = await confirm({
            title: `${action.charAt(0).toUpperCase() + action.slice(1)} Discount`,
            message: `Are you sure you want to ${action} the discount "${discount.name}"?`,
            confirmText: action.charAt(0).toUpperCase() + action.slice(1),
            cancelText: 'Cancel',
            variant: discount.isActive ? 'danger' : 'success',
        });

        if (!confirmed) return;

        try {
            const response = await fetch('/api/discounts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: discount.id,
                    name: discount.name,
                    code: discount.code,
                    type: discount.type,
                    value: discount.value,
                    startDate: discount.startDate,
                    endDate: discount.endDate,
                    isActive: !discount.isActive,
                }),
            });

            if (response.ok) {
                await fetchDiscounts();
                toast.success(`Discount ${action}d successfully!`);
            } else {
                toast.error(`Failed to ${action} discount`);
            }
        } catch (error) {
            console.error('Error toggling discount status:', error);
            toast.error('An error occurred');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        const confirmed = await confirm({
            title: 'Delete Discount',
            message: `Are you sure you want to delete the discount "${name}"? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger',
        });

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/discounts?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchDiscounts();
                toast.success('Discount deleted successfully!');
            } else {
                toast.error('Failed to delete discount');
            }
        } catch (error) {
            console.error('Error deleting discount:', error);
            toast.error('An error occurred while deleting');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingDiscount(null);
        setFormData({
            name: '',
            code: '',
            type: 'PERCENTAGE',
            value: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            isActive: true,
        });

    };

    const filteredDiscounts = discounts.filter(disc =>
        disc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disc.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isExpired = (endDate: string | null) => {
        if (!endDate) return false;
        return new Date(endDate) < new Date();
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className="spinner"></div>
                <p>Loading discounts...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Discount Management</h1>
                    <p className={styles.subtitle}>Create and manage promotional codes and special offers</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 4v16m8-8H4" />
                    </svg>
                    Add Discount
                </button>
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.searchWrapper}>
                    <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search by name or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.stats}>
                    <div className={styles.statBadge}>
                        <span className={styles.statValue}>{discounts.length}</span>
                        <span className={styles.statLabel}>Total</span>
                    </div>
                    <div className={`${styles.statBadge} ${styles.statSuccess}`}>
                        <span className={styles.statValue}>{discounts.filter(d => d.isActive && !isExpired(d.endDate)).length}</span>
                        <span className={styles.statLabel}>Active</span>
                    </div>
                    <div className={`${styles.statBadge} ${styles.statWarning}`}>
                        <span className={styles.statValue}>{discounts.filter(d => isExpired(d.endDate)).length}</span>
                        <span className={styles.statLabel}>Expired</span>
                    </div>
                </div>
            </div>

            {/* Discounts Grid */}
            <div className={styles.discountsGrid}>
                {filteredDiscounts.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>🎁</div>
                        <h3>No Discounts Found</h3>
                        <p>Create your first discount to start offering promotions to your customers</p>
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                            Create Discount
                        </button>
                    </div>
                ) : (
                    filteredDiscounts.map((disc, index) => (
                        <div
                            key={disc.id}
                            className={`${styles.discountCard} ${!disc.isActive || isExpired(disc.endDate) ? styles.inactive : ''}`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.discountBadge}>
                                    <span className={styles.discountValue}>
                                        {disc.type === 'PERCENTAGE' ? `${disc.value}%` : `$${disc.value.toFixed(2)}`}
                                    </span>
                                    <span className={styles.discountType}>
                                        {disc.type === 'PERCENTAGE' ? 'OFF' : 'DISCOUNT'}
                                    </span>
                                </div>
                                <div className={styles.statusBadges}>
                                    {isExpired(disc.endDate) ? (
                                        <span className="badge badge-error">Expired</span>
                                    ) : (
                                        <span className={`badge ${disc.isActive ? 'badge-success' : 'badge-gray'}`}>
                                            {disc.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className={styles.cardBody}>
                                <h3 className={styles.discountName}>{disc.name}</h3>
                                <div className={styles.discountCode}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                        <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                                        <polyline points="7.5 19.79 7.5 14.6 3 12" />
                                        <polyline points="21 12 16.5 14.6 16.5 19.79" />
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                        <line x1="12" y1="22.08" x2="12" y2="12" />
                                    </svg>
                                    <code>{disc.code}</code>
                                </div>

                                <div className={styles.discountDates}>
                                    <div className={styles.dateItem}>
                                        <span className={styles.dateLabel}>Start:</span>
                                        <span className={styles.dateValue}>
                                            {new Date(disc.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    {disc.endDate && (
                                        <div className={styles.dateItem}>
                                            <span className={styles.dateLabel}>End:</span>
                                            <span className={`${styles.dateValue} ${isExpired(disc.endDate) ? styles.expired : ''}`}>
                                                {new Date(disc.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.usageStats}>
                                    <div className={styles.usageItem}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        <span>{disc.products.length} products</span>
                                    </div>
                                    <div className={styles.usageItem}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                        </svg>
                                        <span>{disc.subscriptions.length} subscriptions</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.cardActions}>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handleEdit(disc)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    className={`btn btn-sm ${disc.isActive ? 'btn-ghost' : 'btn-success'}`}
                                    onClick={() => handleToggleActive(disc)}
                                    disabled={isExpired(disc.endDate)}
                                >
                                    {disc.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(disc.id, disc.name)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className={styles.modal} onClick={handleCloseModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div>
                                <h2>{editingDiscount ? 'Edit Discount' : 'Create New Discount'}</h2>
                                <p>Configure your promotional offer</p>
                            </div>
                            <button className={styles.closeBtn} onClick={handleCloseModal}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGrid}>
                                <div className="form-group">
                                    <label className="form-label">Discount Name *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Summer Sale 2024"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Discount Code *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        placeholder="e.g., SUMMER2024"
                                        required
                                        style={{ textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em' }}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGrid}>
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
                                        Value * {formData.type === 'PERCENTAGE' ? '(%)' : '($)'}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max={formData.type === 'PERCENTAGE' ? '100' : undefined}
                                        className="form-input"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        placeholder={formData.type === 'PERCENTAGE' ? '25' : '10.00'}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formGrid}>
                                <div className="form-group">
                                    <label className="form-label">Start Date *</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">End Date (Optional)</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        min={formData.startDate}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className={styles.checkbox}>
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    <span>Active (discount can be used immediately)</span>
                                </label>
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : (editingDiscount ? 'Update Discount' : 'Create Discount')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
