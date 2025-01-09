"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import {
  Archive,
  CircleDollarSign,
  Clipboard,
  Layout,
  LucideIcon,
  Menu,
  SlidersHorizontal,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
  onClick?: () => any;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
  onClick,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        }
        hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
          isActive ? "bg-blue-200 text-white" : ""
        }
      }`}
        onClick={onClick}
      >
        <Icon className="w-6 h-6 !text-gray-700" />

        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium text-gray-700`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  // State to manage which submenu is open
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  // Toggle the submenu open/close
  const toggleSubMenu = (menu: string) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu); // Toggle submenu
  };

  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
  } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

  return (
    <div className={sidebarClassNames}>
      {/* TOP LOGO */}
      <div
        className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${
          isSidebarCollapsed ? "px-5" : "px-8"
        }`}
      >
        <Image
          src="https://s3-inventorymanagement.s3.us-east-2.amazonaws.com/logo.png"
          alt="edstock-logo"
          width={27}
          height={27}
          className="rounded w-8"
        />
        <h1
          className={`${
            isSidebarCollapsed ? "hidden" : "block"
          } font-extrabold text-2xl`}
        >
          Megazen
        </h1>

        <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* LINKS */}
      <div className="flex-grow mt-8">
        <SidebarLink
          href="/dashboard"
          icon={Layout}
          label="Dashboard"
          isCollapsed={isSidebarCollapsed}
        />
        {/* Inventory with Submenu */}
        <div>
          <SidebarLink
            href="/inventory"
            icon={Archive}
            label="Inventory"
            isCollapsed={isSidebarCollapsed}
            onClick={() => toggleSubMenu("inventory")}
          />
          {openSubMenu === "inventory" && (
            <div className="pl-8">
              <SidebarLink
                href="/inventory/submenu1"
                icon={Clipboard}
                label="Submenu inventory 1"
                isCollapsed={isSidebarCollapsed}
              />
              <SidebarLink
                href="/inventory/submenu2"
                icon={Clipboard}
                label="Submenu inventory 2"
                isCollapsed={isSidebarCollapsed}
              />
            </div>
          )}
        </div>
        {/* <SidebarLink
          href="/inventory"
          icon={Archive}
          label="Inventory"
          isCollapsed={isSidebarCollapsed}
        /> */}
        {/* Products with Submenu */}
        <div>
          <SidebarLink
            href="#"
            icon={Clipboard}
            label="Products"
            isCollapsed={isSidebarCollapsed}
            onClick={() => toggleSubMenu("products")}
          />
          {openSubMenu === "products" && !isSidebarCollapsed && (
            <div className="pl-8">
               <SidebarLink
                href="/products/categories"
                icon={Clipboard}
                label="Categories"
                isCollapsed={isSidebarCollapsed}
              />
              <SidebarLink
                href="/products"
                icon={Clipboard}
                label="Products"
                isCollapsed={isSidebarCollapsed}
              />
             
              <SidebarLink
                href="/products/variants"
                icon={Clipboard}
                label="Product Variants"
                isCollapsed={isSidebarCollapsed}
              />
            </div>
          )}
        </div>

        <SidebarLink
          href="/users"
          icon={User}
          label="Users"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/settings"
          icon={SlidersHorizontal}
          label="Settings"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/expenses"
          icon={CircleDollarSign}
          label="Expenses"
          isCollapsed={isSidebarCollapsed}
        />
      </div>

      {/* FOOTER */}
      <div className={`${isSidebarCollapsed ? "hidden" : "block"} mb-10`}>
        <p className="text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Megazen
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
