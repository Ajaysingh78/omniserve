import { Link } from "react-router-dom";

export default function AuthLayout({
  children,
  title,
  subtitle,
}) {
  return (
    <div className="min-h-screen flex bg-sky-100">
      {/* Left Section */}
      <div className=" lg:flex lg:w-1/2 relative  overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br " />

        <div className="absolute inset-0 " />

        <div className="relative z-10 flex flex-col justify-between p-12 text-slate-600 w-full">
          <div>
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-xl bg-white text-indigo-600 flex items-center justify-center font-bold text-xl">
                F
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  FoodMesh
                </h1>

                <p className="text-sm ">
                  Restaurant Operating System
                </p>
              </div>
            </Link>
          </div>

          {/* Content */}
          <div className="max-w-lg ">
            <h2 className="text-5xl font-bold leading-tight ">
              Manage every restaurant operation from one platform.
            </h2>

            <p className="mt-6 text-lg ">
              Orders, Inventory, CRM, Loyalty,
              Procurement, Staff Management and
              Analytics in a single operating system.
            </p>
          </div>

          {/* Footer */}
          <div className="text-sm ">
            © {new Date().getFullYear()} FoodMesh.
            All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                F
              </div>

              <span className="text-2xl font-bold text-white">
                FoodMesh
              </span>
            </Link>
          </div>

          {/* Card */}
          <div className="rounded-3xl border border-slate-900 bg-slate-600 p-8 shadow-2xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">
                {title}
              </h1>

              <p className="mt-2 text-slate-400">
                {subtitle}
              </p>
            </div>

            {children}
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm text-slate-500">
            <Link
              to="/privacy"
              className="hover:text-slate-900"
            >
              Privacy Policy
            </Link>

            <span className="mx-2">•</span>

            <Link
              to="/terms"
              className="hover:text-slate-900"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}