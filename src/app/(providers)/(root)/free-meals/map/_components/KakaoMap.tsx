/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import clientApi from "@/api/clientSide/api";
import Button from "@/components/Button/Button";
import Input from "@/components/Inputs/Input";
import { Tables } from "@/supabase/database.types";
import { ToastType } from "@/types/toast.types";
import { useModalStore } from "@/zustand/modal.store";
import { useToastStore } from "@/zustand/toast.store";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { ComponentProps, useEffect, useRef, useState } from "react";
import StoreDetailModal from "./StoreDetailModal";
import useGeolocation from "./useGeolocation";

declare global {
  interface Window {
    kakao: {
      maps: any;
    };
  }
}

type SearchResult = {
  address_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  distance: string;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
  x: number;
  y: number;
};
type SearchResponse = SearchResult[];

interface KakaoMapProps {
  lat: number;
  lng: number;
  brandName: string;
}
type CurrentStore =
  | (Tables<"storeDatas"> & {
      isRegisted: boolean;
    })
  | null;

function KakaoMap({
  lat = 33.450701,
  lng = 126.570667,
  brandName,
}: KakaoMapProps) {
  const [currentStore, setCurrentStore] = useState<CurrentStore>({
    lat,
    lng,
    brandName,
    isRegisted: true,
    address: "",
    createdAt: "",
    phoneNumber: "",
    storeId: "",
    storeType: "",
  });
  const mapRef = useRef<HTMLDivElement>(null);
  const location = useGeolocation();
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [searchList, setSearchList] = useState<SearchResponse>([]);
  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const addToast = useToastStore((state) => state.addToast);

  const createMarker = (
    storeData: CurrentStore,
    currentCluerster: kakao.maps.MarkerClusterer,
    isRegisted: boolean
  ) => {
    if (!currentCluerster)
      return console.log("currentCluerster is", currentCluerster);

    const imageSrc = isRegisted
        ? "https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/Shop.png"
        : "https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/DisabledShop.png?t=2024-10-20T00%3A26%3A11.454Z", // 마커이미지의 주소입니다
      imageSize = new kakao.maps.Size(40, 43), // 마커이미지의 크기입니다
      imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
    const markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption
    );

    const markerPosition = new window.kakao.maps.LatLng(
      storeData!.lat,
      storeData!.lng
    );

    const marker = new window.kakao.maps.Marker({
      image: markerImage,
      position: markerPosition,
    });

    currentCluerster.addMarker(marker, false);

    window.kakao.maps.event.addListener(marker, "click", () => {
      setActiveModal(<StoreDetailModal detailData={storeData!} />);
    });
  };

  const searchStore = () => {
    const places = new window.kakao.maps.services.Places();

    const callback = function (
      result: SearchResponse,
      status: kakao.maps.services.Status
    ) {
      if (status === kakao.maps.services.Status.OK) {
        setSearchList(result.slice(0, 5));
      }
    };
    if (keyword.length === 0) return;
    places.keywordSearch(keyword, callback);
  };

  const handleSubmitSearchStore: ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault();
  };

  const handleChangeKeyword: ComponentProps<"input">["onChange"] = (e) => {
    setKeyword(e.target.value);
  };

  const handleClickSearchStore = (result: SearchResult) => {
    const clickedStore: CurrentStore = {
      lat: result.y,
      lng: result.x,
      brandName: result.place_name,
      address: result.address_name,
      createdAt: dayjs().format("YYYY-MM-DD HH:mm"),
      phoneNumber: result.phone,
      storeId: result.id,
      storeType: result.category_group_name,
      isRegisted: false,
    };
    setCurrentStore(clickedStore);

    router.push(
      `/free-meals/map?lat=${result.y}&lng=${result.x}&brandName=${result.place_name}`
    );
  };

  useEffect(() => {
    if (!window.kakao) {
      const id = crypto.randomUUID();
      const title = "지도 로딩 실패";
      const content = "지도를 찾을 수 없습니다.\n홈페이지로 이동됩니다";
      const type = "fail";
      const toast: ToastType = {
        id,
        title,
        content,
        type,
      };
      addToast(toast);
      return router.replace("/");
    }

    window.kakao.maps.load(async () => {
      let mapLevel = 2;

      let mapCenter =
        !location.error && location.loaded
          ? {
              lat: location.coordinates!.lat,
              lng: location.coordinates!.lng,
            }
          : { lat: 33.450701, lng: 126.570667 };
      const isSelectedStore =
        currentStore && !isNaN(currentStore?.lat) && !isNaN(currentStore.lng);

      if (isSelectedStore) {
        mapLevel = 0;
        mapCenter = { lat: currentStore.lat, lng: currentStore.lng };
      }

      const center = new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng);
      const options = {
        center,
        level: mapLevel,
      };
      const map = new window.kakao.maps.Map(mapRef.current, options);

      const cluster = new kakao.maps.MarkerClusterer({
        map,
        markers: [],
        gridSize: 100,
        averageCenter: true,
        minLevel: 3,
        disableClickZoom: true,
      });

      window.kakao.maps.event.addListener(
        map,
        "bounds_changed",
        async function () {
          router.push("/free-meals/map");

          const bounds = map.getBounds();

          const swLatLng = bounds.getSouthWest();
          const neLatLng = bounds.getNorthEast();

          if (isNaN(swLatLng.La) || isNaN(swLatLng.Ma))
            return console.log("map is undefined");
          if (isNaN(neLatLng.La) || isNaN(neLatLng.Ma)) return;

          const requestData = {
            swLatLng,
            neLatLng,
          };
          clientApi.storeData
            .getStoreDatasBySwLatLngAndNeLatLng(requestData)
            .then((res) => {
              cluster.clear();
              res?.forEach((data) => {
                const storeData = {
                  ...data,
                  isRegisted: true,
                };
                createMarker(storeData, cluster, true);
              });
            });
        }
      );

      const bounds = map.getBounds();

      const swLatLng = bounds.getSouthWest();
      const neLatLng = bounds.getNorthEast();

      if (isNaN(swLatLng.La) || isNaN(swLatLng.Ma))
        return console.log("map is undefined");
      if (isNaN(neLatLng.La) || isNaN(neLatLng.Ma)) return;

      const requestData = {
        swLatLng,
        neLatLng,
      };
      clientApi.storeData
        .getStoreDatasBySwLatLngAndNeLatLng(requestData)
        .then((res) => {
          if (res.length === 0) return console.log("storeData is ", res.length);
          if (isSelectedStore) {
            console.log("show selected store");
            const storeData = res?.find(
              (store) =>
                Math.floor(store.lat) === Math.floor(currentStore.lat) &&
                Math.floor(store.lng) === Math.floor(currentStore.lng) &&
                store.brandName === currentStore.brandName
            );

            let selectedStore: CurrentStore = {
              address: currentStore.address,
              brandName: currentStore.brandName,
              lat: currentStore.lat,
              lng: currentStore.lng,
              createdAt: currentStore.createdAt,
              phoneNumber: currentStore.phoneNumber,
              storeId: currentStore.storeId,
              storeType: currentStore.storeType,
              isRegisted: false,
            };
            if (storeData) {
              selectedStore = {
                address: storeData.address,
                brandName: storeData.brandName,
                lat: storeData.lat,
                lng: storeData.lng,
                createdAt: storeData.createdAt,
                phoneNumber: storeData.createdAt,
                storeId: storeData.storeId,
                storeType: storeData.storeType,
                isRegisted: true,
              };
            }
            cluster.clear();
            createMarker(selectedStore, cluster, !!storeData);
            // return setActiveModal(<StoreDetailModal detailData={selectedStore} />);
            return;
          }
          cluster.clear();
          return res?.forEach((data) => {
            const storeData = {
              ...data,
              isRegisted: true,
            };
            createMarker(storeData, cluster, true);
          });
        });
    });
  }, [location, currentStore]);

  useEffect(() => {
    if (!window.kakao) {
      return router.replace("/");
    }
    window.kakao.maps.load(() => {
      searchStore();
    });
  }, [keyword]);

  return (
    <div ref={mapRef} className="w-screen h-screen relative">
      <div className="flex flex-col gap-y-2 bg-white w-80 h-96 absolute z-[2] top-24 left-16 px-4 py-4 rounded-lg shadow-md">
        <h2 className="font-bold text-lg">매장 검색하기</h2>
        <form className="flex items-start" onClick={handleSubmitSearchStore}>
          <Input
            inputId="search"
            intent="comment"
            name="keyword"
            value={keyword}
            onChange={handleChangeKeyword}
            innerClassName="bg-[#f5f5f5] outline-none grow text-sm"
          />
          <Button
            intent="primary"
            textIntent="primary"
            className="w-20 !px-3 !py-[0.57rem] whitespace-nowrap text-center"
          >
            검색
          </Button>
        </form>
        <ul className="mt-5 flex flex-col gap-y-2">
          {searchList.map((result) => {
            return (
              <li
                key={result.id}
                className="border border-gray-200 py-2 px-3 line-clamp-6"
              >
                <button
                  className="w-full"
                  onClick={() => handleClickSearchStore(result)}
                >
                  {result.place_name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default KakaoMap;
