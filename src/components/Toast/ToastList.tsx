"use client";

import { useToastStore } from "@/zustand/toast.store";
import Toast from "./Toast";

function ToastList() {
  const toastList = useToastStore((state) => state.toastList);

  return (
    <ul className="fixed bottom-5 right-5 z-20">
      {toastList.map((toast, index) => {
        return (
          <li key={index} className="mt-5">
            <Toast
              type={toast.type}
              toast={toast}
              duration={500}
              showTime={2000}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default ToastList;
