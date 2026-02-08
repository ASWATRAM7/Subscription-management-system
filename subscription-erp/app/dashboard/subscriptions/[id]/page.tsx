'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useConfirm } from '@/app/components/ConfirmProvider';
import { useToast } from '@/app/components/ToastProvider';
import styles from '../../products/products.module.css';

interface Product {
    id: string;
    name: string;
    description: string | null;
    salesPrice: number;
}

interface SubscriptionLine {
    id?: string;
    productId: string;
    productName: string; // For display
    description: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

interface Subscription {
    id: string;
    subscriptionNumber: string;
    customerId: string;
    planId: string;
    startDate: string;
    endDate: string | null;
    status: string;
    totalAmount: number;
    lines: SubscriptionLine[];
    customer?: {
        id: string;
        user: {
            firstName: string;
            lastName: string;
        };
    };
    plan?: {
        name: string;
    };
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

export default function SubscriptionFormPage() {
    const router = useRouter();
    const params = useParams();
    const { confirm } = useConfirm();
    const toast = useToast();
    const id = params?.id as string;
    const isNew = id === 'new';

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Data Sources
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    // Form State
    const [formData, setFormData] = useState<Subscription>({
        id: '',
        subscriptionNumber: 'Draft',
        customerId: '',
        planId: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: null,
        status: 'DRAFT',
        totalAmount: 0,
        lines: [],
    });

    // Active Tab
    const [activeTab, setActiveTab] = useState('lines');

    useEffect(() => {
        const init = async () => {
            await fetchDependencies();
            if (!isNew && id) {
                await fetchSubscription();
            } else {
                setLoading(false);
            }
        };
        init();
    }, [id, isNew]);

    const fetchDependencies = async () => {
        try {
            const [custRes, planRes, prodRes] = await Promise.all([
                fetch('/api/customers'),
                fetch('/api/plans'),
                fetch('/api/products')
            ]);

            if (custRes.ok) setCustomers(await custRes.json());
            if (planRes.ok) setPlans(await planRes.json());
            if (prodRes.ok) setProducts(await prodRes.json());
        } catch (error) {
            console.error('Error fetching dependencies:', error);
        }
    };

    const fetchSubscription = async () => {
        try {
            const response = await fetch(`/api/subscriptions?id=${id}`);
            if (response.ok) {
                const data = await response.json();
                // API might return array or object depending on filter logic
                // Previous logic assumed array. Let's handle both.
                const sub = Array.isArray(data) ? data[0] : data;

                if (sub && sub.id) {
                    setFormData({
                        ...sub,
                        customerId: sub.customerId || '',
                        planId: sub.planId || sub.recurringPlanId || '',
                        startDate: sub.startDate ? sub.startDate.split('T')[0] : '',
                        endDate: sub.endDate ? sub.endDate.split('T')[0] : null,
                        lines: sub.lines ? sub.lines.map((line: any) => ({
                            id: line.id,
                            productId: line.productId || (line.product ? line.product.id : ''),
                            productName: line.product ? line.product.name : 'Unknown Product',
                            description: line.product?.description || '',
                            quantity: line.quantity || 1,
                            unitPrice: line.unitPrice || 0,
                            subtotal: (line.quantity || 1) * (line.unitPrice || 0)
                        })) : []
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching subscription:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (field: keyof Subscription, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLineChange = (index: number, field: keyof SubscriptionLine, value: any) => {
        const newLines = [...formData.lines];
        const line = { ...newLines[index], [field]: value };

        if (field === 'quantity' || field === 'unitPrice') {
            line.subtotal = line.quantity * line.unitPrice;
        }

        if (field === 'productId') {
            const product = products.find(p => p.id === value);
            if (product) {
                line.productName = product.name;
                line.description = product.description || product.name || '';
                line.unitPrice = product.salesPrice || 0;
                line.subtotal = line.quantity * (product.salesPrice || 0);
            }
        }

        newLines[index] = line;

        const newTotal = newLines.reduce((sum, l) => sum + l.subtotal, 0);
        setFormData(prev => ({ ...prev, lines: newLines, totalAmount: newTotal }));
    };

    const addLine = () => {
        setFormData(prev => ({
            ...prev,
            lines: [...prev.lines, {
                productId: '',
                productName: '',
                description: '',
                quantity: 1,
                unitPrice: 0,
                subtotal: 0
            }]
        }));
    };

    const removeLine = (index: number) => {
        const newLines = formData.lines.filter((_, i) => i !== index);
        const newTotal = newLines.reduce((sum, l) => sum + l.subtotal, 0);
        setFormData(prev => ({ ...prev, lines: newLines, totalAmount: newTotal }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const url = '/api/subscriptions';
            const method = isNew ? 'POST' : 'PUT';
            const body = {
                ...formData,
                id: isNew ? undefined : formData.id,
                // Ensure number types
                totalAmount: Number(formData.totalAmount),
            };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const saved = await response.json();
                toast.success('Subscription saved successfully!');
                if (isNew) {
                    router.push(`/dashboard/subscriptions/${saved.id}`);
                }
            } else {
                const err = await response.json();
                toast.error(err.error || 'Failed to save');
            }
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('An unexpected error occurred.');
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        const confirmed = await confirm({
            title: 'Change Status',
            message: `Are you sure you want to change the status to ${newStatus}?`,
            confirmText: 'Yes',
            cancelText: 'Cancel',
        });

        if (!confirmed) return;

        setSaving(true);
        try {
            const url = '/api/subscriptions';
            const body = {
                ...formData,
                status: newStatus,
                totalAmount: Number(formData.totalAmount),
            };

            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                setFormData(prev => ({ ...prev, status: newStatus }));
                toast.success(`Subscription status updated to ${newStatus}`);
            } else {
                const err = await response.json();
                toast.error(err.error || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('An unexpected error occurred.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header} style={{ marginBottom: '1rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                    <span style={{ cursor: 'pointer' }} onClick={() => router.push('/dashboard/subscriptions')}>Subscriptions</span>
                    <span>/</span>
                    <span style={{ color: '#000', fontWeight: 500 }}>{isNew ? 'New' : formData.subscriptionNumber}</span>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button className="btn btn-secondary" onClick={() => router.push('/dashboard/subscriptions')}>
                        Discard
                    </button>
                    {!isNew && (
                        <>
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleStatusChange('QUOTATION')}
                                disabled={saving || formData.status !== 'DRAFT'}
                            >
                                Send to Customer
                            </button>
                            {formData.status === 'QUOTATION' && (
                                <button
                                    className="btn btn-secondary"
                                    style={{ background: '#e0f2f1', color: '#00695c' }}
                                    onClick={() => handleStatusChange('RUNNING')}
                                    disabled={saving}
                                >
                                    Confirm
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* Status Pipeline */}
                <div style={{ display: 'flex', background: '#f5f5f5', borderRadius: '20px', overflow: 'hidden', border: '1px solid #ddd' }}>
                    {['DRAFT', 'QUOTATION', 'RUNNING', 'CLOSED'].map((step, idx) => (
                        <div key={step} style={{
                            padding: '0.5rem 1rem',
                            background: step === formData.status ? '#0070f3' : '#fff',
                            color: step === formData.status ? '#fff' : '#666',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            borderRight: idx !== 3 ? '1px solid #ddd' : 'none',
                            cursor: 'default'
                        }}>
                            {step}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Form */}
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Customer</label>
                            <select
                                className="form-select"
                                value={formData.customerId}
                                onChange={(e) => handleFieldChange('customerId', e.target.value)}
                            >
                                <option value="">Select Customer...</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>{c.user.firstName} {c.user.lastName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Subscription Plan</label>
                            <select
                                className="form-select"
                                value={formData.planId}
                                onChange={(e) => handleFieldChange('planId', e.target.value)}
                            >
                                <option value="">Select Plan...</option>
                                {plans.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.billingPeriod})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Start Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={formData.startDate}
                                onChange={(e) => handleFieldChange('startDate', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={formData.endDate || ''}
                                onChange={(e) => handleFieldChange('endDate', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Tabs Header */}
                <div style={{ borderBottom: '1px solid #e0e0e0', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <button
                            style={{
                                padding: '0.5rem 0',
                                borderBottom: activeTab === 'lines' ? '2px solid #0070f3' : '2px solid transparent',
                                color: activeTab === 'lines' ? '#0070f3' : '#666',
                                background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500
                            }}
                            onClick={() => setActiveTab('lines')}
                        >
                            Subscription Lines
                        </button>
                        <button
                            style={{
                                padding: '0.5rem 0',
                                borderBottom: activeTab === 'info' ? '2px solid #0070f3' : '2px solid transparent',
                                color: activeTab === 'info' ? '#0070f3' : '#666',
                                background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500
                            }}
                            onClick={() => setActiveTab('info')}
                        >
                            Other Info
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'lines' && (
                    <div>
                        <table className="table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
                            <thead>
                                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e0e0e0', textAlign: 'left' }}>
                                    <th style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#666' }}>Product</th>
                                    <th style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#666' }}>Description</th>
                                    <th style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#666', width: '100px' }}>Quantity</th>
                                    <th style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#666', width: '120px' }}>Unit Price</th>
                                    <th style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#666', width: '120px' }}>Subtotal</th>
                                    <th style={{ width: '50px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.lines.map((line, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '0.5rem' }}>
                                            <select
                                                className="form-select"
                                                style={{ fontSize: '0.9rem', padding: '0.4rem', width: '100%' }}
                                                value={line.productId}
                                                onChange={(e) => handleLineChange(idx, 'productId', e.target.value)}
                                            >
                                                <option value="">Select Product...</option>
                                                {products.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td style={{ padding: '0.5rem' }}>
                                            <input
                                                type="text"
                                                className="form-input"
                                                style={{ fontSize: '0.9rem', padding: '0.4rem', width: '100%' }}
                                                value={line.description}
                                                onChange={(e) => handleLineChange(idx, 'description', e.target.value)}
                                            />
                                        </td>
                                        <td style={{ padding: '0.5rem' }}>
                                            <input
                                                type="number"
                                                className="form-input"
                                                style={{ fontSize: '0.9rem', padding: '0.4rem', width: '100%' }}
                                                value={line.quantity}
                                                onChange={(e) => handleLineChange(idx, 'quantity', parseFloat(e.target.value))}
                                            />
                                        </td>
                                        <td style={{ padding: '0.5rem' }}>
                                            <input
                                                type="number"
                                                className="form-input"
                                                style={{ fontSize: '0.9rem', padding: '0.4rem', width: '100%' }}
                                                value={line.unitPrice}
                                                readOnly
                                                onChange={(e) => handleLineChange(idx, 'unitPrice', parseFloat(e.target.value))}
                                            />
                                        </td>
                                        <td style={{ padding: '0.5rem', fontWeight: 500 }}>
                                            ${line.subtotal.toFixed(2)}
                                        </td>
                                        <td style={{ padding: '0.5rem' }}>
                                            <button
                                                onClick={() => removeLine(idx)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <button
                            onClick={addLine}
                            style={{
                                color: '#0070f3', background: 'none', border: 'none',
                                cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem'
                            }}
                        >
                            + Add Line
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                            <div style={{ width: '300px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <span>Untaxed Amount:</span>
                                    <span>${formData.totalAmount.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e0e0e0', paddingTop: '0.5rem', fontWeight: 600, fontSize: '1.1rem' }}>
                                    <span>Total:</span>
                                    <span>${formData.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'info' && (
                    <div style={{ padding: '1rem', color: '#666' }}>
                        <p>Additional configuration.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
