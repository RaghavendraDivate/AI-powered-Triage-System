import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import "./button.css"

// Helper function to generate class names based on variants
const getButtonClasses = (variant, size, className) => {
  const baseClass = 'button';
  const variantClass = variant ? `button-${variant}` : 'button-default';
  const sizeClass = size ? `button-${size}` : 'button-default';
  
  return [baseClass, variantClass, sizeClass, className].filter(Boolean).join(' ');
}

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={getButtonClasses(variant, size, className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, getButtonClasses as buttonVariants }