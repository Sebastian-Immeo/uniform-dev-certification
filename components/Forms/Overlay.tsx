'use client';

import { Icon } from '@/components/atoms/A.9 Icon';
import { useScrollLock } from '@/hooks/useScrollLock';
import React, { useEffect, useRef } from 'react';

export interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  closeAriaLabel?: string;
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

export function Overlay({
  isOpen,
  onClose,
  closeAriaLabel = 'Close overlay',
  header,
  children,
  className = '',
  maxWidth = 'max-w-[952px]',
}: OverlayProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useScrollLock(isOpen);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const reducedMotionActive =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const overlayAnimation = reducedMotionActive
    ? ''
    : 'animate-[overlayEnter_0.3s_ease-out_forwards]';

  return (
    <dialog
      ref={dialogRef}
      onKeyDown={handleKeyDown}
      className="backdrop:bg-carbon md:backdrop:bg-overlay-carbon-65 bg-transparent p-0 max-w-none max-h-none w-full h-full"
    >
      <div className="flex items-center justify-center min-h-full p-0 md:py-ft-11 md:px-ft-11">
        <div
          className={`w-full ${maxWidth} p-ft-6 md:p-ft-8 text-white bg-carbon rounded-corners shadow-2xl relative ${overlayAnimation} ${className}`}
        >
          <div className="flex items-center mb-ft-9">
            {header}

            <button
              onClick={onClose}
              className="cursor-pointer self-baseline ml-auto"
              aria-label={closeAriaLabel}
            >
              <Icon icon="cross-lg" className="w-ft-6 h-ft-6 fill-white" />
            </button>
          </div>

          {children}
        </div>
      </div>
    </dialog>
  );
}
