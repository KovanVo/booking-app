import Image from "next/image";

declare interface Props {
  sub_heading: string;
  list1: string;
  list2: string;
  list3: string;
}

function InfoCard({ sub_heading, list1, list2, list3 }: Props) {
  return (
    <div>
      <p className="mb-4 font-medium">{sub_heading}</p>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Image
            src="/icons/tick.svg"
            alt="tick"
            width={20}
            height={20}
            className="size-5 m-1"
          />
          <p className="text-[15px] leading-[24px]">{list1}</p>
        </div>
        <div className="flex gap-2">
          <Image
            src="/icons/tick.svg"
            alt="tick"
            width={20}
            height={20}
            className="size-5 m-1"
          />
          <p className="text-[15px] leading-[24px]">{list2}</p>
        </div>
        <div className="flex gap-2">
          <Image
            src="/icons/tick.svg"
            alt="tick"
            width={20}
            height={20}
            className="size-5 m-1"
          />
          <p className="text-[15px] leading-[24px]">{list3}</p>
        </div>
      </div>
    </div>
  );
}

export default InfoCard;
