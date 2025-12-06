"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useAuthStore } from "@/lib/authStore"
import { Card, CardContent, CardHeader, CardTitle } from "@nordia/ui"
import { Button } from "@nordia/ui"
import { Store, User, CreditCard, Bell, Lock } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { businessName, businessType, products } = useAppStore()
  const { user, checkPermission, isAuthenticated } = useAuthStore()
  const canAccessSettings = checkPermission('settings')

  // Redirect if not authorized
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else if (!canAccessSettings) {
      router.push('/app/sell')
    }
  }, [isAuthenticated, canAccessSettings, router])

  // Show access denied while redirecting
  if (!canAccessSettings) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
          <p className="text-gray-500">No tenés permisos para acceder a esta página.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Configuración</h2>
        <p className="text-slate-600">Gestiona tu negocio y preferencias</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Información del Negocio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre del negocio
              </label>
              <input
                type="text"
                value={businessName || ""}
                readOnly
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tipo de negocio
              </label>
              <input
                type="text"
                value={businessType || ""}
                readOnly
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Productos cargados
              </label>
              <input
                type="text"
                value={`${products.length} productos`}
                readOnly
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
              />
            </div>
            <Button variant="outline" className="w-full" disabled>
              Editar (Próximamente)
            </Button>
          </CardContent>
        </Card>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Usuario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={user?.name || "Usuario"}
                readOnly
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Rol
              </label>
              <input
                type="text"
                value={user?.role === 'admin' ? 'Administrador' : 'Cajero'}
                readOnly
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Plan
              </label>
              <input
                type="text"
                value="Freemium"
                readOnly
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
              />
            </div>
            <Button variant="outline" className="w-full" disabled>
              Editar Perfil (Próximamente)
            </Button>
          </CardContent>
        </Card>

        {/* Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Facturación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-slate-900 mb-1">
                Plan Freemium
              </p>
              <p className="text-sm text-slate-600">
                30 facturas AFIP/mes
              </p>
            </div>
            <Button className="w-full">
              Ver Planes y Precios
            </Button>
            <Button variant="outline" className="w-full" disabled>
              Historial de Pagos (Próximamente)
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Stock bajo</p>
                <p className="text-xs text-slate-500">
                  Alertas cuando el stock esté bajo
                </p>
              </div>
              <input type="checkbox" className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Nuevas ventas</p>
                <p className="text-xs text-slate-500">
                  Notificación por cada venta
                </p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Reportes diarios</p>
                <p className="text-xs text-slate-500">
                  Resumen diario por email
                </p>
              </div>
              <input type="checkbox" className="rounded" />
            </div>
            <Button variant="outline" className="w-full" disabled>
              Guardar Preferencias (Próximamente)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Zona de Peligro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Exportar datos</p>
              <p className="text-xs text-slate-500">
                Descarga todos tus datos en formato JSON
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Exportar (Próximamente)
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Eliminar cuenta</p>
              <p className="text-xs text-slate-500">
                Borra permanentemente tu cuenta y todos los datos
              </p>
            </div>
            <Button variant="outline" size="sm" className="text-red-600" disabled>
              Eliminar (Próximamente)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
