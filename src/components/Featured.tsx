import { featuredServices } from "@/data/featuredServices";
import ServiceCard from "./ServiceCard";

function Featured() {
  return (
    <section className="w-full h-full select-none">
      <div className="mb-20 w-full laptop:mb-36 grid grid-cols-2 gap-6 tablet:grid-cols-2 tablet:gap-8  lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2">
        {featuredServices.map((item) => (
          <ServiceCard
            key={item.id}
            service={item.service}
            src={item.src}
            alt={item.alt}
          />
        ))}
      </div>
    </section>
  );
}

export default Featured;
