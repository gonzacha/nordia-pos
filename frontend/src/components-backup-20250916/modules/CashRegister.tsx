import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Smartphone, FileText, Lock } from 'lucide-react';

interface CashMovement {
  type: 'income' | 'expense' | 'initial';
  amount: number;
  description: string;
  timestamp: Date;
  paymentMethod: string;
}

export const CashRegister: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [movements, setMovements] = useState<CashMovement[]>([]);
  const [initialCash, setInitialCash] = useState(0);
  const [currentCash, setCurrentCash] = useState(0);

  const openRegister = () => {
    const initial = prompt('Efectivo inicial en caja:');
    if (initial) {
      setInitialCash(parseFloat(initial));
      setCurrentCash(parseFloat(initial));
      setIsOpen(true);
      setMovements([{
        type: 'initial',
        amount: parseFloat(initial),
        description: 'Apertura de caja',
        timestamp: new Date(),
        paymentMethod: 'cash'
      }]);
    }
  };

  const closeRegister = () => {
    // Generate Z report
    const report = generateZReport();
    // Save to backend
    saveReport(report);
    // Print if needed
    if (confirm('¿Imprimir cierre Z?')) {
      printReport(report);
    }
    setIsOpen(false);
  };

  const generateZReport = () => {
    const cashSales = movements.filter(m => m.paymentMethod === 'cash');
    const cardSales = movements.filter(m => m.paymentMethod === 'card');
    const digitalSales = movements.filter(m => m.paymentMethod === 'mercadopago');

    return {
      date: new Date(),
      openTime: movements[0].timestamp,
      closeTime: new Date(),
      initialCash,
      finalCash: currentCash,
      cashSales: cashSales.reduce((sum, m) => sum + m.amount, 0),
      cardSales: cardSales.reduce((sum, m) => sum + m.amount, 0),
      digitalSales: digitalSales.reduce((sum, m) => sum + m.amount, 0),
      totalSales: movements.filter(m => m.type === 'income').reduce((sum, m) => sum + m.amount, 0),
      totalTransactions: movements.length - 1, // Exclude initial
      movements
    };
  };

  const saveReport = (report: any) => {
    // Send to backend
    fetch('/api/cash/close', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report)
    });
  };

  const printReport = (report: any) => {
    // Format for thermal printer
    const printContent = `
      =============================
      CIERRE DE CAJA Z
      =============================
      Fecha: ${report.date.toLocaleDateString()}
      Apertura: ${report.openTime.toLocaleTimeString()}
      Cierre: ${report.closeTime.toLocaleTimeString()}
      -----------------------------
      RESUMEN DE VENTAS
      -----------------------------
      Efectivo:     $ ${report.cashSales.toFixed(2)}
      Tarjeta:      $ ${report.cardSales.toFixed(2)}
      MercadoPago:  $ ${report.digitalSales.toFixed(2)}
      -----------------------------
      TOTAL:        $ ${report.totalSales.toFixed(2)}
      -----------------------------
      Caja inicial: $ ${report.initialCash.toFixed(2)}
      Caja final:   $ ${report.finalCash.toFixed(2)}
      Diferencia:   $ ${(report.finalCash - report.initialCash).toFixed(2)}
      -----------------------------
      Transacciones: ${report.totalTransactions}
      =============================
    `;

    // Send to printer
    window.print();
  };

  return (
    <div className="cash-register">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <DollarSign className="w-8 h-8 mr-2 text-green-600" />
        Caja Registradora (F8)
      </h2>

      {!isOpen ? (
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-4">Caja Cerrada</h3>
          <button
            onClick={openRegister}
            className="btn-primary"
          >
            Abrir Caja
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="card">
              <p className="text-sm text-gray-600">Inicial</p>
              <p className="text-2xl font-bold">${initialCash}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600">Actual</p>
              <p className="text-2xl font-bold text-green-600">${currentCash}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600">Ventas</p>
              <p className="text-2xl font-bold">{movements.length - 1}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600">Diferencia</p>
              <p className="text-2xl font-bold">
                ${(currentCash - initialCash).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="movements">
            <h3 className="text-lg font-semibold mb-4">Movimientos del Día</h3>
            <div className="space-y-2">
              {movements.map((movement, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-white rounded border">
                  <div>
                    <p className="font-semibold">{movement.description}</p>
                    <p className="text-sm text-gray-600">
                      {movement.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {movement.paymentMethod === 'cash' && <DollarSign className="w-5 h-5 mr-2" />}
                    {movement.paymentMethod === 'card' && <CreditCard className="w-5 h-5 mr-2" />}
                    {movement.paymentMethod === 'mercadopago' && <Smartphone className="w-5 h-5 mr-2" />}
                    <p className={`text-xl font-bold ${movement.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      ${movement.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={closeRegister}
              className="btn-primary flex-1"
            >
              <Lock className="w-5 h-5 mr-2" />
              Cerrar Caja (Generar Z)
            </button>
            <button className="btn-secondary flex-1">
              <FileText className="w-5 h-5 mr-2" />
              Imprimir X
            </button>
          </div>
        </>
      )}
    </div>
  );
};