export type IndustryTier = {
  id: string;
  tier_number: string;
  title: string;
  icon: string;
  items: string[];
  display_order: number | null;
};

export type Collaborator = {
  id: string;
  name: string | null;
  logo_url: string;
  website_url: string | null;
  display_order: number | null;
};