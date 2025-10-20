"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavigationProps {
  navLinks: Array<NavLink>;
}

export interface NavLink {
  title: string;
  url: string;
  isHiddenFromNavigation: boolean;
}

const Navigation: React.FC<NavigationProps> = (props) => {
  const navLinks = props?.navLinks || [];
  if (!navLinks) {
    return null;
  }

  const pathname = usePathname();
  const activeLink =
    navLinks.find((link: NavLink) => link.url === pathname)?.url || null;

  // Only include links that are not hidden from navigation
  const filteredLinks = navLinks.filter(
    (link: NavLink) => !link.isHiddenFromNavigation
  );

  return (
    <div className="flex justify-between items-center bg-carbon px-8 py-4">
      <Link href="/">
        <h2 className="text-white text-xl font-bold">ARCTIC INSIGHTS</h2>
      </Link>
      <nav>
        {filteredLinks.map((e: NavLink, i: number) => {
          return (
            <span
              className={`p-6 text-lg text-white hover:underline hover:text-gray-300 underline-offset-2 decoration-2 ${
                activeLink === e.url ? "underline" : ""
              }`}
              key={i}
            >
              <Link href={e.url}>{e.title}</Link>
            </span>
          );
        })}
      </nav>
    </div>
  );
};

export default Navigation;
