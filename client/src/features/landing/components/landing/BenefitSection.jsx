import {
  CheckCircle2
} from "lucide-react";

const benefits = [
  "Reduce manual work",
  "Increase order efficiency",
  "Manage multiple outlets",
  "Improve customer retention",
  "Track business performance"
];

export default function BenefitsSection() {
  return (
    <section className="py-28">
      <div className="container mx-auto px-6">

        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold">
            Why FoodMesh?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-16">
          {benefits.map((item) => (
            <div
              key={item}
              className="border rounded-2xl p-6"
            >
              <CheckCircle2 className="text-green-500" />

              <p className="mt-4 font-medium">
                {item}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}