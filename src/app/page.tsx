"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import Featured from "@/components/Featured";
import { subParagraphs } from "@/lib/constants/textLayouts";
import Image from "next/image";
import InfoCard from "@/components/InfoCard";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      <Hero />

      <section className="py-20 px-10 lg:px-25 md:px-10 max-sm:px-5">
        <div className="business-section">
          <div className="mx-32">
            <h2 className="text-4xl font-bold">
              One platform, endless possibilities
            </h2>
            <p className="py-2">
              Everything you need to grow and thrive. This booking platform is
              packed with tools to boost sales, manage your calendar, and retain
              clients, so you can focus on what you do best.
            </p>
          </div>
          <Button className="primary-btn">Get started</Button>
          <Featured />
        </div>
      </section>

      <section className="py-20 px-10 lg:px-25 md:px-10 max-sm:px-5 linear-gradient text-white">
        <div className="md:px-10 max-sm:px-5">
          <div>
            <h1 className="mb-3 text-pretty text-[32px] font-bold leading-10 tablet:text-5xl">
              Everything you need to run your business
            </h1>
            <p className="max-w-[750px] pb-16">
              KTT Booking offers innovative features that bring convenience,
              efficiency, and an improved experience for both your team members
              and clients.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 md:gap-10 md:grid-cols-2 gap-16">
            {subParagraphs.map((item) => (
              <div key={item.id}>
                <h2 className="h2 ">{item.heading}</h2>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-10 lg:px-25 md:px-10 max-sm:px-5 ">
        <div className="items-center gap-10 lg:gap-40 grid lg:grid-cols-2 md:grid-cols-1 md:px-10">
          <div className="flex flex-col justify-center gap-4">
            <h1 className="text-4xl font-extrabold">
              All-in-one <span className="text-gradient">software</span> to run
              your business
            </h1>
            <InfoCard
              sub_heading="Most loved and the top-rated booking software for salons, spas, and other beauty and wellness businesses"
              list1="Powerful calendar with unlimited bookings, clients, locations, and much more"
              list2="Advanced insights providing a 360 degree view of each client, including booking behaviors, client preferences, preferred payment methods, preferred marketing channels, lifetime value and more"
              list3="Crafted to deliver a smooth experience that enhances your business and elevates your brand"
            />
          </div>
          <div>
            <Image
              src="/images/image-placeholder.png"
              alt="image-placeholder"
              width={500}
              height={500}
              className="w-full h-full rounded-[30px]"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-10 lg:px-25 md:px-10 max-sm:px-5 bg-[#f9f9f9]">
        <div className="items-center gap-10 lg:gap-40 grid lg:grid-cols-2 md:grid-cols-1 md:px-10">
          <div>
            <Image
              src="/images/image-placeholder.png"
              alt="image-placeholder"
              width={500}
              height={500}
              className="w-full h-full rounded-[30px]"
            />
          </div>
          <div className="flex flex-col justify-center gap-4">
            <h1 className="text-4xl font-extrabold">
              The most popular{" "}
              <span className="text-gradient">marketplace</span> to grow your
              business
            </h1>
            <InfoCard
              sub_heading="Promote your business and reach new clients on the world's largest beauty and wellness marketplace"
              list1="Increase your online visibility by listing your business on Fresha marketplace"
              list2="Reach millions of clients looking to book their next appointment today"
              list3="Free up time and get your clients self-booking online 24/7"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-10 lg:px-25 md:px-10 max-sm:px-5">
        <div className="items-center gap-10 lg:gap-40 grid lg:grid-cols-2 md:grid-cols-1 md:px-10">
          <div className="flex flex-col justify-center gap-4">
            <h1 className="text-4xl font-extrabold">
              Power your business with{" "}
              <span className="text-gradient">payments</span>
            </h1>
            <InfoCard
              sub_heading="Enjoy low cost, safe and hassle-free payments. Integrated directly to your account for effortless checkout."
              list1="Take payments anywhere easily, quickly and seamlessly online or in-store with Fresha terminal"
              list2="Reduce no-shows and cancellations by collecting full upfront payments or taking a deposit at the time of booking"
              list3="Keep your bank account topped up with daily payouts"
            />
            <div className="flex w-[33%] p-2! rounded-full primary-btn">
              <Button className="font-bold">Find out more</Button>
              <Image
                src="/icons/arrow.svg"
                alt="arrow"
                width={20}
                height={20}
                className="invert"
              />
            </div>
          </div>
          <div>
            <Image
              src="/images/image-placeholder.png"
              alt="image-placeholder"
              width={500}
              height={500}
              className="w-full h-full rounded-[30px]"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-10 lg:px-50 md:px-auto max-sm:px-5 angular-gradient">
        <div className="flex flex-col items-center text-center justify-center text-white gap-4">
          <h1 className="text-4xl font-extrabold">What are you waiting for?</h1>
          <p className="font-semibold">
            Partner with KTT Booking and start growing your business today
          </p>
          <Button className="light-btn font-bold">Get started started!</Button>
        </div>
      </section>

      <footer>
        <div className="mx-auto">
          <div className="flex my-0 items-center justify-between px-8 py-6 text-white bg-black">
            <h2 className="font-bold">English</h2>
            <h3 className="text-sm">© 2026 KTT Booking</h3>
          </div>
        </div>
      </footer>
    </main>
  );
}
