"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/authStore"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DataProvider } from "@/components/providers/DataProvider"
import { ConnectionStatus } from "@/components/ConnectionStatus"
import { Button } from "@nordia/ui"
import { Home, ShoppingCart, Package, Warehouse, Settings, LogOut } from "lucide-react"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, checkPermission, storeName } = useAuthStore()
  const canAccessSettings = checkPermission('settings')
  const canManageStock = checkPermission('manage_stock')

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  // Base navigation items
  const baseNavigation = [
    { name: "Inicio", href: "/app", icon: Home },
    { name: "Vender", href: "/app/sell", icon: ShoppingCart },
    { name: "Productos", href: "/app/products", icon: Package },
  ]

  // Build navigation based on permissions
  let navigation = [...baseNavigation]

  // Add Stock if user has permission
  if (canManageStock) {
    navigation.push({ name: "Stock", href: "/app/stock", icon: Warehouse })
  }

  // Add settings only if user has permission
  if (canAccessSettings) {
    navigation.push({ name: "Configuración", href: "/app/settings", icon: Settings })
  }

  const isActive = (href: string) => {
    if (href === "/app") {
      return pathname === "/app"
    }
    return pathname.startsWith(href)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        {/* Indicador de conexión offline/online */}
        <ConnectionStatus />

        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-slate-900">
                {storeName || "Nordia POS"}
              </h1>
              <p className="text-xs md:text-sm text-slate-500">
                Sistema de Ventas
              </p>
            </div>

            {/* Desktop only user info */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user?.name || 'Usuario'}</p>
                <p className="text-xs text-slate-500">
                  {user?.role === 'admin' ? 'Administrador' : 'Cajero'}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar - Desktop only */}
          <aside className="hidden md:block w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-73px)] sticky top-[73px]">
            <nav className="p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      active
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Free plan reminder */}
            <div className="p-4 mx-4 mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-slate-900 mb-1">
                Plan Freemium
              </p>
              <p className="text-xs text-slate-600 mb-3">
                30 facturas AFIP/mes
                <br />
                Upgrade para ilimitado
              </p>
              <Button size="sm" className="w-full text-xs">
                Ver Planes
              </Button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
            <DataProvider>
              {children}
            </DataProvider>
          </main>
        </div>

        {/* Bottom Navigation - Mobile only */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
          <div className="flex justify-around">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center py-3 px-4 flex-1 transition-colors ${
                    active
                      ? "text-amber-600"
                      : "text-slate-500"
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-1 ${active ? "stroke-[2.5]" : ""}`} />
                  <span className={`text-xs ${active ? "font-semibold" : "font-medium"}`}>
                    {item.name === "Configuración" ? "Config" : item.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </ProtectedRoute>
  )
}
