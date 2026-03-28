import type { ReactNode } from "react"

interface ButtonProps {
    title: string | ReactNode
    className?: string
    onClick?: () => void
    type?: "button" | "submit" | "reset"
    disabled?: boolean
}

export const Button = ({
    title,
    className = '',
    onClick,
    type,
    disabled = false
}: ButtonProps) => {
    return (
        <button  type={type} className={className} onClick={onClick} disabled={disabled}>
            {title}
        </button>
    )
}