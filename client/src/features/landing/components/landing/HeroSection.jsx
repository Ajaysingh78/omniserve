import { motion } from "framer-motion";
import { Button } from "../ui/button";

export default function HeroSection() {
  return (
    <section className="overflow-hidden py-24">
      <div className="container mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity:0, y:30 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:.6 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
              Run Your Restaurant Operations From One Platform
            </h1>

            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
              Manage online orders, offline POS, inventory,
              customers, staff, and analytics with FoodMesh.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg">
                Book Demo
              </Button>

              <Button variant="outline" size="lg">
                Start Free Trial
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity:0, scale:.95 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ duration:.8 }}
          >
            <div className="rounded-3xl border bg-white  dark:bg-slate-900 shadow-2xl p-6">
              <img
                src="/dashboard-preview.png"
                alt="FoodMesh Dashboard"
                className="rounded-xl"
                loading="lazy"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}