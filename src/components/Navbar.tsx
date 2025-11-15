import { NavLink } from "@/components/NavLink";
import { Home, Calculator, Info, Mail } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-xl text-primary hover:text-primary-light transition-colors">
            <Home className="w-6 h-6" />
            <span>PricePredict</span>
          </NavLink>
          
          <div className="flex items-center gap-6">
            <NavLink 
              to="/" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary font-semibold"
            >
              Home
            </NavLink>
            <NavLink 
              to="/predict" 
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              activeClassName="text-primary font-semibold"
            >
              <Calculator className="w-4 h-4" />
              Predict Price
            </NavLink>
            <NavLink 
              to="/about" 
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              activeClassName="text-primary font-semibold"
            >
              <Info className="w-4 h-4" />
              About
            </NavLink>
            <NavLink 
              to="/contact" 
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              activeClassName="text-primary font-semibold"
            >
              <Mail className="w-4 h-4" />
              Contact
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
