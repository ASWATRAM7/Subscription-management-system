'use client';

import { useEffect, useState } from 'react';
import { useConfirm } from '@/app/components/ConfirmProvider';
import { useToast } from '@/app/components/ToastProvider';
import styles from '../products/products.module.css';

interface Customer {
    id: string;
    companyName: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
    };
    subscriptions: Array<{
        id: string;
        status: string;
        totalAmount: number;
    }>;
}

export default function CustomersPage() {
    const { confirm } = useConfirm();
    const toast = useToast();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        companyName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch('/api/customers');
            const data = await response.json();

            // Check if data is an array (successful response)
            if (Array.isArray(data)) {
                setCustomers(data);
            } else {
                console.error('API returned error:', data);
                setCustomers([]);
                toast.error('Failed to load customers');
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            setCustomers([]);
            toast.error('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (submitting) return;
        setSubmitting(true);

        try {
            const url = '/api/customers';
            const method = editingCustomer ? 'PUT' : 'POST';
            const body = editingCustomer
                ? { ...formData, id: editingCustomer.id }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                await fetchCustomers();
                handleCloseModal();
                toast.success(editingCustomer ? 'Customer updated successfully!' : 'Customer created successfully!');
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to save customer');
            }
        } catch (error) {
            console.error('Error saving customer:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setFormData({
            email: customer.user.email,
            firstName: customer.user.firstName,
            lastName: customer.user.lastName,
            companyName: customer.companyName || '',
            phone: customer.phone || '',
            address: customer.address || '',
            city: customer.city || '',
            state: customer.state || '',
            postalCode: customer.postalCode || '',
            country: customer.country || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string, name: string) => {
        const confirmed = await confirm({
            title: 'Delete Customer',
            message: `Are you sure you want to delete ${name}? This will also delete their user account.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger',
        });

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/customers?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchCustomers();
                toast.success('Customer deleted successfully!');
            } else {
                toast.error('Failed to delete customer');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            toast.error('An error occurred while deleting');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCustomer(null);
        setFormData({
            email: '',
            firstName: '',
            lastName: '',
            companyName: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
        });
    };

    const filteredCustomers = customers.filter(customer =>
        customer.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTotalRevenue = (subs: Customer['subscriptions']) => {
        return subs.reduce((sum, sub) => sum + sub.totalAmount, 0);
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className="spinner"></div>
                <p>Loading customers...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Customers</h1>
                    <p className={styles.subtitle}>Manage customer accounts and profiles</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    ➕ Add Customer
                </button>
            </div>

            <div className={styles.toolbar}>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: '400px' }}
                />
                <div className={styles.stats}>
                    <span className="badge badge-primary">{customers.length} Total</span>
                    <span className="badge badge-success">
                        {customers.filter(c => c.user.isActive).length} Active
                    </span>
                </div>
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Company</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Subscriptions</th>
                            <th>Total Revenue</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.length === 0 ? (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                                    No customers found
                                </td>
                            </tr>
                        ) : (
                            filteredCustomers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>
                                        <strong>{customer.user.firstName} {customer.user.lastName}</strong>
                                    </td>
                                    <td>{customer.companyName || '-'}</td>
                                    <td>{customer.user.email}</td>
                                    <td>{customer.phone || '-'}</td>
                                    <td>
                                        <span className="badge badge-primary">{customer.subscriptions.length}</span>
                                    </td>
                                    <td>${getTotalRevenue(customer.subscriptions).toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${customer.user.isActive ? 'badge-success' : 'badge-gray'}`}>
                                            {customer.user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => handleEdit(customer)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(customer.id, `${customer.user.firstName} ${customer.user.lastName}`)}
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
                            <h2>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
                            <button className={styles.closeBtn} onClick={handleCloseModal}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                                <div className="form-group">
                                    <label className="form-label">First Name *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Last Name *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email *</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    disabled={!!editingCustomer}
                                />
                                {editingCustomer && (
                                    <small style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>
                                        Email cannot be changed
                                    </small>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                                <div className="form-group">
                                    <label className="form-label">Company Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Address</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-lg)' }}>
                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">State</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Postal Code</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.postalCode}
                                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Country</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                />
                            </div>

                            {!editingCustomer && (
                                <div className="alert alert-info" style={{ marginTop: 'var(--spacing-md)' }}>
                                    <strong>Note:</strong> Default password will be set to "Customer@123". Customer can change it after first login.
                                </div>
                            )}

                            <div className={styles.modalActions}>
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : (editingCustomer ? 'Update Customer' : 'Create Customer')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
