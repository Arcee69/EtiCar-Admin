export function getInitials(full_name: string | undefined): string {
    if (!full_name) return '?'
    return full_name
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

export const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString('en-NG')}`