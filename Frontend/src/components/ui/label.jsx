import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import "./label.css"

// Helper function to generate label class names
const getLabelClasses = (className, disabled) => {
  const baseClass = 'label';
  const disabledClass = disabled ? 'label-disabled' : '';
  
  return [baseClass, disabledClass, className].filter(Boolean).join(' ');
}

const Label = React.forwardRef(
  ({ className, disabled, ...props }, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      className={getLabelClasses(className, disabled)}
      {...props}
    />
  )
)
Label.displayName = LabelPrimitive.Root.displayName

export { Label, getLabelClasses as labelVariants }