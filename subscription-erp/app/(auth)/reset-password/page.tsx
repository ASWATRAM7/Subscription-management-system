'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../login/login.module.css'; // Reuse login styles

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password reset successful! Redirecting to login...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(data.error || 'Failed to reset password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                    <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Invalid Request</h2>
                    <p style={{ marginBottom: '1.5rem' }}>Missing reset token.</p>
                    <Link href="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Left Side */}
            <div className={styles.heroSection}>
                <div className={styles.heroBackground}>
                    <Image
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
                        alt="Background"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    <div className={styles.heroOverlay}></div>
                </div>
                <div className={styles.heroContent}>
                    <div className={styles.logoSection}>
                        <div className={styles.logoText}>
                            <h1>SubsERP</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className={styles.formSection}>
                <div className={styles.formContainer}>
                    <div className={styles.formHeader}>
                        <h2>Reset Password</h2>
                        <p>Create a new strong password for your account</p>
                    </div>

                    {error && <div className={styles.errorAlert}>{error}</div>}

                    {message && (
                        <div className="alert alert-success" style={{ padding: '1rem', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '1rem' }}>
                            {message}
                        </div>
                    )}

                    {!message && (
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="password">New Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    className="form-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                    autoFocus
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                                />
                            </div>

                            <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    className="form-input"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                                />
                            </div>

                            <button type="submit" className={styles.submitBtn} disabled={loading} style={{ marginTop: '1.5rem' }}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
