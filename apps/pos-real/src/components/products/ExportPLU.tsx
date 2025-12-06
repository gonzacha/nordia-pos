"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@nordia/ui"
import { Button } from "@nordia/ui"
import { Download, FileText } from "lucide-react"
import { Product } from "@/lib/store"

interface ExportPLUProps {
  products: Product[]
  open: boolean
  onClose: () => void
}

type ExportFormat = "KRETZ" | "CSV"

export function ExportPLU({ products, open, onClose }: ExportPLUProps) {
  const [format, setFormat] = useState<ExportFormat>("KRETZ")

  const generateKretzPLU = (): string => {
    // Formato Kretz: PLU|NOMBRE|PRECIO|TIPO
    // TIPO: 0=peso (kg), 1=unidad
    let content = "PLU|NOMBRE|PRECIO|TIPO\n"

    products.forEach((product, index) => {
      const plu = String(index + 1).padStart(3, '0')
      const nombre = product.name.substring(0, 20).toUpperCase()
      const precio = Math.round(product.price)
      const tipo = product.unit === 'kg' ? '0' : '1'

      content += `${plu}|${nombre}|${precio}|${tipo}\n`
    })

    return content
  }

  const generateCSV = (): string => {
    // Formato CSV: codigo,nombre,precio,unidad,categoria
    let content = "codigo,nombre,precio,unidad,categoria\n"

    products.forEach((product, index) => {
      const codigo = String(index + 1).padStart(4, '0')
      const nombre = `"${product.name}"`
      const precio = product.price
      const unidad = product.unit
      const categoria = `"${product.category}"`

      content += `${codigo},${nombre},${precio},${unidad},${categoria}\n`
    })

    return content
  }

  const handleExport = () => {
    let content: string
    let filename: string
    let mimeType: string

    if (format === "KRETZ") {
      content = generateKretzPLU()
      filename = "plu_kretz.txt"
      mimeType = "text/plain"
    } else {
      content = generateCSV()
      filename = "productos.csv"
      mimeType = "text/csv"
    }

    // Crear blob y descargar
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-600" />
            Exportar PLUs
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-slate-600">
            Exporta {products.length} productos en formato compatible con balanzas electrónicas.
          </p>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">
              Selecciona el formato:
            </label>

            {/* Formato Kretz */}
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                format === "KRETZ"
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
              onClick={() => setFormat("KRETZ")}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  checked={format === "KRETZ"}
                  onChange={() => setFormat("KRETZ")}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">Balanzas Kretz</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Formato .txt compatible con balanzas Kretz, Systel, CAS
                  </p>
                  <div className="mt-2 bg-slate-100 p-2 rounded text-xs font-mono text-slate-700">
                    001|ASADO|5500|0
                  </div>
                </div>
              </div>
            </div>

            {/* Formato CSV */}
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                format === "CSV"
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
              onClick={() => setFormat("CSV")}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  checked={format === "CSV"}
                  onChange={() => setFormat("CSV")}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">CSV Genérico</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Archivo CSV compatible con Excel y otras aplicaciones
                  </p>
                  <div className="mt-2 bg-slate-100 p-2 rounded text-xs font-mono text-slate-700">
                    0001,"Asado",5500,kg,"Carnes"
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <FileText className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-700">
              {format === "KRETZ"
                ? `Se exportarán ${products.length} productos en formato Kretz`
                : `Se exportarán ${products.length} productos en formato CSV`}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Descargar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
