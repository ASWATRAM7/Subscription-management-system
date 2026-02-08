'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const quickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
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
        {/* Left Side - Branding & Features */}
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
              <h2>Manage Your Business with Confidence</h2>
              <p>Complete subscription management, billing automation, and revenue analytics in one powerful platform.</p>
            </div>

            {/* Features */}
            <div className={styles.featuresList}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  <h4>Automated Billing</h4>
                  <p>Recurring invoices and payment processing</p>
                </div>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <h4>Customer Management</h4>
                  <p>Track and manage all your customers</p>
                </div>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div>
                  <h4>Revenue Analytics</h4>
                  <p>Real-time insights and reporting</p>
                </div>
              </div>

              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <h4>Secure & Reliable</h4>
                  <p>Enterprise-grade security standards</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <h3>99.9%</h3>
                <p>Uptime</p>
              </div>
              <div className={styles.statItem}>
                <h3>10K+</h3>
                <p>Businesses</p>
              </div>
              <div className={styles.statItem}>
                <h3>$50M+</h3>
                <p>Processed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>Welcome Back</h2>
              <p>Sign in to your account to continue</p>
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
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
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
              </div>

              <div className={styles.formOptions}>
                <label className={styles.rememberMe}>
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link href="/forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? (
                  <>
                    <div className={styles.spinner}></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className={styles.divider}>
              <span>or continue with</span>
            </div>

            {/* Quick Login Options */}
            <div className={styles.quickLoginSection}>
              <p className={styles.quickLoginTitle}>Quick Login (Demo)</p>
              <div className={styles.quickLoginGrid}>
                <button
                  type="button"
                  className={styles.quickLoginBtn}
                  onClick={() => quickLogin('admin@erp.com', 'Admin@123')}
                  disabled={loading}
                >
                  <div className={styles.quickLoginIcon}>👨‍💼</div>
                  <div>
                    <div className={styles.quickLoginRole}>Admin</div>
                    <div className={styles.quickLoginEmail}>admin@erp.com</div>
                  </div>
                </button>

                <button
                  type="button"
                  className={styles.quickLoginBtn}
                  onClick={() => quickLogin('internal@erp.com', 'Internal@123')}
                  disabled={loading}
                >
                  <div className={styles.quickLoginIcon}>👤</div>
                  <div>
                    <div className={styles.quickLoginRole}>Internal User</div>
                    <div className={styles.quickLoginEmail}>internal@erp.com</div>
                  </div>
                </button>

                <button
                  type="button"
                  className={styles.quickLoginBtn}
                  onClick={() => quickLogin('customer@example.com', 'Customer@123')}
                  disabled={loading}
                >
                  <div className={styles.quickLoginIcon}>👥</div>
                  <div>
                    <div className={styles.quickLoginRole}>Customer</div>
                    <div className={styles.quickLoginEmail}>customer@example.com</div>
                  </div>
                </button>
              </div>
            </div>

            <div className={styles.signupPrompt}>
              <p>Don't have an account? <Link href="/signup">Sign up for free</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
