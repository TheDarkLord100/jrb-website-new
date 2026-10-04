// Mirrors the `people` table described in docs/DATABASE.md.
export type PersonRole = 'faculty' | 'student' | 'postdoc' | 'alumni';

export type Person = {
  id: string;
  name: string;
  image_url: string;
  webmail: string | null;
  link: string | null;
  google_scholar_url: string | null; // faculty, mainly -- shown wherever it's set
  role: PersonRole;
  year: string | null; // student/alumni: batch "YYYY-YY" (see lib/batches); postdoc: free text
  department: string | null; // faculty
  office_contact: string | null; // faculty
  research_interest: string | null; // faculty
  focus: string[]; // faculty — search keywords, not displayed publicly
  priority?: number | null; // lower shows first; null/missing sorts last
  special_designation?: string | null; // e.g. "Coordinator, CoE-BIRD"
};

// The columns the admin form writes. Listed explicitly (rather than
// Omit<Person, 'id'>) so a row read with extra columns -- timestamps, say --
// never gets those sent back on update.
export type PersonInput = {
  name: string;
  image_url: string;
  webmail: string | null;
  link: string | null;
  google_scholar_url: string | null;
  role: PersonRole;
  year: string | null;
  department: string | null;
  office_contact: string | null;
  research_interest: string | null;
  focus: string[];
  priority: number | null;
  special_designation: string | null;
};