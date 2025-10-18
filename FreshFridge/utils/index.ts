// Utility functions for the FreshKeep app

export const getExpiryColor = (daysLeft: number): string => {
  if (daysLeft <= 2) return "text-red-500"
  if (daysLeft <= 5) return "text-orange-500"
  return "text-green-500"
}

export const getExpiryText = (daysLeft: number): string => {
  if (daysLeft === 0) return "Expired"
  if (daysLeft === 1) return "1 day left"
  return `${daysLeft} days left`
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}
