"use client";

import Image from "next/image";
/* eslint-disable @next/next/no-img-element */

import Pagination from "./Pagination";
import RecipientList from "./RecipientList";

interface RecipientsProps {
  page: number;
}

function Recipients({ page }: RecipientsProps) {
  return (
    <article className="bg-white h-[360px] px-6 pt-5 flex flex-col gap-y-5 rounded-lg shadow-sm">
      <h2 className="flex items-center mx-auto gap-x-2 font-bold">
        <Image
          height={100}
          width={100}
          className="w-5 aspect-square"
          src="https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/Heart.png"
          alt="heart icon"
        />
        도움이 필요한 아이들
      </h2>

      <RecipientList page={page} />
      <Pagination page={page} />
    </article>
  );
}

export default Recipients;
