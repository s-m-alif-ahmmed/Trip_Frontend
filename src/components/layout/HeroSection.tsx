import banner from "@/assets/images/hero-banner.png";
import Container from "../shared/Container";
import { useLanguageContext } from "@/hooks/useLanguageContext";

const HeroSection = () => {
  const { t } = useLanguageContext();

  return (
    <div className="relative">
      <Container className="relative z-10 text-white pt-30 pb-20 sm:py-36 lg:py-40 xl:py-55">
        <h1 className="text-[28px] sm:text-4xl lg:text-5xl xl:text-[64px] font-semibold leading-tight sm:max-w-[90%]">
          {t("hero.title")}
        </h1>
      </Container>
      <figure className="absolute inset-0">
        <img
          src={banner}
          alt="Hero Banner"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </figure>
    </div>
  );
};

export default HeroSection;
