/**
 * Default Information card content (disclaimer, customer care, seller, etc.).
 * Products can override via product.information for fields like shelfLife, manufacturerName.
 */
export const defaultInformation = {
  disclaimer:
    'All images are for representational purposes only. It is advised that you read the batch and manufacturing details, directions for use, allergen information, health and nutritional claims (wherever applicable), and other details mentioned on the label before consuming the product. For combo items, individual prices can be viewed on the page.',
  customerCareDetails:
    'In case of any issue, contact us\nE-mail address: support@zeptonow.com',
  sellerName: 'Geddit Convenience Private Limited',
  sellerAddress:
    'Geddit Convenience Private Limited, Unit 803, Lodha Supremus, Saki Vihar Road, Opp MTNL, Office, Powai, Mumbai, Maharashtra, India, 400072. For Support ReachOut: support+geddit@zeptonow.com',
  sellerLicenseNo: '11521998000248',
  manufacturerName: 'Connedit Business Solutions Private Limited',
  countryOfOrigin: 'India',
  shelfLife: '180 days',
}

/**
 * Returns information for the product detail Information card.
 * Merges product.information over default so per-product overrides work.
 * @param {Object} product - Product object (may have information)
 * @returns {Object} Full information object for the card
 */
export function getProductInformation(product) {
  return {
    ...defaultInformation,
    ...(product?.information ?? {}),
  }
}
