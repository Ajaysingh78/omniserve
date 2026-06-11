import {
  ShoppingBag,
  Store,
  Boxes,
  Users,
  UserCog,
  BarChart3
} from "lucide-react";

const features = [
  {
    icon: ShoppingBag,
    title: "Online Order Management",
    desc: "Manage all delivery channels from one dashboard."
  },
  {
    icon: Store,
    title: "Offline POS",
    desc: "Fast and reliable billing system."
  },
  {
    icon: Boxes,
    title: "Inventory Management",
    desc: "Automated stock tracking and alerts."
  },
  {
    icon: Users,
    title: "Customer CRM",
    desc: "Build loyalty and customer retention."
  },
  {
    icon: UserCog,
    title: "Staff Management",
    desc: "Monitor attendance and productivity."
  },
  {
    icon: BarChart3,
    title: "Business Analytics",
    desc: "Real-time insights for better decisions."
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-28">
      <div className="container mx-auto px-6">

        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold">
            Everything You Need To Run Your Restaurant
          </h2>
        </div>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8  ">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="
              rounded-2xl
              p-8 bg-slate-200
              hover:shadow-xl
              transition-all
              "
            >
              <feature.icon className="h-10 w-10 text-blue-600" />

              <h3 className="mt-6 font-semibold text-xl">
                {feature.title}
              </h3>

              <p className="mt-3 text-slate-600">
                {feature.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}