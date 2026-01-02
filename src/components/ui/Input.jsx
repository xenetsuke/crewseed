import React from "react";
import { cn } from "../../utils/cn";

// 🛑 Filter props helper (do NOT pass custom props into <input>)
const filterValidInputProps = (props) => {
  const {
    iconName, // ❌ remove custom props
    icon,     // ❌ remove custom props
    error,
    hint,
    description,
    label,
    required,
    id,
    ...cleanProps // ONLY keep valid input props
  } = props;

  return cleanProps;
};

const Input = React.forwardRef(
  (
    {
      className,
      type = "text",
      label,
      description,
      error,
      required = false,
      id,
      ...props
    },
    ref
  ) => {
    const inputId =
      id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseInputClasses =
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    // 🧹 Clean props → browser would only receive VALID props
    const validProps = filterValidInputProps(props);

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              error ? "text-destructive" : "text-foreground"
            )}
          >
            {label}
            {required && (
              <span className="text-destructive ml-1">*</span>
            )}
          </label>
        )}

        <input
          type={type}
          className={cn(
            baseInputClasses,
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          id={inputId}
          {...validProps} // 🟢 NO iconName leakage here
        />

        {description && !error && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
