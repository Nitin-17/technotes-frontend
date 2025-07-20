const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 text-center text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} TechNotes Hub. All rights reserved.
        </p>
        <div className="mt-4 space-x-4">
          <a href="#" className="hover:text-teal-400">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-teal-400">
            Terms of Service
          </a>
          <a href="#" className="hover:text-teal-400">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
