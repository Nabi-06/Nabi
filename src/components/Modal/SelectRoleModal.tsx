import useModalStore from "@/zustand/modal.store";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
import { FaChildren } from "react-icons/fa6";
import { MdVolunteerActivism } from "react-icons/md";
import Modal from "./Modal";

function SelectRoleModal({ children }: PropsWithChildren) {
  const authType = useModalStore((state) => state.authType);
  const isShowSelectRoleModal = useModalStore(
    (state) => state.isShowSelectRoleModal
  );
  const setIsShowSelectRoleModal = useModalStore(
    (state) => state.setIsShowSelectRoleModal
  );
  const router = useRouter();
  const baseHref = authType === "log-in" ? "/auth/log-in" : "/auth/sign-up";

  const handleClickSelectRole = (role: "recipient" | "sponsor") => {
    const href = baseHref + `?role=${role}`;
    setIsShowSelectRoleModal(false);
    router.push(href);
  };

  return (
    <>
      {isShowSelectRoleModal && (
        <Modal className="flex gap-x-10 items-center justify-center">
          <button
            onClick={() => handleClickSelectRole("recipient")}
            className="w-72 aspect-square bg-white border border-gray-500 rounded-xl p-5 pt-10 pb-2"
          >
            <article className="flex flex-col justify-between gap-y-8">
              <div className=" w-44 h-32 m-auto rounded-lg grid place-content-center">
                <FaChildren size={80} color="#555555" />
              </div>
              <span className="text-center font-extrabold text-2xl text-gray-600">
                후원아동
              </span>
            </article>
          </button>
          <button
            onClick={() => handleClickSelectRole("sponsor")}
            className="w-72 aspect-square bg-white border border-gray-500 rounded-xl p-5 pt-10 pb-2"
          >
            <article className="flex flex-col justify-between gap-y-8">
              <div className="w-44 h-32 m-auto rounded-lg grid place-content-center">
                <MdVolunteerActivism size={80} color="#555555" />
              </div>
              <span className="text-center font-extrabold text-2xl text-gray-600">
                후원자
              </span>
            </article>
          </button>
        </Modal>
      )}
      {children}
    </>
  );
}

export default SelectRoleModal;
