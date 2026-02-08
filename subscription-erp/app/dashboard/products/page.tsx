'use client';

import { useEffect, useState } from 'react';
import { useConfirm } from '@/app/components/ConfirmProvider';
import { useToast } from '@/app/components/ToastProvider';
import styles from './products.module.css';

interface Product {
    id: string;
    name: string;
    type: string;
    description: string | null;
    salesPrice: number;
    costPrice: number;
    isActive: boolean;
    variants: any[];
    _count: {
        subscriptionLines: number;
    };
}

export default function ProductsPage() {
    const { confirm } = useConfirm();
    const toast = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        type: 'SERVICE',
        description: '',
        salesPrice: '',
        costPrice: '',
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (submitting) return;
        setSubmitting(true);

        try {
            const url = '/api/products';
            const method = editingProduct ? 'PUT' : 'POST';
            const body = editingProduct
                ? { ...formData, id: editingProduct.id }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                await fetchProducts();
                handleCloseModal();
                toast.success(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
            } else {
                toast.error('Failed to save product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('An error occurred while saving product');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            type: product.type,
            description: product.description || '',
            salesPrice: product.salesPrice.toString(),
            costPrice: product.costPrice.toString(),
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string, name: string) => {
        const confirmed = await confirm({
            title: 'Delete Product',
            message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger',
        });

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/products?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchProducts();
                toast.success('Product deleted successfully!');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('An error occurred while deleting');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setFormData({
            name: '',
            type: 'SERVICE',
            description: '',
            salesPrice: '',
            costPrice: '',
        });
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className="spinner"></div>
                <p>Loading products...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Products</h1>
                    <p className={styles.subtitle}>Manage your product catalog</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    ➕ Add Product
                </button>
            </div>

            <div className={styles.toolbar}>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: '400px' }}
                />
                <div className={styles.stats}>
                    <span className="badge badge-primary">{products.length} Total</span>
                    <span className="badge badge-success">
                        {products.filter(p => p.isActive).length} Active
                    </span>
                </div>
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Type</th>
                            <th>Sales Price</th>
                            <th>Cost Price</th>
                            <th>Margin</th>
                            <th>Variants</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                                    No products found
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((product) => {
                                const margin = ((product.salesPrice - product.costPrice) / product.salesPrice * 100).toFixed(1);
                                return (
                                    <tr key={product.id}>
                                        <td>
                                            <div>
                                                <strong>{product.name}</strong>
                                                {product.description && (
                                                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                                                        {product.description}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-gray">{product.type}</span>
                                        </td>
                                        <td>${product.salesPrice.toFixed(2)}</td>
                                        <td>${product.costPrice.toFixed(2)}</td>
                                        <td>
                                            <span className={`badge ${parseFloat(margin) > 50 ? 'badge-success' : 'badge-warning'}`}>
                                                {margin}%
                                            </span>
                                        </td>
                                        <td>{product.variants.length}</td>
                                        <td>
                                            <span className={`badge ${product.isActive ? 'badge-success' : 'badge-gray'}`}>
                                                {product.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => handleEdit(product)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button className={styles.closeBtn} onClick={handleCloseModal}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Product Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Type</label>
                                <select
                                    className="form-select"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="SERVICE">Service</option>
                                    <option value="CONSUMABLE">Consumable</option>
                                    <option value="STORABLE">Storable</option>
                                </select>
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

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                                <div className="form-group">
                                    <label className="form-label">Sales Price *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        value={formData.salesPrice}
                                        onChange={(e) => setFormData({ ...formData, salesPrice: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Cost Price *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        value={formData.costPrice}
                                        onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
