import { PropsWithChildren } from "react";
import Footer from "./_components/Headers/Footer";
import Header from "./_components/Headers/Header/Header";

function RootLayout({ children }: PropsWithChildren) {
  return (
    <div className="bg-[#f5f5f5]">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default RootLayout;
