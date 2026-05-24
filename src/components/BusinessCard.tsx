import Link from "next/link";

export default function BusinessCard({
  id,
  name,
  description,
}: {
  id: string;
  name: string;
  description: string;
}) {
  return (
    <Link href={`/business/${id}`}>
      <div key={id} className="border p-4 rounded-xl shadow border-brand ">
        <h2 className="text-lg font-bold mb-2">{name}</h2>
        <p>{description}</p>
      </div>
    </Link>
  );
}
