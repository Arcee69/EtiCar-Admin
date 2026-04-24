export function getInitials(full_name: string | undefined): string {
    if (!full_name) return '?'
    return full_name
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

export const formatNaira = (amount: number | string) => {
  const value = typeof amount === 'string' ? Number(amount) : amount
  return `₦${value.toLocaleString('en-NG')}`
}

export const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

export const formatCurrency = (value: number | string) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(typeof value === 'string' ? parseFloat(value) : value)
}