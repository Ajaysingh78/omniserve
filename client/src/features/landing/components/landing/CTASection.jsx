import { Button } from "../ui/button";

export default function CTASection() {
  return (
    <section className="py-32">

      <div className="container mx-auto px-6">

        <div
          className="
          rounded-3xl
          bg-blue-600
          text-white
          p-16
          text-center
          "
        >
          <h2 className="text-5xl font-bold">
            Everything Your Restaurant Needs To Grow
          </h2>

          <p className="mt-6 text-blue-100">
            Streamline operations and scale confidently.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Button variant="secondary">
              Book Demo
            </Button>

            <Button variant="outline">
              Start Free Trial
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}