"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeHideIcon } from "@/assets/icons/icon";
import { cn } from "@/lib/utils";

interface PasswordFieldProps extends React.ComponentPropsWithoutRef<"input"> {
  className?: string;
}

const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={cn("pr-12", className)}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-transparent"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeIcon className="size-5 text-muted-foreground" />
          ) : (
            <EyeHideIcon className="size-5 text-muted-foreground" />
          )}
        </Button>
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";

export { PasswordField };
