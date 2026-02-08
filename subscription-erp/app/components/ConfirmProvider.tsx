'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ConfirmDialog from './ConfirmDialog';

interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary' | 'success';
}

interface ConfirmContextType {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
    const [dialogState, setDialogState] = useState<{
        isOpen: boolean;
        options: ConfirmOptions;
        resolve: (value: boolean) => void;
    } | null>(null);

    const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setDialogState({
                isOpen: true,
                options,
                resolve,
            });
        });
    }, []);

    const handleConfirm = useCallback(() => {
        if (dialogState) {
            dialogState.resolve(true);
            setDialogState(null);
        }
    }, [dialogState]);

    const handleCancel = useCallback(() => {
        if (dialogState) {
            dialogState.resolve(false);
            setDialogState(null);
        }
    }, [dialogState]);

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {dialogState?.isOpen && (
                <ConfirmDialog
                    title={dialogState.options.title}
                    message={dialogState.options.message}
                    confirmText={dialogState.options.confirmText}
                    cancelText={dialogState.options.cancelText}
                    confirmVariant={dialogState.options.variant}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const context = useContext(ConfirmContext);
    if (context === undefined) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context;
}
