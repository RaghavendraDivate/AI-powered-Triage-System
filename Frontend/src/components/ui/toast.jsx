import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { X } from "lucide-react"

import "./toast.css"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef(
  ({ className, ...props }, ref) => (
    <ToastPrimitives.Viewport
      ref={ref}
      className={`toast-viewport ${className || ''}`}
      {...props}
    />
  )
)
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

// Helper function to generate toast class names
const getToastClasses = (variant, className) => {
  const baseClass = 'toast';
  const variantClass = variant ? `toast-${variant}` : 'toast-default';
  
  return [baseClass, variantClass, className].filter(Boolean).join(' ');
}

const Toast = React.forwardRef(
  ({ className, variant, ...props }, ref) => {
    return (
      <ToastPrimitives.Root
        ref={ref}
        className={getToastClasses(variant, className)}
        {...props}
      />
    )
  }
)
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef(
  ({ className, ...props }, ref) => (
    <ToastPrimitives.Action
      ref={ref}
      className={`toast-action ${className || ''}`}
      {...props}
    />
  )
)
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef(
  ({ className, ...props }, ref) => (
    <ToastPrimitives.Close
      ref={ref}
      className={`toast-close ${className || ''}`}
      toast-close=""
      {...props}
    >
      <X className="h-4 w-4" />
    </ToastPrimitives.Close>
  )
)
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef(
  ({ className, ...props }, ref) => (
    <ToastPrimitives.Title
      ref={ref}
      className={`toast-title ${className || ''}`}
      {...props}
    />
  )
)
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef(
  ({ className, ...props }, ref) => (
    <ToastPrimitives.Description
      ref={ref}
      className={`toast-description ${className || ''}`}
      {...props}
    />
  )
)
ToastDescription.displayName = ToastPrimitives.Description.displayName

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  getToastClasses as toastVariants,
}