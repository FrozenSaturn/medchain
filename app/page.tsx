
import Contribute from "@/components/landingpage/Contribute";
import Features from "@/components/landingpage/Features";
import Footer from "@/components/landingpage/Footer";
import Hero from "@/components/landingpage/Hero";
import Navbar from "@/components/landingpage/Navbar";
import Timeline from "@/components/landingpage/Timeline";

export default function Home() {
  return(
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Timeline />
      <Contribute />
      <Footer />
    </div>
  ) ;
}
