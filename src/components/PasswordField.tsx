import { useState } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { Input } from "./input";

interface PasswordFieldProps {
    className?: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PasswordField({
  className,
  name,
  value,
  onChange,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="relative">
        <Input 
            type={showPassword ? "text" : "password"}
            name={name || "password"}
            value={value}
            onChange={onChange}
            className={`block w-full text-sm p-3 border rounded-lg ${className}`}
            placeholder="Enter Password"
        />
        <div className="absolute inset-y-0 right-0 pr-3 mt-1.5 flex items-center">
          {showPassword ? (
            <AiOutlineEye
              className="h-5 w-5 text-GREY-200 cursor-pointer"
              onClick={togglePasswordVisibility}
            />
          ) : (
            <AiOutlineEyeInvisible
              className="h-5 w-5 text-GREY-200 cursor-pointer"
              onClick={togglePasswordVisibility}
            />
          )}
        </div>
      </div>
    </>
  );
}
