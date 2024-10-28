import Toast from "@/components/Toast/Toast";
import { ToastType } from "@/types/toast.types";

interface DeadLineToastProps {
  deadLineDate: string;
  isHover: boolean;
}

function DeadLineToast({ deadLineDate, isHover }: DeadLineToastProps) {
  const toast: ToastType = {
    title: "마감 일시",
    content: `${deadLineDate}에 모집 마감됩니다`,
    id: crypto.randomUUID(),
    type: "default",
  };

  return (
    <div className="absolute top-44 right-10 z-10 ">
      {isHover && (
        <Toast
          duration={500}
          showTime={99999}
          toast={toast}
          size="sm"
          isCenter
          showDistance="sm"
        />
      )}
    </div>
  );
}

export default DeadLineToast;
