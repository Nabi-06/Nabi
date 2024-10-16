import clientApi from "@/api/clientSide/api";
import Button from "@/components/Button/Button";
import { Database, Tables } from "@/supabase/database.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface StoreDetailModalProps {
  detailData: Omit<Tables<"storeDatas">, "lng" | "lat">;
}

function StoreDetails({ detailData: storeDetailData }: StoreDetailModalProps) {
  const user = useAuthStore((state) => state.currentUser);
  const queryClient = useQueryClient();

  const { data: isStoreOwner } = useQuery({
    queryKey: [
      "storeOwners",
      { userId: user?.userId, storeId: storeDetailData?.storeId },
    ],
    queryFn: () =>
      clientApi.storeOwners.isStoreOwnerByStoreId({
        storeId: storeDetailData!.storeId,
      }),
  });
  const { mutate: insertOwner } = useMutation({
    mutationFn: (
      insertStoreOwner: Database["public"]["Tables"]["storeOwners"]["Insert"]
    ) => clientApi.storeOwners.insertStoreOwner(insertStoreOwner),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["storeOwners"],
      });
    },
  });
  const handleClickRegistOwner = () => {
    if (!storeDetailData || !user?.userId) return;
    const insertOwnerData: Database["public"]["Tables"]["storeOwners"]["Insert"] =
      {
        storeId: storeDetailData.storeId,
        sponsorId: user.userId,
      };
    insertOwner(insertOwnerData);
  };

  return (
    <section className="w-auto min-w-96 h-96 bg-white rounded-lg py-8 px-10 flex flex-col gap-y-5">
      <div className="bg-gray-400 w-full h-40" />
      <div className="flex flex-col gap-y-5">
        <div>
          <h2 className="font-bold text-2xl whitespace-nowrap">
            {storeDetailData?.brandName}
          </h2>
          <span className="text-sm">{storeDetailData?.storeType}</span>
          <address className="not-italic text-sm">
            {storeDetailData?.address}
          </address>
        </div>
        {user &&
          user.role === "sponsor" &&
          (isStoreOwner ? (
            <Button
              size="md"
              rounded="lg"
              className="px-5 py-1.5"
              intent="default"
              outline
              textIntent="default"
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
          ))}
      </div>
    </section>
  );
}

export default StoreDetails;
