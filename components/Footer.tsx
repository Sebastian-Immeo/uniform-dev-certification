import React from "react";
import Link from "next/link";

export default function Footer() {
  const navList1 = [...Array(6)];
  const navList2 = [...Array(5)];

  return (
    <footer>
      <div className="w-full bg-carbon p-8">
        <div className="space-y-8">
          <div className="grid gap-8 sm:grid-cols-3 border-b-2 border-gray-700 pb-8">
            <div className="space-y-4">
              <h3 className="text-white">Newsletter</h3>
              <p className="text-white max-w-md">
                Sign up to our newsletter lorem ipsum dolore sit amet
                consectetur
              </p>
              <button className="bg-white text-black hover:bg-gray-100 px-6 py-2">
                Sign up
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-white">Navlist 1</h3>
              <ul className="space-y-2">
                {navList1.map((_, i) => (
                  <li key={i}>
                    <Link
                      href="#"
                      className="text-white hover:text-gray-300 hover:underline transition-colors underline-offset-2 decoration-2"
                    >
                      Nav Link here {`#${i + 1}`}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-white">Navlist 2</h3>
              <ul className="space-y-2">
                {navList2.map((_, i) => (
                  <li key={i}>
                    <Link
                      href="#"
                      className="text-white hover:text-gray-300 hover:underline transition-colors underline-offset-2 decoration-2"
                    >
                      Nav Link here {`#${i + 1}`}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-white">Logo</h3>
            <div className="space-y-1">
              <p className="text-white">Park Alle 345</p>
              <p className="text-white">2605 Brøndby</p>
              <p className="text-white">Denmark</p>
              <p className="text-white">Call +45 43 25 00 00</p>
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
