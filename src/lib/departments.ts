// Departments a faculty member can belong to. `value` is what's stored in
// people.department; `label` is the short name shown in filters. Shared by
// the public People page and the admin form so the two can't disagree.
export const DEPARTMENTS = [
  { value: 'Electrical Engineering', label: 'Electrical' },
  { value: 'Mechanical Engineering', label: 'Mechanical' },
  { value: 'Computer Science and Engineering', label: 'Computer Science' },
  { value: 'Applied Mechanics', label: 'Applied Mechanics' },
  { value: 'Center for Automotive Research and Tribology', label: 'C.A.R.T.' },
  { value: 'School of AI', label: 'School of AI' },
] as const;