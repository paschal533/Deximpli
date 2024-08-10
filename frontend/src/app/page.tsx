import NavBar from "@/components/navbar";
import Banner from "@/components/banner";
import Support from "@/components/supports";
import Discover from "@/components/discover";
import ApiSection from "@/components/api-section";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";
import Feactures from "@/components/features";

export default async function Home() {
  return (
    <main className="w-full">
      <NavBar />
      <Banner />
      <Feactures />
      <Support />
      <Discover />
      <ApiSection />
      <Testimonials />
      <Footer />
    </main>
  );
}
