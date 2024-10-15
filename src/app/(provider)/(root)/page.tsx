import Page from "@/components/Page/Page";
import Link from "next/link";
import FreeMeals from "./_components/HomePages/FreeMeals";
import RecruitList from "./_components/HomePages/Recruits/RecruitList";
import Users from "./_components/HomePages/Users/Users";

interface HomePageProps {
  searchParams: { page: string };
}

function HomePage({ searchParams: { page } }: HomePageProps) {
  return (
    <Page
      width="lg"
      isMain={false}
      className="h-full flex items-center justify-between py-20 mt-10"
    >
      <div className="grid grid-cols-4 gap-x-5 w-full">
        <FreeMeals />
        <div className="col-span-2">
          <Link
            href={"/recruits/new"}
            className="w-full rounded-md bg-white flex items-center justify-center py-4"
          >
            <div className="flex items-center gap-x-3">
              <img
                src="/icons/plus.png"
                className="bg-[#EEEEEE] p-1 rounded-full"
              />
              <p className="text-[16px]">후원자 모집하기</p>
            </div>
          </Link>

          <RecruitList />
        </div>
        <Users page={page} />
      </div>
    </Page>
  );
}

export default HomePage;
