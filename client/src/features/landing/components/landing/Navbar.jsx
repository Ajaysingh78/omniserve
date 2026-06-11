import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 shadow-2xl bg-white/90 ">
      <div className="container mx-auto flex h-18 items-center justify-between px-6">
        
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600" />
          <span className="font-bold text-xl">
            FoodMesh
          </span>
        </div>

        <nav className="hidden md:flex gap-8 text-bold">
          <a href="#">Products</a>
          <a href="#">Solutions</a>
          <a href="#">About</a>
          <a href="#">Resources</a>
          <a href="#">Contact</a>
        </nav>

        <div className="flex gap-3">
          <Button variant="ghost">
            Login
          </Button>

          <Button>
            Book Demo
          </Button>
        </div>
      </div>
    </header>
  );
}