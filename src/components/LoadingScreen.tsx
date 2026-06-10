import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Image
        src="/icons/loader.svg"
        alt="loading"
        width={50}
        height={50}
        className="animate-spin invert"
        loading="lazy"
      />
    </div>
  );
}
