'use client'
import { Drawer } from 'vaul'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function BottomSheet({ open, onClose, children, title }: BottomSheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-3xl bg-white max-h-[85vh]">
          {/* Drag Handle */}
          <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-gray-300" />

          {/* Header */}
          {title ? (
            <div className="px-6 py-4">
              <Drawer.Title className="text-xl font-bold text-center">{title}</Drawer.Title>
              <VisuallyHidden.Root>
                <Drawer.Description>Contenido del panel</Drawer.Description>
              </VisuallyHidden.Root>
            </div>
          ) : (
            <VisuallyHidden.Root>
              <Drawer.Title>Panel</Drawer.Title>
              <Drawer.Description>Contenido del panel</Drawer.Description>
            </VisuallyHidden.Root>
          )}

          {/* Content con scroll */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
