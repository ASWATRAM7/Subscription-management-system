'use client';

import { useEffect } from 'react';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: 'danger' | 'primary' | 'success';
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmVariant = 'primary',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    useEffect(() => {
        // Prevent body scroll when dialog is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.dialog}>
                <div className={styles.iconWrapper}>
                    {confirmVariant === 'danger' && (
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    )}
                    {confirmVariant === 'primary' && (
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                    )}
                    {confirmVariant === 'success' && (
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    )}
                </div>

                <h2 className={styles.title}>{title}</h2>
                <p className={styles.message}>{message}</p>

                <div className={styles.actions}>
                    <button
                        className={`${styles.button} ${styles.cancelButton}`}
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`${styles.button} ${styles.confirmButton} ${styles[confirmVariant]}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
