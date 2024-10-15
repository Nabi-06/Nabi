"use client";

import clientApi from "@/api/clientSide/api";
import ButtonGroup from "@/components/Button/ButtonGroup";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

function FreeMeals() {
  const router = useRouter();
  const { data: freeMeals, isLoading } = useQuery({
    queryKey: ["freeMeals"],
    queryFn: () => clientApi.freeMeals.getFreeMealsWithStoreData(),
  });

  const handleClickLinkToStoreMap = (lat: number, lng: number) => {
    router.push(`/free-meals/map?lat=${lat}&lng=${lng}`);
  };

  if (isLoading) return <span>데이터를 불러오는 중 </span>;

  return (
    <ul className="flex flex-col gap-y-5">
      {freeMeals!.map((freeMeal) => {
        return (
          <li key={freeMeal.mealId}>
            <article className="bg-white p-5 flex flex-col gap-y-2 rounded-md">
              <div className="mb-5">
                <span className="font-bold text-[15px]">
                  {freeMeal.userProfiles?.nickname}
                  <span className="font-normal">
                    님께서
                    <br />
                    당신에게 무상식사를 제공합니다 !
                  </span>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs">매장명</span>
                <span className="not-italic text-sm">
                  {freeMeal.storeDatas?.brandName}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs">매장 주소</span>
                <address className="not-italic text-sm">
                  {freeMeal.storeDatas?.address}
                </address>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs">일시</span>
                <address className="not-italic text-sm">
                  {dayjs(freeMeal.freeMealDate).format("YYYY-MM-DD HH:mm")}
                </address>
              </div>
              <ButtonGroup
                value=" 매장 위치 보기"
                intent="primary"
                textIntent="primary"
                className="w-full mt-4 text-[13px]"
                onClick={() =>
                  handleClickLinkToStoreMap(
                    freeMeal.storeDatas?.lat!,
                    freeMeal.storeDatas?.lng!
                  )
                }
              />
            </article>
          </li>
        );
      })}
    </ul>
  );
}

export default FreeMeals;
