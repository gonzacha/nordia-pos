"use client"

import { BusinessTemplate } from "@nordia/config"
import { Card, CardContent, CardHeader, CardTitle } from "@nordia/ui"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface BusinessTypeCardProps {
  template: BusinessTemplate
  onSelect: (template: BusinessTemplate) => void
  isSelected?: boolean
}

export function BusinessTypeCard({ template, onSelect, isSelected }: BusinessTypeCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card
        className={`h-full cursor-pointer hover:shadow-2xl transition-all relative overflow-hidden ${
          isSelected ? "ring-2 ring-blue-500 shadow-xl" : ""
        }`}
        onClick={() => onSelect(template)}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-5`} />

        {/* Check icon if selected */}
        {isSelected && (
          <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
        )}

        <CardHeader className="relative">
          <div className="flex items-start gap-4">
            <div className="text-5xl">{template.icon}</div>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{template.name}</CardTitle>
              <p className="text-sm text-slate-600 leading-relaxed">
                {template.description}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative">
          <div className="space-y-3">
            {/* Categories */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                Categorías
              </p>
              <div className="flex flex-wrap gap-2">
                {template.categories.slice(0, 3).map((cat) => (
                  <span
                    key={cat.name}
                    className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
                  >
                    {cat.icon} {cat.name}
                  </span>
                ))}
                {template.categories.length > 3 && (
                  <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-xs">
                    +{template.categories.length - 3} más
                  </span>
                )}
              </div>
            </div>

            {/* Products count */}
            <div className="pt-2 border-t">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-blue-600">
                  {template.products.length} productos
                </span>{" "}
                pre-configurados
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
