// Mirrors the `people` table described in docs/DATABASE.md.
export type PersonRole = "faculty" | "student" | "postdoc" | "alumni";

export type Person = {
  id: string;
  name: string;
  image_url: string;
  webmail: string | null;
  link: string | null;
  role: PersonRole;
  year: string | null; // student, postdoc, alumni
  department: string | null; // faculty
  department_category: string | null; // faculty — used for the sidebar filter
  office_contact: string | null; // faculty
  research_interest: string | null; // faculty
  focus: string[]; // faculty — search keywords, not displayed publicly
};
