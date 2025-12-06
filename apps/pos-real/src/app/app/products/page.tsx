"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button, Card, CardContent, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@nordia/ui"
import { Plus, Edit, Trash2, Package, Download } from "lucide-react"
import { ExportPLU } from "@/components/products/ExportPLU"

export default function ProductsPage() {
  const { products, categories, addProduct } = useAppStore()
  const [showProductDialog, setShowProductDialog] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [productForm, setProductForm] = useState({
    name: "",
    category: categories[0] || "General",
    unit: "unit" as 'kg' | 'unit' | 'lt',
    price: "",
    cost: "",
    trackStock: true,
    stock: "0",
  })

  const handleCreateProduct = () => {
    if (!productForm.name || !productForm.price) {
      alert("Por favor completa nombre y precio")
      return
    }

    addProduct({
      name: productForm.name,
      plu: String(products.length + 1).padStart(5, '0'), // Auto-generate PLU
      category: productForm.category,
      unit: productForm.unit,
      price: parseFloat(productForm.price),
      cost: productForm.cost ? parseFloat(productForm.cost) : undefined,
      trackStock: productForm.trackStock,
      stock: productForm.trackStock ? parseInt(productForm.stock) : undefined,
    })

    setShowProductDialog(false)
    resetForm()
  }

  const resetForm = () => {
    setProductForm({
      name: "",
      category: categories[0] || "General",
      unit: "unit" as 'kg' | 'unit' | 'lt',
      price: "",
      cost: "",
      trackStock: true,
      stock: "0",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Productos</h2>
          <p className="text-slate-600">{products.length} productos en catálogo</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowExportModal(true)}
            className="h-12"
          >
            <Download className="w-5 h-5 mr-2" />
            Exportar PLUs
          </Button>
          <Button onClick={() => setShowProductDialog(true)} className="h-12">
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Categories filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button variant="default" size="sm">Todos ({products.length})</Button>
        {categories.map((cat) => {
          const count = products.filter(p => p.category === cat).length
          return (
            <Button key={cat} variant="outline" size="sm">
              {cat} ({count})
            </Button>
          )
        })}
      </div>

      {/* Products table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="text-sm text-slate-500">Unidad: {product.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">${product.price.toLocaleString()}</p>
                      {product.cost && (
                        <p className="text-xs text-slate-500">Costo: ${product.cost.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {product.trackStock ? (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          (product.stock || 0) > 10
                            ? "bg-green-100 text-green-700"
                            : (product.stock || 0) > 0
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {product.stock || 0} unidades
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">No controlado</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Product dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo Producto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Asado, Tomate, Pan Francés"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Categoría
                </label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Unidad
                </label>
                <select
                  value={productForm.unit}
                  onChange={(e) => setProductForm({ ...productForm, unit: e.target.value as 'kg' | 'unit' | 'lt' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="unit">Unidad</option>
                  <option value="kg">Kilogramo</option>
                  <option value="lt">Litro</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Precio de Venta *
                </label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Costo (opcional)
                </label>
                <input
                  type="number"
                  value={productForm.cost}
                  onChange={(e) => setProductForm({ ...productForm, cost: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={productForm.trackStock}
                  onChange={(e) => setProductForm({ ...productForm, trackStock: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-slate-700">Controlar stock</span>
              </label>
            </div>

            {productForm.trackStock && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Stock Inicial
                </label>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProductDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateProduct}>
              Crear Producto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export PLU Modal */}
      <ExportPLU
        products={products}
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  )
}
