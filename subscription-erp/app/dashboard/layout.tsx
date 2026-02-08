'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './dashboard.module.css';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        setUser(JSON.parse(userData));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (!user) {
        return (
            <div className={styles.loading}>
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'Products', href: '/dashboard/products', icon: '📦' },
        { name: 'Recurring Plans', href: '/dashboard/plans', icon: '🔄' },
        { name: 'Subscriptions', href: '/dashboard/subscriptions', icon: '📋' },
        { name: 'Invoices', href: '/dashboard/invoices', icon: '💰' },
        { name: 'Payments', href: '/dashboard/payments', icon: '💳' },
        { name: 'Customers', href: '/dashboard/customers', icon: '👥' },
        { name: 'Taxes', href: '/dashboard/taxes', icon: '🏷️' },
        ...(user.role === 'ADMIN' ? [
            { name: 'Discounts', href: '/dashboard/discounts', icon: '🎁' },
            { name: 'Users', href: '/dashboard/users', icon: '👤' },
        ] : []),
        { name: 'Reports', href: '/dashboard/reports', icon: '📈' },
    ];

    return (
        <div className={styles.layout}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.sidebarClosed : ''}`}>
                <div className={styles.sidebarHeader}>
                    <h2 className="gradient-text">ERP System</h2>
                    <button
                        className={styles.toggleBtn}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="Toggle sidebar"
                    >
                        {sidebarOpen ? '←' : '→'}
                    </button>
                </div>

                <nav className={styles.nav}>
                    {navigation.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            {sidebarOpen && <span>{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                            {user.firstName[0]}{user.lastName[0]}
                        </div>
                        {sidebarOpen && (
                            <div className={styles.userDetails}>
                                <p className={styles.userName}>
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className={styles.userRole}>
                                    <span className={`badge ${user.role === 'ADMIN' ? 'badge-error' :
                                            user.role === 'INTERNAL_USER' ? 'badge-warning' :
                                                'badge-primary'
                                        }`}>
                                        {user.role.replace('_', ' ')}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                    {sidebarOpen && (
                        <button
                            onClick={handleLogout}
                            className={`btn btn-secondary btn-sm ${styles.logoutBtn}`}
                        >
                            Logout
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
}
