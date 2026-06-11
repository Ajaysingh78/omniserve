export default function TrustedBy() {
  const logos = [
    "Burger House",
    "Pizza Hub",
    "Food Factory",
    "Cafe Central",
    "Urban Kitchen"
  ];

  return (
    <section className="py-20  ml-4 mr-4">
      <div className="container mx-auto px-6">

        <p className="text-center text-sm uppercase tracking-widest text-slate-500">
          Trusted by Restaurants
        </p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-8  ">
          {logos.map((logo) => (
            <div
              key={logo}
              className="text-center text-lg font-semibold h-14 rounded-2xl bg-slate-200 text-black"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}