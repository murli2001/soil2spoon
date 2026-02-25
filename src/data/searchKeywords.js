/**
 * Relatable keywords for search: maps user-friendly or alternate terms to
 * categories and product search terms so suggestions stay relevant.
 */

/** Keywords that map to category ids (e.g. "masala" → show spices) */
export const categoryKeywords = {
  masala: ['spices'],
  spice: ['spices'],
  spices: ['spices'],
  condiment: ['spices'],
  paste: ['pastes'],
  pastes: ['pastes'],
  sauce: ['pastes'],
  chutney: ['pastes'],
  spread: ['pastes'],
  powder: ['powders'],
  powders: ['powders'],
  dust: ['powders'],
}

/** Keywords that map to terms used in product name/description (e.g. "lahsun" → search "garlic") */
export const termSynonyms = {
  lahsun: ['garlic'],
  adrak: ['ginger'],
  pyaaz: ['onion'],
  mirchi: ['chilli', 'chili'],
  lal: ['red'],
  haldi: ['turmeric'],
  garlic: ['garlic'],
  ginger: ['ginger'],
  onion: ['onion'],
  chilli: ['chilli', 'chili'],
  chili: ['chilli', 'chili'],
  chile: ['chilli', 'chili'],
  spicy: ['chilli', 'spicy', 'heat'],
  hot: ['chilli', 'spicy', 'heat'],
  red: ['red', 'chilli'],
  turmeric: ['turmeric'],
  curry: ['curry', 'curries', 'spice'],
  marinade: ['marinade', 'marinades', 'paste'],
  cooking: ['curry', 'curries', 'cooking', 'kitchen'],
  indian: ['indian', 'curry', 'spice'],
  authentic: ['authentic', 'traditional'],
}

/**
 * Returns category ids and search terms to use for a given query (relatable suggestions).
 * @param {string} query - Normalized search query (lowercase, trimmed)
 * @returns {{ categoryIds: string[], terms: string[] }}
 */
export function getSearchExpansion(query) {
  const q = query.toLowerCase().trim()
  const categoryIds = categoryKeywords[q] ? [...categoryKeywords[q]] : []
  const terms = [q]
  if (termSynonyms[q]) {
    termSynonyms[q].forEach((t) => {
      if (!terms.includes(t)) terms.push(t)
    })
  }
  return { categoryIds, terms }
}

/**
 * Returns true if the product matches the search (direct or via relatable keywords).
 * @param {Object} product - Product object (name, description, category, highlights)
 * @param {string} searchQuery - Raw search query
 * @param {string[]} effectiveTerms - Terms to match in name/description/features
 * @param {string[]} effectiveCategoryIds - Category ids to include
 */
export function productMatchesSearch(product, searchQuery, effectiveTerms, effectiveCategoryIds) {
  const inCategory = effectiveCategoryIds.length > 0 && effectiveCategoryIds.includes(product.category)
  const text = [
    product.name,
    product.description,
    product.highlights?.keyFeatures,
    product.highlights?.flavour,
    product.highlights?.ingredients,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  const matchesText = effectiveTerms.some((term) => text.includes(term.toLowerCase()))
  return inCategory || matchesText
}
