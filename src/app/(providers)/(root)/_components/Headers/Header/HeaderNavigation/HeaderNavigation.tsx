import HeaderNavigationLink from "./HeaderNavigationLink";

function HeaderNavigation() {
  return (
    <nav className="flex items-center gap-x-5">
      <HeaderNavigationLink href="/free-meals/map" label="무상식사 지도" />
      <HeaderNavigationLink href="/funds/report" label="후원 기금 리포트" />
    </nav>
  );
}

export default HeaderNavigation;
