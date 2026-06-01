import { Button } from '@/components/ui/button';
import { Modal, ModalBody, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@/components/ui/modal';
import * as React from 'react';

export type ConfirmModalVariant = 'danger' | 'warning' | 'info';

export interface ConfirmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: ConfirmModalVariant;
    onConfirm: () => void;
    loading?: boolean;
}

const variantStyles: Record<ConfirmModalVariant, React.CSSProperties> = {
    danger: {
        backgroundColor: 'var(--color-error)',
        color: 'white',
    },
    warning: {
        backgroundColor: 'var(--color-warning)',
        color: 'white',
    },
    info: {
        backgroundColor: 'var(--primary)',
        color: 'var(--primary-foreground)',
    },
};

export function ConfirmModal({
    open,
    onOpenChange,
    title = 'Konfirmasi',
    description,
    confirmLabel = 'Ya, Lanjutkan',
    cancelLabel = 'Batal',
    variant = 'danger',
    onConfirm,
    loading = false,
}: ConfirmModalProps) {
    const handleConfirm = (): void => {
        onConfirm();
        onOpenChange(false);
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <ModalContent size="sm">
                <ModalHeader>
                    <ModalTitle>{title}</ModalTitle>
                    {description && (
                        <ModalDescription asChild>
                            <div>{description}</div>
                        </ModalDescription>
                    )}
                </ModalHeader>

                <ModalBody className="py-2" />

                <ModalFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        style={{
                            borderColor: 'var(--border)',
                            color: 'var(--foreground)',
                        }}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={loading}
                        style={{
                            ...variantStyles[variant],
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? 'Memproses...' : confirmLabel}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
