import Container from "@/components/Container/Container";
import HeaderAuthMenu from "./HeaderAuthMenu/HeaderAuthMenu";
import HeaderLogo from "./HeaderLogo/HeaderLogo";
import HeaderNavigation from "./HeaderNavigation/HeaderNavigation";

function Header() {
  return (
    <header className="h-16 bg-white fixed top-0 left-0 z-[2] w-screen border-b">
      <Container
        width="lg"
        isMain={false}
        className="h-full flex items-center justify-between"
      >
        <HeaderLogo />

        <HeaderNavigation />

        <HeaderAuthMenu />
      </Container>
    </header>
  );
}

export default Header;
