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
    <Link href={href} className="text-xs">
      {label}
    </Link>
  );
}
