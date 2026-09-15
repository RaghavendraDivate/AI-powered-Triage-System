import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import "./avatar.css"

const Avatar = React.forwardRef(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
      ref={ref}
      className={`avatar ${className || ''}`}
      {...props}
    />
  )
)
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
      ref={ref}
      className={`avatar-image ${className || ''}`}
      {...props}
    />
  )
)
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={`avatar-fallback ${className || ''}`}
      {...props}
    />
  )
)
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }