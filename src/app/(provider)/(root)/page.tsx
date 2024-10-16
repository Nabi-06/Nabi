import clientApi from "@/api/clientSide/api";
import Page from "@/components/Page/Page";
import plusIcon from "@/public/icons/plusIcon.png";
import Image from "next/image";
import Link from "next/link";
import FreeMeals from "./_components/HomePages/FreeMeals";
import RecruitList from "./_components/HomePages/Recruits/RecruitList";
import Users from "./_components/HomePages/Users/Users";

interface HomePageProps {
  searchParams: { page: string };
}

async function HomePage({ searchParams: { page } }: HomePageProps) {
  const initialRecruits =
    (await clientApi.recruits.getInfiniteRecruits(0)) || null;

  return (
    <Page
      width="lg"
      isMain={false}
      className="h-full flex items-center justify-between py-20"
    >
      <div className="grid grid-cols-4 gap-x-5 w-full">
        <FreeMeals />
        <div className="col-span-2">
          <Link
            href={"/recruits/new"}
            className="w-full rounded-md bg-white flex items-center justify-center py-4"
          >
            <div className="flex items-center gap-x-3">
              <Image
                alt="pulsIcon"
                src={plusIcon}
                className="bg-[#EEEEEE] p-1 rounded-full"
              />
              <p className="text-[16px]">후원자 모집하기</p>
            </div>
          </Link>
          <RecruitList initialRecruits={initialRecruits} />
        </div>
        <Users page={page} />
      </div>
    </Page>
  );
}

export default HomePage;
