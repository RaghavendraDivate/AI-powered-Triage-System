import * as React from "react"
import "./badge.css"

// Helper function to generate badge class names
const getBadgeClasses = (variant, className) => {
  const baseClass = 'badge';
  const variantClass = variant ? `badge-${variant}` : 'badge-default';
  
  return [baseClass, variantClass, className].filter(Boolean).join(' ');
}

function Badge({ className, variant, ...props }) {
  return (
    <div className={getBadgeClasses(variant, className)} {...props} />
  )
}

export { Badge, getBadgeClasses as badgeVariants }