import Page from "@/components/Page/Page";
import Link from "next/link";
import Recruits from "./_components/Recruits";

async function HomePage() {
  return (
    <Page
      width="lg"
      isMain={false}
      className="h-full flex items-center justify-between py-20"
    >
      <div className="grid grid-cols-4 gap-x-5 w-full">
        <div></div>
        <div className="col-span-2">
          <Link
            href={"/recruits/new"}
            className="w-full block bg-white text-center py-3 text-[15px]"
          >
            글 작성
          </Link>

          <Recruits />
        </div>
        <div className="bg-white h-60"></div>
      </div>
    </Page>
  );
}

export default HomePage;
