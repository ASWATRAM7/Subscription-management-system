'use client';

import { useEffect, useState } from 'react';
import { useConfirm } from '@/app/components/ConfirmProvider';
import { useToast } from '@/app/components/ToastProvider';
import styles from '../products/products.module.css';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function UsersPage() {
    const { confirm } = useConfirm();
    const toast = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        role: 'CUSTOMER',
        password: '',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users');
            const data = await response.json();

            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                console.error('API returned error:', data);
                setUsers([]);
                toast.error('Failed to load users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (submitting) return;
        setSubmitting(true);

        try {
            const url = '/api/users';
            const method = editingUser ? 'PUT' : 'POST';
            const body = editingUser
                ? { ...formData, id: editingUser.id }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                await fetchUsers();
                handleCloseModal();
                toast.success(editingUser ? 'User updated successfully!' : 'User created successfully!');
            } else {
                toast.error('Failed to save user');
            }
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error('An error occurred while saving');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            password: '',
        });
        setShowModal(true);
    };

    const handleToggleActive = async (user: User) => {
        const action = user.isActive ? 'deactivate' : 'activate';
        const confirmed = await confirm({
            title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
            message: `Are you sure you want to ${action} ${user.firstName} ${user.lastName}?`,
            confirmText: action.charAt(0).toUpperCase() + action.slice(1),
            cancelText: 'Cancel',
            variant: user.isActive ? 'danger' : 'success',
        });

        if (!confirmed) return;

        try {
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isActive: !user.isActive,
                }),
            });

            if (response.ok) {
                await fetchUsers();
                toast.success(`User ${action}d successfully!`);
            } else {
                toast.error(`Failed to ${action} user`);
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
            toast.error('An error occurred');
        }
    };

    const handleDelete = async (id: string, userName: string) => {
        const confirmed = await confirm({
            title: 'Delete User',
            message: `Are you sure you want to delete ${userName}? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger',
        });

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/users?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchUsers();
                toast.success('User deleted successfully!');
            } else {
                toast.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('An error occurred while deleting');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData({
            email: '',
            firstName: '',
            lastName: '',
            role: 'CUSTOMER',
            password: '',
        });
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: string) => {
        const badges: Record<string, string> = {
            ADMIN: 'badge-danger',
            INTERNAL: 'badge-primary',
            CUSTOMER: 'badge-success',
        };
        return badges[role] || 'badge-gray';
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className="spinner"></div>
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>User Management</h1>
                    <p className={styles.subtitle}>Manage system users and permissions</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    ➕ Add User
                </button>
            </div>

            <div className={styles.toolbar}>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: '300px' }}
                />
                <select
                    className="form-select"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    style={{ maxWidth: '200px' }}
                >
                    <option value="ALL">All Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="INTERNAL">Internal</option>
                    <option value="CUSTOMER">Customer</option>
                </select>
                <div className={styles.stats}>
                    <span className="badge badge-primary">{users.length} Total</span>
                    <span className="badge badge-success">
                        {users.filter(u => u.isActive).length} Active
                    </span>
                    <span className="badge badge-danger">
                        {users.filter(u => u.role === 'ADMIN').length} Admins
                    </span>
                </div>
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Created</th>
                            <th>Last Updated</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <strong>{user.firstName} {user.lastName}</strong>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge ${getRoleBadge(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${user.isActive ? 'badge-success' : 'badge-gray'}`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => handleEdit(user)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className={`btn btn-sm ${user.isActive ? 'btn-warning' : 'btn-success'}`}
                                                onClick={() => handleToggleActive(user)}
                                            >
                                                {user.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(user.id, `${user.firstName} ${user.lastName}`)}
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
                            <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
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
                                    disabled={!!editingUser}
                                />
                                {editingUser && (
                                    <small style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>
                                        Email cannot be changed
                                    </small>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                                <div className="form-group">
                                    <label className="form-label">Role *</label>
                                    <select
                                        className="form-select"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="CUSTOMER">Customer</option>
                                        <option value="INTERNAL">Internal User</option>
                                        <option value="ADMIN">Administrator</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Password {editingUser ? '(leave blank to keep current)' : '*'}
                                    </label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required={!editingUser}
                                        placeholder={editingUser ? 'Leave blank to keep current' : 'Enter password'}
                                    />
                                </div>
                            </div>

                            <div className="alert alert-info" style={{ marginTop: 'var(--spacing-md)' }}>
                                <strong>Role Permissions:</strong>
                                <ul style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
                                    <li><strong>Admin:</strong> Full system access, can manage users and settings</li>
                                    <li><strong>Internal:</strong> Can manage customers, subscriptions, and invoices</li>
                                    <li><strong>Customer:</strong> Can view their own subscriptions and invoices</li>
                                </ul>
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
