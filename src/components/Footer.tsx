const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg text-primary">PricePredict</h3>
            <p className="text-sm text-muted-foreground mt-1">
              AI-Powered House Price Prediction System
            </p>
          </div>
          
          <div className="text-center md:text-right text-sm text-muted-foreground">
            <p>&copy; 2025 PricePredict. All rights reserved.</p>
            <p className="mt-1">Built with advanced ML technology</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
