"use client";

import { useAuthStore } from "@/zustand/auth.store";
import { useModal } from "@/zustand/modal.store";
import Link from "next/link";
import LoggedInNavigation from "./LoggedInNavigation";
import SelectRoleModal from "./SelectRoleModal";

function Navigation() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const authInitialized = useAuthStore((state) => state.isAuthInitialized);
  const user = useAuthStore((state) => state.currentUser);
  const setActiveModal = useModal((state) => state.setActiveModal);
  const handleClickSignUp = () => {
    setActiveModal(<SelectRoleModal />);
  };
  return (
    <nav>
      <ul className="flex gap-x-5 items-center">
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
        ) : null}
      </ul>
    </nav>
  );
}

export default Navigation;
