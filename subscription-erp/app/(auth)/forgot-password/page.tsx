'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './forgot-password.module.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [resetLink, setResetLink] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setResetLink('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                if (data.devResetLink) {
                    setResetLink(data.devResetLink);
                }
            } else {
                setError(data.error || 'Failed to send reset link');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Animated Background */}
            <div className={styles.backgroundAnimation}>
                <div className={styles.gradientOrb1}></div>
                <div className={styles.gradientOrb2}></div>
                <div className={styles.gradientOrb3}></div>
            </div>

            {/* Main Content */}
            <div className={styles.contentWrapper}>
                {/* Left Side - Information */}
                <div className={styles.infoSection}>
                    <div className={styles.infoContent}>
                        {/* Logo */}
                        <div className={styles.logoSection}>
                            <div className={styles.logoIcon}>
                                <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="60" height="60" rx="14" fill="url(#logoGradient)" />
                                    <path d="M20 30C20 24.4772 24.4772 20 30 20C35.5228 20 40 24.4772 40 30C40 35.5228 35.5228 40 30 40"
                                        stroke="white" strokeWidth="3.5" strokeLinecap="round" />
                                    <circle cx="30" cy="30" r="5" fill="white" />
                                    <path d="M30 25V12M25 30H12M35 30H48" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                                    <defs>
                                        <linearGradient id="logoGradient" x1="0" y1="0" x2="60" y2="60">
                                            <stop offset="0%" stopColor="#f59e0b" />
                                            <stop offset="100%" stopColor="#ef4444" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div className={styles.logoText}>
                                <h1>SubsERP</h1>
                                <p>Enterprise Resource Planning</p>
                            </div>
                        </div>

                        {/* Headline */}
                        <div className={styles.headline}>
                            <h2>Account Recovery</h2>
                            <p>Don't worry! Resetting your password is easy. Just enter your email address and we'll send you a link to reset it.</p>
                        </div>

                        {/* Steps */}
                        <div className={styles.stepsList}>
                            <div className={styles.stepItem}>
                                <div className={styles.stepNumber}>1</div>
                                <div>
                                    <h4>Enter Your Email</h4>
                                    <p>Provide the email address associated with your account</p>
                                </div>
                            </div>

                            <div className={styles.stepItem}>
                                <div className={styles.stepNumber}>2</div>
                                <div>
                                    <h4>Check Your Inbox</h4>
                                    <p>We'll send you a secure link to reset your password</p>
                                </div>
                            </div>

                            <div className={styles.stepItem}>
                                <div className={styles.stepNumber}>3</div>
                                <div>
                                    <h4>Create New Password</h4>
                                    <p>Click the link and set a new secure password</p>
                                </div>
                            </div>
                        </div>

                        {/* Security Note */}
                        <div className={styles.securityNote}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <div>
                                <h4>Secure & Safe</h4>
                                <p>Your password reset link is valid for 1 hour and can only be used once.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className={styles.formSection}>
                    <div className={styles.formContainer}>
                        <div className={styles.formHeader}>
                            <h2>Forgot Password?</h2>
                            <p>Enter your email to receive a reset link</p>
                        </div>

                        {error && (
                            <div className={styles.errorAlert}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {message && (
                            <div className={styles.successAlert}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                <div>
                                    <strong>Email Sent Successfully!</strong>
                                    <p>{message}</p>
                                    {resetLink && (
                                        <div className={styles.devLink}>
                                            <p><strong>Development Mode:</strong> Click the link below or check the server console</p>
                                            <a href={resetLink} className={styles.resetLinkBtn}>
                                                Open Reset Password Page
                                            </a>
                                        </div>
                                    )}
                                    <p className={styles.checkInbox}>📧 Check your inbox and spam folder. The link expires in 1 hour.</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email Address</label>
                                <div className={styles.inputWrapper}>
                                    <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        disabled={loading}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button type="submit" className={styles.submitButton} disabled={loading}>
                                {loading ? (
                                    <>
                                        <div className={styles.spinner}></div>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Reset Link</span>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                            <polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className={styles.backToLogin}>
                            <p>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="19" y1="12" x2="5" y2="12" />
                                    <polyline points="12 19 5 12 12 5" />
                                </svg>
                                <Link href="/login">Back to Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
