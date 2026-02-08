'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './home.module.css';

interface DashboardStats {
    activeSubscriptions: number;
    totalRevenue: number;
    pendingInvoices: number;
    totalCustomers: number;
}

interface ActivityItem {
    id: string;
    type: 'subscription' | 'invoice';
    title: string;
    description: string;
    date: string;
    amount?: number;
}

interface SystemInfo {
    products: number;
    activePlans: number;
    activeTaxes: number;
}

export default function DashboardHome() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>({
        activeSubscriptions: 0,
        totalRevenue: 0,
        pendingInvoices: 0,
        totalCustomers: 0,
    });
    const [activity, setActivity] = useState<ActivityItem[]>([]);
    const [systemInfo, setSystemInfo] = useState<SystemInfo>({
        products: 0,
        activePlans: 0,
        activeTaxes: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('/api/dashboard/stats');
                if (response.ok) {
                    const data = await response.json();
                    if (data.stats) setStats(data.stats);
                    if (data.activity) setActivity(data.activity);
                    if (data.system) setSystemInfo(data.system);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const kpiCards = [
        {
            title: 'Active Subscriptions',
            value: stats.activeSubscriptions,
            icon: '📊',
            color: 'primary',
            trend: '+12%',
            trendUp: true,
            bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        {
            title: 'Total Revenue',
            value: `$${(stats.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            icon: '💰',
            color: 'success',
            trend: '+8.2%',
            trendUp: true,
            bgGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        },
        {
            title: 'Pending Invoices',
            value: stats.pendingInvoices,
            icon: '📄',
            color: 'warning',
            trend: stats.pendingInvoices > 0 ? 'Action Required' : 'All Clear',
            trendUp: false,
            bgGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        },
        {
            title: 'Total Customers',
            value: stats.totalCustomers,
            icon: '👥',
            color: 'secondary',
            trend: '+5.4%',
            trendUp: true,
            bgGradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
        },
    ];

    const quickActions = [
        { label: 'New Subscription', icon: '➕', path: '/dashboard/subscriptions/new', color: 'primary' },
        { label: 'Add Product', icon: '📦', path: '/dashboard/products', color: 'secondary' },
        { label: 'View Customers', icon: '👥', path: '/dashboard/customers', color: 'success' },
        { label: 'Payments', icon: '💳', path: '/dashboard/payments', color: 'warning' },
        { label: 'Create Invoice', icon: '💰', path: '/dashboard/invoices', color: 'primary' },
        { label: 'Reports', icon: '📈', path: '/dashboard/reports', color: 'secondary' },
    ];

    const handleQuickAction = (path: string) => {
        router.push(path);
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Dashboard Overview</h1>
                    <p className={styles.subtitle}>
                        Welcome back! Here's what's happening with your business today.
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <button className="btn btn-secondary btn-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Search
                    </button>
                    <button className="btn btn-primary btn-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 4v16m8-8H4" />
                        </svg>
                        New
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className={styles.kpiGrid}>
                {kpiCards.map((card, index) => (
                    <div
                        key={index}
                        className={`${styles.kpiCard} fade-in`}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className={styles.kpiCardInner}>
                            <div className={styles.kpiHeader}>
                                <div className={styles.kpiIconWrapper} style={{ background: card.bgGradient }}>
                                    <span className={styles.kpiIcon}>{card.icon}</span>
                                </div>
                                <span className={`${styles.kpiTrend} ${card.trendUp ? styles.trendUp : styles.trendDown}`}>
                                    {card.trendUp ? '↗' : '↘'} {card.trend}
                                </span>
                            </div>
                            <div className={styles.kpiContent}>
                                <p className={styles.kpiTitle}>{card.title}</p>
                                <h2 className={styles.kpiValue}>{card.value}</h2>
                            </div>
                        </div>
                        <div className={styles.kpiBackground} style={{ background: card.bgGradient }}></div>
                    </div>
                ))}
            </div>

            {/* Main Grid */}
            <div className={styles.mainGrid}>
                {/* Recent Activity */}
                <div className={`${styles.activityCard} card`}>
                    <div className="card-header">
                        <h3 className="card-title">Recent Activity</h3>
                        <button className="btn btn-ghost btn-sm">View All</button>
                    </div>
                    <div className="card-body">
                        {activity.length > 0 ? (
                            <div className={styles.activityList}>
                                {activity.slice(0, 5).map((item, index) => (
                                    <div key={item.id} className={styles.activityItem} style={{ animationDelay: `${index * 50}ms` }}>
                                        <div className={styles.activityIconWrapper}>
                                            <span className={styles.activityIcon}>
                                                {item.type === 'subscription' ? '📋' : '💰'}
                                            </span>
                                        </div>
                                        <div className={styles.activityContent}>
                                            <p className={styles.activityTitle}>{item.title}</p>
                                            <p className={styles.activityDesc}>{item.description}</p>
                                        </div>
                                        <div className={styles.activityMeta}>
                                            <p className={styles.activityTime}>
                                                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </p>
                                            {item.amount && (
                                                <span className="badge badge-success">${item.amount.toFixed(2)}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <span className={styles.emptyIcon}>📭</span>
                                <p>No recent activity</p>
                                <p className={styles.emptySubtext}>Activity will appear here as it happens</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Quick Actions</h3>
                    </div>
                    <div className="card-body">
                        <div className={styles.quickActionsGrid}>
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    className={styles.quickActionBtn}
                                    onClick={() => handleQuickAction(action.path)}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <span className={styles.quickActionIcon}>{action.icon}</span>
                                    <span className={styles.quickActionLabel}>{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* System Info */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">System Information</h3>
                    <span className="badge badge-success">
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', marginRight: '6px' }}></span>
                        All Systems Operational
                    </span>
                </div>
                <div className="card-body">
                    <div className={styles.systemGrid}>
                        <div className={styles.systemItem}>
                            <div className={styles.systemIcon}>🗄️</div>
                            <div>
                                <p className={styles.systemLabel}>Database</p>
                                <p className={styles.systemValue}>SQLite Connected</p>
                            </div>
                        </div>
                        <div className={styles.systemItem}>
                            <div className={styles.systemIcon}>📦</div>
                            <div>
                                <p className={styles.systemLabel}>Products</p>
                                <p className={styles.systemValue}>{systemInfo.products} Active</p>
                            </div>
                        </div>
                        <div className={styles.systemItem}>
                            <div className={styles.systemIcon}>🔄</div>
                            <div>
                                <p className={styles.systemLabel}>Plans</p>
                                <p className={styles.systemValue}>{systemInfo.activePlans} Recurring</p>
                            </div>
                        </div>
                        <div className={styles.systemItem}>
                            <div className={styles.systemIcon}>🏷️</div>
                            <div>
                                <p className={styles.systemLabel}>Tax Rules</p>
                                <p className={styles.systemValue}>{systemInfo.activeTaxes} Configured</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
