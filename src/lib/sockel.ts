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
