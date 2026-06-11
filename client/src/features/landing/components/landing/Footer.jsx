export default function Footer() {
  return (
    <footer className="border-t py-16 bg-black">
      <div className="container mx-auto px-6">

        <div className="grid md:grid-cols-4 gap-10">

          <div>
            <h4 className="font-semibold text-slate-400">
              Product
            </h4>
            <ul className="space-y-3 mt-4 text-slate-400" >
              <li>Orders</li>
              <li>POS</li>
              <li>Inventory</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-400">
              Company
            </h4>
            <ul className="space-y-3 mt-4 text-slate-400">
              <li>About</li>
              <li>Careers</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-400">
              Resources
            </h4>
            <ul className="space-y-3 mt-4 text-slate-400">
              <li>Blog</li>
              <li>Documentation</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-400">
              Contact
            </h4>
            <ul className="space-y-3 mt-4 text-slate-400">
              <li>hello@foodmesh.com</li>
              <li>+91 98765 43210</li>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t pt-8 text-sm text-slate-500">
          © 2026 FoodMesh. All rights reserved.
        </div>

      </div>
    </footer>
  );
}