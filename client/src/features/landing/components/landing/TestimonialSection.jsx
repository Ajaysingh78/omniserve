const testimonials = [
  {
    name:"Nitish Kumar",
    company:"Spice Garden",
    role:"Restaurant Owner",
    review:"FoodMesh helped us centralize operations and reduce manual work."
  },
  {
    name:"Samir Singh",
    company:"Burger Nation",
    role:"Operations Manager",
    review:"Inventory and order management became incredibly easy."
  },
  {
    name:"Yusuf Pathan",
    company:"Urban Kitchen",
    role:"Franchise Owner",
    review:"Managing multiple outlets is now seamless."
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-28 bg-slate-50 dark:bg-slate-400">

      <div className="container mx-auto px-6">

        <h2 className="text-center text-4xl font-bold">
          Loved By Restaurant Teams
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-16">

          {testimonials.map((item) => (
            <div
              key={item.name}
              className="bg-white  p-8 rounded-2xl border"
            >
              <p>"{item.review}"</p>

              <div className="mt-6">
                <h4 className="font-semibold">
                  {item.name}
                </h4>

                <p className="text-sm text-slate-500">
                  {item.role}
                </p>

                <p className="text-sm text-blue-600">
                  {item.company}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}