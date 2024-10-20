"use client";

import clientApi from "@/api/clientSide/api";
import ButtonGroup from "@/components/Button/ButtonGroup";
import Container from "@/components/Container/Container";
import { PaymentResponse } from "@/types/paymentResponse.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RegularSponsorShipBillingPageProps {
  searchParams: {
    customerKey: string;
    authKey: string;
  };
  params: {
    recipientId: string;
    price: string;
  };
}

function RegularSponsorShipBillingPage({
  searchParams: { customerKey, authKey },
  params: { recipientId, price },
}: RegularSponsorShipBillingPageProps) {
  const router = useRouter();
  const [receipt, setReceipt] = useState<PaymentResponse | null>(null);
  const user = useAuthStore((state) => state.currentUser);

  const { mutate: addRegularSponsorShipTable } = useMutation({
    mutationFn: () => {
      if (!user) return Promise.resolve();

      const data = {
        sponsorId: user.userId,
        recipientId,
      };
      return clientApi.regularSponsorShip.addRegularSponsorship(data);
    },
  });

  const { mutate: getBillingKey } = useMutation({
    mutationFn: (requestData: {
      customerKey: string;
      authKey: string;
      price: number;
      recipientId: string;
    }) => clientApi.regularSponsorShip.getBillingKey(requestData),
    onSuccess: (responseData: PaymentResponse) => {
      console.log("success:", responseData);
      setReceipt(responseData);
      addRegularSponsorShipTable();
    },
    onError: (data: { message: string; code: string }) => {
      console.log("error: ", data);
      router.replace(`?code=${data.code}&message=${data.message}`);
    },
  });

  const handleClickLinkToProfile = () => {
    router.replace(`/profiles?userId=${recipientId}`);
  };

  useEffect(() => {
    const requestData = {
      recipientId,
      price: +price,
      authKey,
      customerKey,
    };
    getBillingKey(requestData);
  }, []);

  return (
    <Container isMain className="pt-10 flex flex-col">
      <div className="flex flex-col items-center bg-white py-9 px-20 rounded-md gap-y-10 w-[800px]">
        <div className="flex items-center gap-x-3">
          <Image
            height={100}
            width={100}
            alt="success payment icon"
            className="w-10"
            src="https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/SuccessPayment.png"
          />
          <h2 className="font-extrabold text-2xl text-center">결제 완료</h2>
        </div>
        <div className="w-full flex flex-col gap-y-5 text-black">
          <div className="flex flex-col">
            <span className="font-bold">결제코드</span>
            <span>{receipt?.orderId}</span>
          </div>

          <div className="flex gap-x-32">
            <div className="flex flex-col">
              <span className="font-bold">결제명</span>
              <span>{receipt?.orderName}</span>
            </div>
            <div>
              <p className="font-bold">후원금액</p>
              <p>{receipt?.amount.toLocaleString()}원</p>
            </div>
          </div>

          <div>
            <p className="font-bold">카드번호</p>
            <p>{receipt?.card.number}</p>
          </div>

          <div>
            <p className="font-bold">결제일</p>
            <p>{dayjs(receipt?.approvedAt).format("YYYY-MM-DD HH:mm:ss")}</p>
          </div>
          <ButtonGroup
            onClick={handleClickLinkToProfile}
            intent="primary"
            textIntent="primary"
            className="ml-auto"
            value="프로필로 돌아가기"
          />
        </div>
      </div>
    </Container>
  );
}

export default RegularSponsorShipBillingPage;
