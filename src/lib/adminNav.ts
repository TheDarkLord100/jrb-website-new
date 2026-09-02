export type NavChild = { id: string; label: string; href: string };
export type NavNode = { id: string; label: string; href?: string; children?: NavChild[] };

export const ADMIN_NAV: NavNode[] = [
  { id: 'about', label: 'about', href: '/admin/dashboard' },
  {
    id: 'academics',
    label: 'academics',
    children: [
      { id: 'admissions', label: 'admissions', href: '/admin/dashboard/academics/admissions' },
      { id: 'minor', label: 'minor', href: '/admin/dashboard/academics/minor' },
      { id: 'mtech', label: 'mtech', href: '/admin/dashboard/academics/mtech' },
    ],
  },
  { id: 'contact', label: 'contact', href: '/admin/dashboard/contact' },
  { id: 'events', label: 'events', href: '/admin/dashboard/events' },
  { id: 'industry', label: 'industry', href: '/admin/dashboard/industry' },
  { id: 'people', label: 'people', href: '/admin/dashboard/people' },
  {
    id: 'research',
    label: 'research',
    children: [
      { id: 'facilities', label: 'facilities', href: '/admin/dashboard/research/facilities' },
      { id: 'themes', label: 'themes', href: '/admin/dashboard/research/themes' },
    ],
  },
];

// Used by both the sidebar (to highlight + auto-expand the right group)
// and the top bar (to build the breadcrumb) from the current URL.
export function findActiveNav(pathname: string) {
  for (const node of ADMIN_NAV) {
    if (node.href === pathname) return { node, parent: null as NavNode | null };
    if (node.children) {
      const child = node.children.find((c) => c.href === pathname);
      if (child) return { node: child as NavNode, parent: node };
    }
  }
  return { node: null as NavNode | null, parent: null as NavNode | null };
}