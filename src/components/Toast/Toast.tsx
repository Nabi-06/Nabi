"use client";

import { ToastType } from "@/types/toast.types";
import { useToastStore } from "@/zustand/toast.store";
import { cva, VariantProps } from "class-variance-authority";
import { useEffect, useState } from "react";

const toastVariant = cva("", {
  variants: {
    size: {
      sm: "w-52 h-20 py-0.5",
      md: "w-96 h-28",
    },
    isCenter: {
      true: "items-center justify-center",
      false: "items-start justify-start ",
    },
    showDistance: {
      sm: "translate-x-[90px]",
      md: "translate-x-[430px]",
    },
    type: {
      success: "border-2 border-green-400 bg-green-400 bg-opacity-25",
      fail: "border-2 border-red-400 bg-red-400 bg-opacity-25",
      default: "border-2 border-black",
      none: "",
    },
  },
  compoundVariants: [],
  defaultVariants: {
    size: "md",
    isCenter: false,
    showDistance: "md",
    type: "none",
  },
});

type ToastProps = {
  toast: ToastType;
  showTime: number;
  duration: number;
} & VariantProps<typeof toastVariant>;

function Toast({
  toast,
  type,
  duration,
  showTime,
  size,
  isCenter,
  showDistance,
}: ToastProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const removeToast = useToastStore((state) => state.removeToast);

  useEffect(() => {
    if (!isMounted) setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted)
      setTimeout(() => {
        setIsShown(true);
      }, 30);
  }, [isMounted]);

  useEffect(() => {
    if (isShown) {
      setTimeout(() => {
        setIsShown(false);
      }, showTime);
    }
  }, [isShown]);

  useEffect(() => {
    if (!isShown && isMounted) {
      setTimeout(() => {
        setIsMounted(false);
      }, duration);

      setTimeout(() => {
        removeToast(toast.id!);
      }, duration + 30);
    }
  }, [isShown]);

  return (
    isMounted && (
      <article
        className={`bg-white flex flex-col gap-y-1 ${toastVariant({
          size,
          isCenter,
          showDistance,
        })} bg-white rounded-lg transition-all duration-300  ${
          isShown && "!translate-x-0"
        }`}
      >
        <div
          className={` p-5 flex flex-col gap-y-1 ${toastVariant({
            size,
            isCenter,
            showDistance,
            type,
          })} bg-white shadow-xl rounded-lg transition-all duration-300  ${
            isShown && "!translate-x-0"
          }`}
        >
          <h6 className={`font-bold ${size === "sm" && "text-sm"}`}>
            {toast.title}
          </h6>
          <p className={`text-base ${size === "sm" && "!text-xs"}`}>
            {toast.content}
          </p>
        </div>
      </article>
    )
  );
}

export default Toast;
