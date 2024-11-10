import {
  Tag,
  Settings,
  Bookmark,
  LayoutGrid,
  LucideIcon,
  Calendar1,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(basePath: string = "/dashboard"): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: `${basePath}`, // Dashboard route with basePath
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Events",
      menus: [
        {
          href: `${basePath}/myCalender`, // Event route with basePath
          label: "Event",
          icon: Calendar1,
          submenus: [],
        },
        {
          href: `${basePath}/categories`, // Categories route with basePath
          label: "Categories",
          icon: Bookmark,
        },
        {
          href: `${basePath}/tags`, // Tags route with basePath
          label: "Tags",
          icon: Tag,
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: `${basePath}/profile`, // Account route with basePath
          label: "Account",
          icon: Settings,
        },
      ],
    },
  ];
}
