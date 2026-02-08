'use client';

export default function ReportsPage() {
    return (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1>Reports & Analytics</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                    Business insights and performance metrics
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-2xl)' }}>
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">📊 Revenue Overview</h3>
                    </div>
                    <div className="card-body">
                        <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: 'var(--spacing-sm)' }}>
                            $45,678.90
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            Total revenue this month
                        </p>
                        <div style={{ marginTop: 'var(--spacing-lg)' }}>
                            <span className="badge badge-success">+23% from last month</span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">📋 Active Subscriptions</h3>
                    </div>
                    <div className="card-body">
                        <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: 'var(--spacing-sm)' }}>
                            24
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            Currently active subscriptions
                        </p>
                        <div style={{ marginTop: 'var(--spacing-lg)' }}>
                            <span className="badge badge-primary">+12% growth</span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">💰 MRR</h3>
                    </div>
                    <div className="card-body">
                        <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: 'var(--spacing-sm)' }}>
                            $12,450
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            Monthly Recurring Revenue
                        </p>
                        <div style={{ marginTop: 'var(--spacing-lg)' }}>
                            <span className="badge badge-success">+18% increase</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">📈 Revenue Trend</h3>
                </div>
                <div className="card-body">
                    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ color: 'var(--text-tertiary)' }}>Chart visualization will be implemented here</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-lg)', marginTop: 'var(--spacing-2xl)' }}>
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Top Products</h3>
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            {[
                                { name: 'Cloud Storage Pro', revenue: 12500, subscriptions: 8 },
                                { name: 'Email Marketing Suite', revenue: 8900, subscriptions: 6 },
                                { name: 'CRM Software', revenue: 15600, subscriptions: 5 },
                            ].map((product, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--spacing-md)', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                                    <div>
                                        <strong>{product.name}</strong>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                                            {product.subscriptions} subscriptions
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: '600' }}>
                                        ${product.revenue.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Payment Status</h3>
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Paid Invoices</span>
                                <span className="badge badge-success">156</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Pending Invoices</span>
                                <span className="badge badge-warning">8</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Overdue Invoices</span>
                                <span className="badge badge-error">2</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
