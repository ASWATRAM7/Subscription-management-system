'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConfirm } from '@/app/components/ConfirmProvider';
import { useToast } from '@/app/components/ToastProvider';
import styles from '../products/products.module.css';

interface Subscription {
    id: string;
    subscriptionNumber: string;
    startDate: string;
    endDate: string | null;
    status: string;
    totalAmount: number;
    customer: {
        user: {
            firstName: string;
            lastName: string;
            email: string;
        };
    };
    recurringPlan: {
        name: string;
        billingPeriod: string;
    } | null;
}

interface Customer {
    id: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

interface Plan {
    id: string;
    name: string;
    billingPeriod: string;
    price: number;
}

export default function SubscriptionsPage() {
    const router = useRouter();
    const { confirm } = useConfirm();
    const toast = useToast();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const response = await fetch('/api/subscriptions');
            const data = await response.json();
            if (Array.isArray(data)) {
                setSubscriptions(data);
            } else {
                console.error('API Error:', data);
                setSubscriptions([]);
                toast.error('Failed to load subscriptions');
            }
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            setSubscriptions([]);
            toast.error('Failed to load subscriptions');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        router.push('/dashboard/subscriptions/new');
    };

    const handleEdit = (id: string) => {
        router.push(`/dashboard/subscriptions/${id}`);
    };

    const handleDelete = async (id: string, number: string) => {
        const confirmed = await confirm({
            title: 'Delete Subscription',
            message: `Are you sure you want to delete subscription #${number}?`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger',
        });

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/subscriptions?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchSubscriptions();
                toast.success('Subscription deleted successfully!');
            } else {
                toast.error('Failed to delete subscription');
            }
        } catch (error) {
            console.error('Error deleting subscription:', error);
            toast.error('An error occurred while deleting');
        }
    };

    const filteredSubscriptions = subscriptions.filter(sub => {
        const matchesSearch =
            sub.subscriptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${sub.customer.user.firstName} ${sub.customer.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        const badges: Record<string, string> = {
            DRAFT: 'badge-gray',
            ACTIVE: 'badge-success',
            PAUSED: 'badge-warning',
            CANCELLED: 'badge-danger',
            CLOSED: 'badge-gray',
        };
        return badges[status] || 'badge-gray';
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className="spinner"></div>
                <p>Loading subscriptions...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Subscriptions</h1>
                    <p className={styles.subtitle}>Manage customer subscriptions</p>
                </div>
                <button className="btn btn-primary" onClick={handleCreate}>
                    ➕ Add Subscription
                </button>
            </div>

            <div className={styles.toolbar}>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Search subscriptions..."
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
                    <option value="ACTIVE">Active</option>
                    <option value="PAUSED">Paused</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="CLOSED">Closed</option>
                </select>
                <div className={styles.stats}>
                    <span className="badge badge-primary">{subscriptions.length} Total</span>
                    <span className="badge badge-success">
                        {subscriptions.filter(s => s.status === 'ACTIVE').length} Active
                    </span>
                </div>
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Subscription #</th>
                            <th>Customer</th>
                            <th>Plan</th>
                            <th>Start Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSubscriptions.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                                    No subscriptions found
                                </td>
                            </tr>
                        ) : (
                            filteredSubscriptions.map((sub) => (
                                <tr key={sub.id}>
                                    <td><strong>{sub.subscriptionNumber}</strong></td>
                                    <td>
                                        <div>
                                            <strong>{sub.customer.user.firstName} {sub.customer.user.lastName}</strong>
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                                                {sub.customer.user.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {sub.recurringPlan ? (
                                            <div>
                                                {sub.recurringPlan.name}
                                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                                                    {sub.recurringPlan.billingPeriod}
                                                </div>
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td>{new Date(sub.startDate).toLocaleDateString()}</td>
                                    <td>${sub.totalAmount.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(sub.status)}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => handleEdit(sub.id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(sub.id, sub.subscriptionNumber)}
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
            {/* Modal removed - using detail page instead */}
        </div>
    );
}
