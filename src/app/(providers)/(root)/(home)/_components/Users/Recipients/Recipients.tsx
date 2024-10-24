"use client";

/* eslint-disable @next/next/no-img-element */

import Pagination from "./Pagination";
import RecipientList from "./RecipientList";

interface RecipientsProps {
  page: number;
}

function Recipients({ page }: RecipientsProps) {
  return (
    <article className="bg-white h-[360px] px-6 pt-5 flex flex-col gap-y-5 rounded-lg shadow-sm">
      <RecipientList page={page} />
      <Pagination page={page} />
    </article>
  );
}

export default Recipients;
