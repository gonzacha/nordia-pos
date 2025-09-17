const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nordia-backend.onrender.com';

export const api = {
  // Stock Management
  uploadBulkStock: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${API_URL}/api/stock/bulk`, {
      method: 'POST',
      body: formData
    });
  },

  // Barcode Scanner
  scanBarcode: async (barcode: string) => {
    return fetch(`${API_URL}/api/products/barcode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barcode })
    });
  },

  // Cash Register
  openCashRegister: async (initialAmount: number) => {
    return fetch(`${API_URL}/api/cash/open`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initial_amount: initialAmount, user_id: 1 })
    });
  },

  closeCashRegister: async (registerId: number, finalAmount: number) => {
    return fetch(`${API_URL}/api/cash/close`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ register_id: registerId, final_amount: finalAmount })
    });
  },

  // MercadoPago
  createPayment: async (amount: number, description: string) => {
    return fetch(`${API_URL}/api/payments/mercadopago`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, description })
    });
  },

  // Existing API methods
  getProducts: async () => {
    return fetch(`${API_URL}/api/products`);
  },

  createSale: async (saleData: any) => {
    return fetch(`${API_URL}/api/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saleData)
    });
  },

  processPayment: async (paymentData: any) => {
    return fetch(`${API_URL}/api/payments/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
  }
};