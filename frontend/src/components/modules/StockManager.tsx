import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, Download, Package } from 'lucide-react';

interface Product {
  id?: string;
  name: string;
  barcode: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  expirationDate?: Date;
}

export const StockManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showCamera, setShowCamera] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle CSV upload
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      // Parse CSV and update products
      parseCSV(csv);
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls', '.xlsx']
    }
  });

  const parseCSV = (csv: string) => {
    // CSV parsing logic
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const newProducts = lines.slice(1).map(line => {
      const values = line.split(',');
      return {
        name: values[0],
        barcode: values[1],
        price: parseFloat(values[2]),
        stock: parseInt(values[3]),
        category: values[4]
      };
    });
    setProducts(prev => [...prev, ...newProducts]);
  };

  const captureProductPhoto = async () => {
    setShowCamera(true);
    // Implement camera capture
  };

  return (
    <div className="stock-manager">
      <h2 className="text-2xl font-bold mb-6">Gestión de Stock (F3)</h2>

      {/* Bulk Upload Area */}
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Suelta el archivo CSV aquí...</p>
        ) : (
          <div className="text-center p-8 border-2 border-dashed border-green-500 rounded-lg">
            <Upload className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <p className="text-lg font-semibold">Arrastra un CSV aquí</p>
            <p className="text-sm text-gray-600 mt-2">o click para seleccionar</p>
          </div>
        )}
      </div>

      {/* Quick Add Form */}
      <div className="quick-add mt-6">
        <h3 className="text-lg font-semibold mb-4">Agregar Producto Rápido</h3>
        <form className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre del producto"
            className="px-4 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Código de barras"
            className="px-4 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Precio"
            className="px-4 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Stock inicial"
            className="px-4 py-2 border rounded"
          />
          <select className="px-4 py-2 border rounded">
            <option>Categoría</option>
            <option>Bebidas</option>
            <option>Cigarrillos</option>
            <option>Golosinas</option>
            <option>Comestibles</option>
          </select>
          <button
            type="button"
            onClick={captureProductPhoto}
            className="btn-primary flex items-center justify-center"
          >
            <Camera className="w-5 h-5 mr-2" />
            Tomar Foto
          </button>
        </form>
      </div>

      {/* Product List */}
      <div className="product-list mt-8">
        <h3 className="text-lg font-semibold mb-4">
          Productos Cargados ({products.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, idx) => (
            <div key={idx} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.barcode}</p>
                  <p className="text-lg font-bold text-green-600">
                    ${product.price}
                  </p>
                </div>
                <div className="text-right">
                  <Package className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-2xl font-bold">{product.stock}</p>
                  <p className="text-xs text-gray-500">unidades</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};