import React from "react";
import Link from "next/link";

export default function Footer() {
  const navList1 = [
    { label: "About Us", href: "/about" },
    { label: "Our Services", href: "/services" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ];

  const navList2 = [
    { label: "Help Center", href: "/help" },
    { label: "Documentation", href: "/docs" },
    { label: "Support", href: "/support" },
    { label: "Status", href: "/status" },
    { label: "Community", href: "/community" },
  ];

  return (
    <footer>
      <div className="rich-text w-full bg-carbon p-8">
        <div className="space-y-8">
          <div className="grid gap-8 sm:grid-cols-3 border-b-2 border-gray-700 pb-8">
            <div className="space-y-4">
              <h3 className="text-white">Newsletter</h3>
              <p className="text-white max-w-xs">
                Sign up to our newsletter lorem ipsum dolore sit amet
                consectetur
              </p>
              <button className="bg-white text-black hover:bg-gray-100 px-6 py-2">
                Sign up
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-white">Company</h3>
              <ul className="space-y-2 list-none p-0">
                {navList1.map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.href}
                      className="text-white hover:text-gray-300 decoration-none no-underline hover:underline transition-colors underline-offset-2 decoration-2"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-white">Support</h3>
              <ul className="space-y-2 list-none p-0">
                {navList2.map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.href}
                      className="text-white hover:text-gray-300 hover:underline no-underline transition-colors underline-offset-2 decoration-2"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-white">Main Street 123</p>
              <p className="text-white">10001 New York</p>
              <p className="text-white">United States</p>
              <p className="text-white">Call +1 (555) 123-4567</p>
            </div>
          </div>

          {/* Terms Section */}
          <div className="space-y-2 flex flex-col sm:flex-row sm:gap-3">
            <Link
              href="#"
              className=" text-white hover:text-gray-300 transition-colors"
            >
              Data protection notice
            </Link>
            <Link
              href="#"
              className=" text-white hover:text-gray-300 transition-colors"
            >
              Terms of use and Privacy Policy
            </Link>
            <Link
              href="#"
              className=" text-white hover:text-gray-300 transition-colors"
            >
              Cookie settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
