export type FeaturedService = {
  id: string;
  service: string;
  src: string;
  alt: string;
};

export const featuredServices: FeaturedService[] = [
  {
    id: "nails",
    service: "Nails",
    src: "/images/nail-employee2.webp",
    alt: "Nails service",
  },
  {
    id: "barber",
    service: "Barber",
    src: "/images/barber-employee.png",
    alt: "Barber service",
  },
  {
    id: "salon",
    service: "Salon",
    src: "/images/salon-employee.jpg",
    alt: "Salon service",
  },
  {
    id: "spa-sauna",
    service: "Spa & sauna",
    src: "/images/spa-sauna.jpg",
    alt: "spa-sauna",
  },
  {
    id: "medspa",
    service: "Medspa",
    src: "/images/medspa.jpg",
    alt: "medspa",
  },
  {
    id: "massage",
    service: "Massage",
    src: "/images/massage.jpg",
    alt: "massage",
  },

];
