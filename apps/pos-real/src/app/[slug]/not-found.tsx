import Link from 'next/link'

export default function StoreNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 p-4">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-2xl font-bold text-white mb-2">Comercio no encontrado</h1>
      <p className="text-slate-400 text-center max-w-md">
        El link que usaste no existe o está mal escrito.
        <br />
        Verificá que tengas la URL correcta de tu negocio.
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors"
      >
        Ir al inicio
      </Link>
    </div>
  )
}
