import type { Metadata } from 'next';

const SITE_NAME = 'CoE on BIRD | IIT Delhi';
const SITE_URL = 'https://robotics.iitd.ac.in';
// TODO: replace with a dedicated 1200x630 social-preview image —
// the logo works but will look cropped/small in link previews.
const DEFAULT_OG_IMAGE = '/Assets/logos/bird.png';

export function buildMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} | CoE BIRD IIT Delhi`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: `${SITE_URL}${path}`,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}