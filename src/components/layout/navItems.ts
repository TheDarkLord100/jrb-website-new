// src/components/layout/navItems.ts

export type NavChild = {
  label: string;
  href?: string;
  children?: NavChild[];
};

export type NavItem = {
  label: string;
  href?: string;
  children?: NavChild[];
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Research',
    children: [
      { label: 'Themes', href: '/research/themes' },
      { label: 'Facilities', href: '/research/facilities' },
    ],
  },
  { label: 'People', href: '/people' },
  {
    label: 'Academics',
    children: [
      {
        label: 'Programmes',
        children: [
          { label: 'M.Tech. in Robotics', href: '/academics/mtech' },
          { label: 'Minor Degree in Robotics', href: '/academics/minor' },
        ],
      },
      { label: 'Admissions', href: '/academics/admissions' },
    ],
  },
  { label: 'Events', href: '/events' },
  { label: 'Industry Connect', href: '/industry' },
  { label: 'Contact Us', href: '/contact' },
];

export const INTERNAL_NAV_ITEM: NavItem = { label: 'Internal', href: '/internal' };