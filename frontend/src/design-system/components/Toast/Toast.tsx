'use client';

/**
 * NORDIA POS - TOAST COMPONENT
 * Sistema de notificaciones modernas con React Hot Toast
 */

import React from 'react';
import toast, { Toaster, ToastOptions } from 'react-hot-toast';
import { cn } from '@/design-system/utils/cn';

// Configuración del Toaster provider
export const ToastProvider = () => (
  <Toaster
    position="top-right"
    gutter={8}
    toastOptions={{
      duration: 4000,
      style: {
        background: 'transparent',
        boxShadow: 'none',
        padding: 0,
        margin: 0,
      },
    }}
  />
);

// Tipos de toast personalizados
interface ToastProps {
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

// Componente base para toast personalizado
const CustomToast = ({
  type,
  title,
  message,
  action,
  onDismiss,
}: {
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  action?: ToastProps['action'];
  onDismiss: () => void;
}) => {
  const variants = {
    success: {
      bg: 'bg-white border-l-4 border-success',
      icon: '✅',
      iconBg: 'bg-success/10 text-success',
    },
    error: {
      bg: 'bg-white border-l-4 border-danger',
      icon: '❌',
      iconBg: 'bg-danger/10 text-danger',
    },
    warning: {
      bg: 'bg-white border-l-4 border-warning',
      icon: '⚠️',
      iconBg: 'bg-warning/10 text-warning',
    },
    info: {
      bg: 'bg-white border-l-4 border-info',
      icon: 'ℹ️',
      iconBg: 'bg-info/10 text-info',
    },
  };

  const variant = variants[type];

  return (
    <div
      className={cn(
        'flex items-start p-4 rounded-xl shadow-medium max-w-md',
        'animate-slide-up',
        variant.bg
      )}
    >
      {/* Icon */}
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3',
        variant.iconBg
      )}>
        <span className="text-sm">{variant.icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-sm font-semibold text-neutral-900 mb-1">
            {title}
          </h4>
        )}
        <p className="text-sm text-neutral-700 leading-relaxed">
          {message}
        </p>

        {/* Action button */}
        {action && (
          <button
            onClick={() => {
              action.onClick();
              onDismiss();
            }}
            className={cn(
              'mt-2 text-sm font-medium transition-colors',
              'hover:underline focus:outline-none focus:underline',
              type === 'success' && 'text-success hover:text-success-dark',
              type === 'error' && 'text-danger hover:text-red-600',
              type === 'warning' && 'text-warning hover:text-yellow-600',
              type === 'info' && 'text-info hover:text-blue-600'
            )}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className={cn(
          'flex-shrink-0 ml-2 p-1 rounded-full transition-colors',
          'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100',
          'focus:outline-none focus:bg-neutral-100'
        )}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// Utilidades para mostrar diferentes tipos de toast
export const showToast = {
  success: (message: string, options?: Partial<ToastProps>) => {
    return toast.custom((t) => (
      <CustomToast
        type="success"
        title={options?.title}
        message={message}
        action={options?.action}
        onDismiss={() => toast.dismiss(t.id)}
      />
    ), {
      duration: options?.duration || 4000,
    });
  },

  error: (message: string, options?: Partial<ToastProps>) => {
    return toast.custom((t) => (
      <CustomToast
        type="error"
        title={options?.title}
        message={message}
        action={options?.action}
        onDismiss={() => toast.dismiss(t.id)}
      />
    ), {
      duration: options?.duration || 6000, // Errores duran más
    });
  },

  warning: (message: string, options?: Partial<ToastProps>) => {
    return toast.custom((t) => (
      <CustomToast
        type="warning"
        title={options?.title}
        message={message}
        action={options?.action}
        onDismiss={() => toast.dismiss(t.id)}
      />
    ), {
      duration: options?.duration || 5000,
    });
  },

  info: (message: string, options?: Partial<ToastProps>) => {
    return toast.custom((t) => (
      <CustomToast
        type="info"
        title={options?.title}
        message={message}
        action={options?.action}
        onDismiss={() => toast.dismiss(t.id)}
      />
    ), {
      duration: options?.duration || 4000,
    });
  },

  loading: (message: string, promise: Promise<any>) => {
    return toast.promise(promise, {
      loading: message,
      success: (data) => '¡Operación completada!',
      error: (err) => 'Ocurrió un error',
    });
  },

  // Toast personalizado para el POS
  sale: (amount: number, method: string) => {
    return showToast.success(
      `Venta procesada exitosamente por $${amount.toLocaleString('es-AR')}`,
      {
        title: '💰 Venta Exitosa',
        action: {
          label: 'Ver recibo',
          onClick: () => {
            // Lógica para mostrar recibo
            console.log('Mostrando recibo...');
          }
        }
      }
    );
  },

  stockAlert: (productName: string, currentStock: number) => {
    return showToast.warning(
      `El producto "${productName}" tiene stock bajo (${currentStock} unidades)`,
      {
        title: '📦 Stock Bajo',
        action: {
          label: 'Reponer stock',
          onClick: () => {
            // Navegar a reposición de stock
            console.log('Navegando a reposición...');
          }
        }
      }
    );
  },

  paymentError: (error: string) => {
    return showToast.error(
      `Error en el procesamiento del pago: ${error}`,
      {
        title: '💳 Error de Pago',
        action: {
          label: 'Reintentar',
          onClick: () => {
            // Lógica para reintentar pago
            console.log('Reintentando pago...');
          }
        }
      }
    );
  },

  syncSuccess: () => {
    return showToast.success(
      'Datos sincronizados correctamente con el servidor',
      {
        title: '🔄 Sincronización',
        duration: 2000
      }
    );
  },

  newOrder: (orderNumber: string) => {
    return showToast.info(
      `Nueva orden recibida: #${orderNumber}`,
      {
        title: '🔔 Nueva Orden',
        action: {
          label: 'Ver orden',
          onClick: () => {
            console.log(`Mostrando orden ${orderNumber}`);
          }
        }
      }
    );
  },
};

// Hook para usar toasts en componentes
export const useToast = () => {
  return {
    show: showToast,
    dismiss: toast.dismiss,
    remove: toast.remove,
    loading: (message: string) => toast.loading(message),
  };
};