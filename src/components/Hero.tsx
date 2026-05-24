import Image from "next/image";
import { Button } from "./ui/button";

function Hero() {
  return (
    <section className="hero bg-[url('/images/sky.png')] bg-cover bg-center">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
          {/* Left content */}
          <div className="w-full max-w-2xl text-center lg:text-left">
            <h1 className="font-bold text-white leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              The #1 software for Salons and Spas
            </h1>

            <h3 className="mt-4 text-white/95 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0">
              This is a website specialising with tools to boost sales, manage
              your calendar, and retain clients, so you can focus on what you do
              best.
            </h3>

            <Button className="primary-btn mt-6 w-fit mx-auto lg:mx-0">
              Get started!
            </Button>
          </div>

          {/* Right: same overlap concept, responsive */}
          <div className="relative w-full max-w-[320px] sm:max-w-[420px] md:max-w-[500px] lg:max-w-[560px] h-[220px] sm:h-[290px] md:h-[340px] lg:h-[380px]">
            <Image
              src="/images/nail-employee.png"
              alt="nail employee"
              width={420}
              height={280}
              className="absolute right-0 top-20 w-[60%] rounded-3xl object-cover transparent-border border-10"
            />
            <Image
              src="/images/hair-employee.png"
              alt="hair employee"
              width={420}
              height={280}
              className="absolute left-0 bottom-12 w-[60%] rounded-3xl object-cover transparent-border border-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
