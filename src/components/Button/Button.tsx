import { cva, VariantProps } from "class-variance-authority";
import { ComponentProps, PropsWithChildren } from "react";

const buttonVariant = cva("", {
  variants: {
    outline: {
      true: "border border-black",
      false: "border-none",
    },
    size: {
      xs: "p-0",
      sm: "px-14 py-1.5",
      md: "px-28 py-2.5",
    },
    intent: {
      default: "bg-black",
      primary: "bg-yellow-300",
      none: "bg-none",
      disabled: "bg-[#dddddd] bg-opacity-80 text-[#999999]",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
    },
    textIntent: {
      default: "text-white",
      black: "text-black",
      primary: "text-yellow-400",
    },
  },
  compoundVariants: [
    { intent: "default", className: "text-white" },
    { size: "sm", className: "text-sm" },
    {
      size: "md",
      className: "text-base",
    },
    {
      textIntent: "primary",
      intent: "primary",
      className: "bg-opacity-40 font-bold",
    },
    { outline: true, className: "bg-opacity-5" },
    { outline: true, textIntent: "default", className: "!text-black" },
  ],
  defaultVariants: {
    outline: false,
    intent: "default",
    size: "sm",
    rounded: "sm",
    textIntent: "default",
  },
});

export type ButtonVariant = VariantProps<typeof buttonVariant>;
type buttonProps = {
  className?: string;
};
export type ButtonProps = ButtonVariant &
  PropsWithChildren<buttonProps> &
  ComponentProps<"button">;

function Button({
  size,
  intent,
  outline,
  textIntent,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonVariant({
        outline,
        size,
        intent,
        textIntent,
        className,
      })}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
