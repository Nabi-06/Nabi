import Image from "next/image";
import Link from "next/link";

function HeaderLogo() {
  const logoImageUrl =
    "https://gxoibjaejbmathfpztjt.supabase.co/storage/v1/object/public/icons/NabiLogo.png?t=2024-10-16T06%3A12%3A04.231Z";

  return (
    <Link href="/" className="-mt-2">
      <Image
        width={200}
        height={200}
        src={logoImageUrl}
        className="w-14"
        alt="nabi logo"
      />
    </Link>
  );
}

export default HeaderLogo;
