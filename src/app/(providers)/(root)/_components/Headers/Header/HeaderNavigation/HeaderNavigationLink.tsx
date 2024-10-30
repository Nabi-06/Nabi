import Link from "next/link";

interface HeaderNavigationLinkProps {
  href: string;
  label: string;
}

export default function HeaderNavigationLink({
  href,
  label,
}: HeaderNavigationLinkProps) {
  return (
    <Link href={href} className="text-sm sm:text-xs">
      {label}
    </Link>
  );
}
