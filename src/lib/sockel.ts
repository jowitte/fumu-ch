/**
 * Auswahl der Perspektiven für den Sockel unter einem Artikel (Redesign
 * 2026-11): bis zu n weitere Perspektiven desselben Themas, neueste zuerst.
 * Hat der Artikel kein Thema oder steht er allein darin, die n neuesten aller
 * Perspektiven. Der Artikel selbst ist nie dabei.
 */
export type BlattPost = {
  id: string;
  title: string;
  description: string;
  date: Date;
  series?: string;
};

const newestFirst = (a: BlattPost, b: BlattPost) => b.date.getTime() - a.date.getTime();

export const sockelPerspektiven = (posts: BlattPost[], current: BlattPost, n = 3): BlattPost[] => {
  const others = posts.filter(post => post.id !== current.id).sort(newestFirst);
  const sameSeries = current.series ? others.filter(post => post.series === current.series) : [];
  return (sameSeries.length > 0 ? sameSeries : others).slice(0, n);
};

export type SockelKopf = { titel: string; link: { label: string; href: string } };

/**
 * Überschrift über den Blättern: «Mehr aus dem Thema …» nur, wenn die
 * Auswahl wirklich aus dem Thema stammt. Steht der Artikel allein in seinem
 * Thema, zeigt der Sockel die neuesten aller Perspektiven – dann heisst er
 * «Perspektiven».
 */
export const sockelKopf = (
  auswahl: BlattPost[],
  current: BlattPost,
  thema?: { name: string; href: string },
): SockelKopf => {
  const ausThema = Boolean(thema && current.series) && auswahl.length > 0 && auswahl.every(post => post.series === current.series);
  return ausThema && thema
    ? { titel: `Mehr aus dem Thema ${thema.name}`, link: { label: 'Zum Thema', href: thema.href } }
    : { titel: 'Perspektiven', link: { label: 'Alle Perspektiven', href: '/perspektiven/' } };
};
