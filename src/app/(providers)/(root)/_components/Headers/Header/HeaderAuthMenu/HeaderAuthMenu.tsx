"use client";

import { useAuthStore } from "@/zustand/auth.store";
import { useModalStore } from "@/zustand/modal.store";
import Link from "next/link";
import SelectRoleModal from "../Modals/SelectRoleModal";
import LoggedInNavigation from "./LoggedInNavigation";
import HeaderNavigationSkeleton from "./components/NavigationSkeleton";

function HeaderAuthMenu() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const authInitialized = useAuthStore((state) => state.isAuthInitialized);
  const user = useAuthStore((state) => state.currentUser);
  const setActiveModal = useModalStore((state) => state.setActiveModal);
  const handleClickSignUp = () => {
    setActiveModal(<SelectRoleModal />);
  };

  return (
    <nav>
      <ul className="flex gap-x-5 items-center justify-center">
        {authInitialized ? (
          isLoggedIn ? (
            <LoggedInNavigation userId={user?.userId!} />
          ) : (
            <>
              <li>
                <Link href="/log-in">로그인</Link>
              </li>
              <li>
                <button onClick={handleClickSignUp}>회원가입</button>
              </li>
            </>
          )
        ) : (
          <HeaderNavigationSkeleton />
        )}
      </ul>
    </nav>
  );
}

export default HeaderAuthMenu;
