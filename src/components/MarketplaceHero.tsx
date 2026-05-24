import Image from "next/image";
import { Button } from "./ui/button";

export default function MarketplaceHero() {
  return (
    <section className="mx-0 w-full px-4 sm:px-6 lg:px-10 flex flex-col select-none linear-gradient pt-40">
      <div className="center flex flex-col gap-10 mt-30 mb-70 ">
        <div className="flex flex-col">
          <h1 className="h1 text-6xl!">Book self-care services</h1>
          <p>
            Discover top-rated salons, barbers, medspas, wellness studios and
            beauty experts trusted by millions worldwide
          </p>
        </div>

        <div className="flex flex-row bg-white lg:w-250 rounded-full p-2 border-6 border-brand-light justify-between select-none ">
          <div className="flex justify-between gap-4 items-center mx-2">
            <Image
              src="/icons/search.svg"
              alt="search"
              width={20}
              height={20}
            />
            <div>search business...</div>
          </div>

          <Button className="primary-btn ">Submit</Button>
        </div>
      </div>
    </section>
  );
}
