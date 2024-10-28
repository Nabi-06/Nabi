import clientApi from "@/api/clientSide/api";
import Button from "@/components/Button/Button";
import { Tables, TablesInsert } from "@/supabase/database.types";
import { ToastType } from "@/types/toast.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useToastStore } from "@/zustand/toast.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface StoreDetailButtonsProps {
  details: Omit<Tables<"storeDatas">, "lng" | "lat"> & {
    isRegisted: boolean;
  };
}

function StoreDetailButtons({
  details: storeDetailData,
}: StoreDetailButtonsProps) {
  const user = useAuthStore((state) => state.currentUser);
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  const { data: isExistOwner } = useQuery({
    queryKey: ["storeOwners", { storeId: storeDetailData.storeId }],
    queryFn: () =>
      clientApi.storeOwners.checkIsStoreOwnerByStoreId({
        storeId: storeDetailData.storeId,
      }),
  });

  const { data: isStoreOwner } = useQuery({
    queryKey: [
      "storeOwners",
      { userId: user?.userId, storeId: storeDetailData?.storeId },
    ],
    queryFn: () =>
      clientApi.storeOwners.checkIsStoreOwnerByStoreIdAndUserId({
        storeId: storeDetailData!.storeId,
        userId: user!.userId,
      }),
  });

  const { mutate: insertOwner } = useMutation({
    mutationFn: (insertStoreOwner: TablesInsert<"storeOwners">) =>
      clientApi.storeOwners.insertStoreOwner(insertStoreOwner),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["storeOwners"],
      });
      const id = crypto.randomUUID();
      const title = "새로운 점주 등록";
      const content = "점주 등록을 완료하였습니다";
      const type = "success";
      const toast: ToastType = {
        id,
        title,
        content,
        type,
      };
      addToast(toast);
    },
  });
  const { mutate: deleteOwner } = useMutation({
    mutationFn: () =>
      clientApi.storeOwners.deleteStoreOwnerByStoreId(storeDetailData.storeId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["storeOwners"],
      });
      const id = crypto.randomUUID();
      const title = "점주 해제";
      const content = "점주 해제를 완료하였습니다";
      const type = "success";
      const toast: ToastType = {
        id,
        title,
        content,
        type,
      };
      addToast(toast);
    },
  });

  const handleClickRegistOwner = () => {
    if (!storeDetailData || !user?.userId) return;
    const insertOwnerData: TablesInsert<"storeOwners"> = {
      storeId: storeDetailData.storeId,
      sponsorId: user.userId,
    };
    insertOwner(insertOwnerData);
  };
  const handleClickRemoveOwner = () => {
    if (!storeDetailData || !user?.userId) return;
    deleteOwner();
  };

  return storeDetailData.isRegisted ? (
    user && user.role === "sponsor" ? (
      isStoreOwner ? (
        <Button
          onClick={handleClickRemoveOwner}
          size="md"
          rounded="lg"
          className="px-5 py-1.5"
          intent="red"
          textIntent="red"
        >
          점주 해제하기
        </Button>
      ) : isExistOwner ? (
        <Button
          size="md"
          rounded="lg"
          className="px-5 py-1.5"
          textIntent="disabled"
          intent="disabled"
          disabled
        >
          이미 등록된 매장입니다
        </Button>
      ) : (
        <Button
          onClick={handleClickRegistOwner}
          size="md"
          rounded="lg"
          className="px-5 py-1.5"
          textIntent="primary"
          intent="primary"
        >
          점주 등록하기
        </Button>
      )
    ) : (
      <Button
        size="md"
        rounded="lg"
        className="px-5 py-1.5"
        textIntent="disabled"
        intent="disabled"
        disabled
      >
        후원자만 점주 등록이 가능합니다
      </Button>
    )
  ) : (
    <Button
      size="md"
      rounded="lg"
      className="px-5 py-1.5"
      textIntent="disabled"
      intent="disabled"
      disabled
    >
      지원하지 않는 매장입니다
    </Button>
  );
}

export default StoreDetailButtons;
