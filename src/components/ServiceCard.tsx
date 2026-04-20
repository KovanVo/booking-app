import Image from "next/image";
import { Button } from "./ui/button";

function ServiceCard({
  key,
  service,
  src,
  alt,
}: {
  key:string
  service: string;
  src: string;
  alt: string;
}) {
  return (
    <div className="group relative aspect-3 w-full min-h-0 overflow-hidden rounded-[18px] ">
      <Image
        src={src}
        alt={alt}
        width={600}
        height={600}
        className="w-full h-full rounded-[18px] object-cover transition-transform duration-300 ease-out group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

      <div className="absolute inset-0 z-10 w-full p-4 md:p-8 flex items-end">
        <div className="flex w-full justify-between items-end ">
          <h2 className="h2 font-medium text-white p-2">{service}</h2>
          <Button className="arrow-btn">
            <Image
              src="/icons/arrow-button.svg"
              alt="arrow-button"
              width={50}
              height={50}
              className="p-1"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
