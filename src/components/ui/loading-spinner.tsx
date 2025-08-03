import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'lg', 
  color = 'border-green-500',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16', 
    lg: 'h-32 w-32',
    xl: 'h-48 w-48'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 ${color} ${sizeClasses[size]}`}></div>
    </div>
  )
}

// Page loading component
export const PageLoading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
    </div>
  </div>
)

// Component loading
export const ComponentLoading: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner size="md" />
  </div>
)
