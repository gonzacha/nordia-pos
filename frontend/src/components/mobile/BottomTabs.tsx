/**
 * BOTTOM TABS NAVIGATION
 * Navegación inferior optimizada para móviles
 * Reemplaza los tabs superiores en vista móvil
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useTouchOptimization } from '@/hooks/useResponsive'

interface TabItem {
  id: string
  label: string
  icon: React.ReactNode
  shortcut?: string
  badge?: number
  disabled?: boolean
}

interface BottomTabsProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  showLabels?: boolean
  className?: string
}

export function BottomTabs({
  tabs,
  activeTab,
  onTabChange,
  showLabels = true,
  className = ''
}: BottomTabsProps) {
  const { touchStyles, hapticFeedback } = useTouchOptimization()

  const handleTabPress = (tabId: string, disabled?: boolean) => {
    if (disabled) return

    // Feedback háptico
    if (hapticFeedback && navigator.vibrate) {
      navigator.vibrate(10)
    }

    onTabChange(tabId)
  }

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 z-30
      bg-white border-t border-gray-200
      safe-area-pb-4
      ${className}
    `}>
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          const isDisabled = tab.disabled

          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTabPress(tab.id, isDisabled)}
              disabled={isDisabled}
              className={`
                relative flex flex-col items-center justify-center
                rounded-lg transition-all duration-200
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              style={{
                minHeight: touchStyles.minHeight,
                minWidth: '64px',
                padding: '8px 4px'
              }}
              whileTap={!isDisabled ? { scale: 0.95 } : undefined}
              animate={{
                backgroundColor: isActive ? 'rgba(34, 197, 94, 0.1)' : 'transparent'
              }}
              transition={{ duration: 0.2 }}
            >
              {/* Badge */}
              {tab.badge && tab.badge > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 z-10"
                >
                  <div className="bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </div>
                </motion.div>
              )}

              {/* Icon */}
              <div className={`
                transition-colors duration-200
                ${isActive ? 'text-green-600' : 'text-gray-500'}
                ${isDisabled ? 'text-gray-300' : ''}
              `}>
                {tab.icon}
              </div>

              {/* Label */}
              {showLabels && (
                <span className={`
                  text-xs font-medium mt-1 transition-colors duration-200
                  ${isActive ? 'text-green-600' : 'text-gray-500'}
                  ${isDisabled ? 'text-gray-300' : ''}
                `}>
                  {tab.label}
                </span>
              )}

              {/* Shortcut indicator */}
              {tab.shortcut && !showLabels && (
                <span className="text-[10px] text-gray-400 mt-1">
                  {tab.shortcut}
                </span>
              )}

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-green-600 rounded-full"
                  transition={{ type: "spring", duration: 0.4 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Safe area spacer */}
      <div className="h-safe-area-inset-bottom" />
    </div>
  )
}

/**
 * Iconos SVG optimizados para bottom tabs
 */
export const TabIcons = {
  Sales: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),

  Stock: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 13h6" />
    </svg>
  ),

  Cash: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),

  Scanner: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
    </svg>
  ),

  Cart: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-3H4a1 1 0 100 2h1m0 0l1.68 8.39a2 2 0 002.016 1.61H19M7 13v4a2 2 0 002 2h6a2 2 0 002-2v-4M9 21h6" />
    </svg>
  )
}

/**
 * Hook para gestionar el estado de bottom tabs
 */
export function useBottomTabs(initialTab: string) {
  const [activeTab, setActiveTab] = React.useState(initialTab)
  const [badges, setBadges] = React.useState<Record<string, number>>({})

  const changeTab = (tabId: string) => {
    setActiveTab(tabId)
  }

  const setBadge = (tabId: string, count: number) => {
    setBadges(prev => ({
      ...prev,
      [tabId]: count
    }))
  }

  const clearBadge = (tabId: string) => {
    setBadges(prev => {
      const newBadges = { ...prev }
      delete newBadges[tabId]
      return newBadges
    })
  }

  const getBadge = (tabId: string) => badges[tabId] || 0

  return {
    activeTab,
    changeTab,
    setBadge,
    clearBadge,
    getBadge,
    badges
  }
}