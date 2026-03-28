interface InputProps {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    type?: string;
    id?: string;
    className?: string;
}

export const Input = ({ placeholder, value, onChange, name, type, id, className }: InputProps) => {
    return(
        <input 
            data-testid="my-input" 
            id={id}
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={className || "border-b-[0.2px] border-PURPLE-600 outline-none py-2 bg-transparent text-NEUTRAL-100 font-sans placeholder-NEUTRAL-800 text-base leading-[130%] tracking-[1%]"}
        />
    )
}