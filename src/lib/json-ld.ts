/**
 * JSON-LD für `<script type="application/ld+json" set:html={…}>`.
 * JSON.stringify lässt `<` stehen – ein `</script>` im Inhalt (etwa in einer
 * FAQ-Antwort) würde den Block vorzeitig schliessen. Als < bleibt das
 * JSON gleichwertig und der Block heil.
 */
export const jsonLd = (data: unknown): string => JSON.stringify(data).replace(/</g, '\\u003c');
