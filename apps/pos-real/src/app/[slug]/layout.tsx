import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  params: Promise<{ slug: string }>
}

export default async function StoreLayout({ children }: Props) {
  // El layout solo pasa el children, el store context se maneja en cada página
  // porque necesitamos validar el slug en cada request
  return <>{children}</>
}
