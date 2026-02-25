// Sample reviews per product. In a real app these would come from an API.
const reviewsByProductId = {
  '1': [
    { id: 'r1-1', author: 'Priya S.', rating: 5, date: '2024-01-15', text: 'Best garlic paste I\'ve used. Fresh smell, no preservatives. Stays good in the fridge for weeks.' },
    { id: 'r1-2', author: 'Rahul M.', rating: 4, date: '2024-01-08', text: 'Convenient and saves a lot of time. Taste is close to fresh garlic. Would buy again.' },
    { id: 'r1-3', author: 'Anita K.', rating: 5, date: '2024-01-02', text: 'Perfect for curries and marinades. My family loves the flavour. Soil2Spoon never disappoints.' },
    { id: 'r1-4', author: 'Vikram D.', rating: 4, date: '2023-12-28', text: 'Good quality. Packaging could be better but the product itself is excellent.' },
    { id: 'r1-5', author: 'Meera R.', rating: 5, date: '2023-12-20', text: 'No artificial smell. Pure garlic. Using it in all my North Indian dishes. Highly recommend!' },
  ],
  '2': [
    { id: 'r2-1', author: 'Kavita N.', rating: 5, date: '2024-01-12', text: 'Garlic and ginger together — so handy! Saves me 10 minutes every time I cook.' },
    { id: 'r2-2', author: 'Suresh P.', rating: 4, date: '2024-01-05', text: 'Fresh and aromatic. Good for tea and curries. Will order again.' },
  ],
  '3': [
    { id: 'r3-1', author: 'Deepa L.', rating: 5, date: '2024-01-10', text: 'Fine texture, strong flavour. A little goes a long way. Great for seasoning.' },
    { id: 'r3-2', author: 'Arun J.', rating: 4, date: '2024-01-01', text: 'Consistent quality. I use it in marinades and dry rubs. Good value.' },
  ],
  '4': [
    { id: 'r4-1', author: 'Lakshmi T.', rating: 5, date: '2024-01-14', text: 'Such a time-saver! Garlic and onion paste ready to go. Taste is authentic.' },
  ],
  '5': [
    { id: 'r5-1', author: 'Rajesh G.', rating: 4, date: '2024-01-06', text: 'Smooth paste, no lumps. Great for biryani and pulao. Happy with the purchase.' },
  ],
  '6': [
    { id: 'r6-1', author: 'Pooja V.', rating: 4, date: '2024-01-03', text: 'Good onion powder for sprinkling on snacks and in gravies. Stays fresh.' },
  ],
  '7': [
    { id: 'r7-1', author: 'Manoj B.', rating: 5, date: '2024-01-11', text: 'Perfect heat and colour. My curries look and taste like the real deal. Love it!' },
    { id: 'r7-2', author: 'Sunita H.', rating: 4, date: '2024-01-04', text: 'Spicy and vibrant. A staple in my kitchen. Soil2Spoon quality is top notch.' },
  ],
}

/**
 * Returns reviews for a product. Uses sample data; falls back to empty array if none.
 * @param {string} productId - Product id (e.g. '1', '2')
 * @returns {{ id: string, author: string, rating: number, date: string, text: string }[]}
 */
export function getProductReviews(productId) {
  return reviewsByProductId[productId] ?? []
}
