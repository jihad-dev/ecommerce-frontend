import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  Users2,
} from "lucide-react";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  children?: { to: string; label: string }[];
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon,
  label,
  active,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = children && children.length > 0;

  const toggleSubmenu = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="mb-1">
      <Link
        to={hasChildren ? "#" : to}
        onClick={toggleSubmenu}
        className={`
          flex items-center px-4 py-2.5 text-sm font-medium rounded-md w-full
          transition-colors duration-200
          ${
            active && !hasChildren
              ? "bg-blue-100 text-blue-700"
              : "text-gray-700 hover:bg-gray-100"
          }
        `}
      >
        <span className="mr-3 text-lg">{icon}</span>
        <span className="flex-1">{label}</span>
        {hasChildren && (
          <span className="ml-auto">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
      </Link>

      {hasChildren && isOpen && (
        <div className="ml-10 mt-1 space-y-1">
          {children.map((child, index) => (
            <Link
              key={index}
              to={child.to}
              className={`
                block px-3 py-2 text-sm font-medium rounded-md
                ${
                  location.pathname === child.to
                    ? "text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }
              `}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    {
      to: "/dashboard/admin-home",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      to: "/dashboard/products",
      icon: <Package size={20} />,
      label: "Products",
      children: [
        { to: "/dashboard/products", label: "All Products" },
        { to: "/dashboard/products/add-product", label: "Add Product" },
      ],
    },
    {
      to: "/dashboard/categories",
      icon: <Package size={20} />,
      label: "Categories",
      children: [
        { to: "/dashboard/categories", label: "All Categories" },
        { to: "/dashboard/categories/add-category", label: "Add Category" },
      ],
    },
    {
      to: "/dashboard/orders",
      icon: <ShoppingCart size={20} />,
      label: "Orders",
    },
    {
      to: "/dashboard/customers",
      icon: <Users size={20} />,
      label: "Customers",
    },
    {
      to: "/analytics",
      icon: <BarChart size={20} />,
      label: "Analytics",
    },
    {
      to: "/dashboard/All-admin",
      icon: <Users2 size={20} />,
      label: "All Admin",
    },
    {
      to: "/",
      icon: <Home size={20} />,
      label: "Home",
    },
  ];

  // If on mobile, render a responsive sidebar
  if (isMobile) {
    return (
      <div
        className={`
        fixed inset-0 z-40 flex transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Overlay */}
        <div
          className={`
            fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300
            ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
          onClick={onClose}
        />

        {/* Sidebar */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onClose}
            >
              <span className="sr-only">Close sidebar</span>
              <X size={24} className="text-white" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Link to="/dashboard/admin-home">
                <h1 className="text-xl font-bold text-blue-600">E-Shop</h1>
              </Link>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <SidebarLink
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={location.pathname === item.to}
                  children={item.children}
                />
              ))}
            </nav>
          </div>
        </div>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-b border-gray-200">
            <Link to="/dashboard/admin-home">
              <h1 className="text-xl font-bold text-blue-600">E-Shop</h1>
            </Link>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-3 py-4 bg-white space-y-1">
              {navigation.map((item) => (
                <SidebarLink
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={location.pathname === item.to}
                  children={item.children}
                />
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
