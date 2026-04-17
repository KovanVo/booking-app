import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 border-b">
        <h1 className="text-xl font-bold">Booking App</h1>
        <div className="flex gap-4 bg-red-500">
          <Button variant="ghost">Explore</Button>
          <Button>Sign In</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6">
        <h1 className="text-4xl font-bold mb-4">Book services instantly</h1>
        <p className="text-gray-500 mb-6">
          Discover top-rated salons and barbers near you
        </p>
        <Button size="lg">Book Now</Button>
      </section>

      {/* Featured */}
      <section className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Featured Businesses</h2>

        <div className="grid grid-cols-3 gap-4">
          <div className="border p-4 rounded-lg">
            <h3 className="font-medium">Elite Barbers</h3>
            <p className="text-sm text-gray-500">Haircuts from $25</p>
          </div>

          <div className="border p-4 rounded-lg">
            <h3 className="font-medium">Glow Spa</h3>
            <p className="text-sm text-gray-500">Facials from $40</p>
          </div>
        </div>
      </section>
    </main>
  );
}
