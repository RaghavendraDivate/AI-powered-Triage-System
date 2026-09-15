import * as React from "react"
import "./input.css"

const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    const inputClass = type === 'file' ? 'input input-file' : 'input';
    return (
      <input
        type={type}
        className={`${inputClass} ${className || ''}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }