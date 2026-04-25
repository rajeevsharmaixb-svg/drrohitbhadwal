import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  noPadding = false
}: DialogProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      document.body.style.overflow = 'hidden';
    } else {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] transition-opacity duration-300",
          isClosing ? "opacity-0" : "opacity-100"
        )}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[1000] pointer-events-none">
        <div
          className={cn(
            "bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto transition-all duration-300",
            isClosing ? "opacity-0 scale-95 translate-y-4" : "opacity-100 scale-100 translate-y-0",
            className
          )}
        >
          <div className="p-8 pb-0 flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
              {description && (
                <p className="text-slate-500 text-sm mt-1">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-400"
            >
              <X size={24} />
            </button>
          </div>
          <div className={cn("flex flex-col", noPadding ? "p-0 h-full" : "p-8 pt-6")}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
