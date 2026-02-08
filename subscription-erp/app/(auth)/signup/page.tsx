'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './signup.module.css';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Signup failed');
                setLoading(false);
                return;
            }

            // Auto-login after successful signup
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            router.push('/dashboard');
        } catch (err) {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
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
                {/* Left Side - Branding & Benefits */}
                <div className={styles.brandingSection}>
                    <div className={styles.brandingContent}>
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
                                            <stop offset="0%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#a855f7" />
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
                            <h2>Start Your Free Trial Today</h2>
                            <p>Join thousands of businesses managing their subscriptions with SubsERP. No credit card required.</p>
                        </div>

                        {/* Benefits */}
                        <div className={styles.benefitsList}>
                            <div className={styles.benefitItem}>
                                <div className={styles.benefitIcon}>✓</div>
                                <div>
                                    <h4>Free Forever Plan</h4>
                                    <p>Start with our free plan and upgrade as you grow</p>
                                </div>
                            </div>

                            <div className={styles.benefitItem}>
                                <div className={styles.benefitIcon}>✓</div>
                                <div>
                                    <h4>No Credit Card Required</h4>
                                    <p>Sign up instantly without payment information</p>
                                </div>
                            </div>

                            <div className={styles.benefitItem}>
                                <div className={styles.benefitIcon}>✓</div>
                                <div>
                                    <h4>Full Feature Access</h4>
                                    <p>Access all features during your trial period</p>
                                </div>
                            </div>

                            <div className={styles.benefitItem}>
                                <div className={styles.benefitIcon}>✓</div>
                                <div>
                                    <h4>24/7 Support</h4>
                                    <p>Get help whenever you need it from our team</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial */}
                        <div className={styles.testimonial}>
                            <div className={styles.testimonialQuote}>
                                "SubsERP transformed how we manage our subscriptions. The automation alone saved us 20 hours per week!"
                            </div>
                            <div className={styles.testimonialAuthor}>
                                <div className={styles.authorAvatar}>JD</div>
                                <div>
                                    <div className={styles.authorName}>John Doe</div>
                                    <div className={styles.authorTitle}>CEO, TechCorp</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Signup Form */}
                <div className={styles.formSection}>
                    <div className={styles.formContainer}>
                        <div className={styles.formHeader}>
                            <h2>Create Your Account</h2>
                            <p>Get started with SubsERP in just a few minutes</p>
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

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="firstName">First Name</label>
                                    <div className={styles.inputWrapper}>
                                        <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="John"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="lastName">Last Name</label>
                                    <div className={styles.inputWrapper}>
                                        <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        <input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Doe"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email Address</label>
                                <div className={styles.inputWrapper}>
                                    <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="password">Password</label>
                                <div className={styles.inputWrapper}>
                                    <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                        disabled={loading}
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        className={styles.togglePassword}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <p className={styles.passwordHint}>Must be at least 8 characters</p>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className={styles.inputWrapper}>
                                    <svg className={styles.inputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className={styles.togglePassword}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.termsCheckbox}>
                                <label>
                                    <input type="checkbox" required />
                                    <span>I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a></span>
                                </label>
                            </div>

                            <button type="submit" className={styles.submitButton} disabled={loading}>
                                {loading ? (
                                    <>
                                        <div className={styles.spinner}></div>
                                        <span>Creating account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                            <polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className={styles.loginPrompt}>
                            <p>Already have an account? <Link href="/login">Sign in</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
