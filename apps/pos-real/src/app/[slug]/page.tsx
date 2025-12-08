import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { LoginForm } from '@/components/auth/LoginForm'

interface StoreData {
  id: string
  name: string
  type: string | null
  slug: string | null
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function StoreLoginPage({ params }: Props) {
  const { slug } = await params

  // Buscar tienda por slug
  const { data, error } = await supabase
    .from('stores')
    .select('id, name, type, slug')
    .eq('slug', slug)
    .single()

  // Si no existe la tienda, 404
  if (error || !data) {
    notFound()
  }

  const store = data as StoreData

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 p-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🏪</span>
        </div>
        <h1 className="text-2xl font-bold text-white">{store.name}</h1>
        <p className="text-slate-400">Ingresá tu PIN para continuar</p>
      </div>

      {/* Formulario de PIN */}
      <LoginForm storeId={store.id} storeName={store.name} slug={store.slug || slug} />
    </div>
  )
}
