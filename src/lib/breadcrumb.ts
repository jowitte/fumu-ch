/**
 * Brotkrumen-Pfad aus der URL: Zwischenstufen aus dem Slug, die aktuelle
 * Seite mit ihrem Titel. Speist die sichtbare Leiste und das
 * BreadcrumbList-JSON-LD im BaseLayout aus derselben Liste – vorher trug das
 * JSON-LD Slug-Namen wie «Ki transformation».
 */
export type Crumb = { name: string; url: string };

const fromSlug = (seg: string) => seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');

export const breadcrumbTrail = (pathname: string, title: string, siteUrl: string): Crumb[] => {
  const segments = pathname.split('/').filter(Boolean);
  return [
    { name: 'Home', url: `${siteUrl}/` },
    ...segments.map((seg, i) => ({
      name: i === segments.length - 1 ? title : fromSlug(seg),
      url: `${siteUrl}/${segments.slice(0, i + 1).join('/')}/`,
    })),
  ];
};
