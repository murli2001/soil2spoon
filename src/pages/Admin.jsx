import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthState } from '../context/AuthContext'
import { getCategories } from '../api/products'
import { getProducts } from '../api/products'
import * as adminApi from '../api/admin'

const emptyHighlights = () => ({
  brand: '',
  productType: '',
  dietaryPreference: '',
  keyFeatures: '',
  flavour: '',
  ingredients: '',
  allergenInformation: '',
  weight: '',
  unit: '',
  packagingType: '',
})
const emptyInformation = () => ({
  disclaimer: '',
  customerCareDetails: '',
  sellerName: '',
  sellerAddress: '',
  sellerLicenseNo: '',
  manufacturerName: '',
  countryOfOrigin: '',
  shelfLife: '',
})

export default function Admin() {
  const { user } = useAuthState()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    price: '',
    originalPrice: '',
    categoryId: 'pastes',
    image: '',
    description: '',
    netQty: '',
    featured: false,
    trending: false,
    highlights: emptyHighlights(),
    information: emptyInformation(),
  })

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
      return
    }
    if (user.role !== 'ADMIN') {
      navigate('/', { replace: true })
      return
    }
  }, [user, navigate])

  const load = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const [catRes, prodRes] = await Promise.all([
        getCategories(),
        getProducts({ page: 0, size: 200 }),
      ])
      setCategories(Array.isArray(catRes) ? catRes : catRes?.content ?? [])
      const list = prodRes?.content ?? prodRes ?? []
      setProducts(Array.isArray(list) ? list : [])
    } catch (e) {
      setError(e?.body?.message || e?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user?.role === 'ADMIN') load()
  }, [user?.role, load])

  const openCreate = () => {
    setEditingId(null)
    setForm({
      name: '',
      slug: '',
      price: '',
      originalPrice: '',
      categoryId: categories[0]?.id ?? 'pastes',
      image: '',
      description: '',
      netQty: '',
      featured: false,
      trending: false,
      highlights: emptyHighlights(),
      information: emptyInformation(),
    })
    setFormOpen(true)
  }

  const openEdit = (p) => {
    setEditingId(p.id)
    const h = p.highlights ?? {}
    const i = p.information ?? {}
    setForm({
      name: p.name ?? '',
      slug: p.slug ?? '',
      price: p.price ?? '',
      originalPrice: p.originalPrice ?? '',
      categoryId: p.category ?? 'pastes',
      image: p.image ?? '',
      description: p.description ?? '',
      netQty: p.netQty ?? '',
      featured: !!p.featured,
      trending: !!p.trending,
      highlights: {
        brand: h.brand ?? '',
        productType: h.productType ?? '',
        dietaryPreference: h.dietaryPreference ?? '',
        keyFeatures: h.keyFeatures ?? '',
        flavour: h.flavour ?? '',
        ingredients: h.ingredients ?? '',
        allergenInformation: h.allergenInformation ?? '',
        weight: h.weight ?? '',
        unit: h.unit ?? '',
        packagingType: h.packagingType ?? '',
      },
      information: {
        disclaimer: i.disclaimer ?? '',
        customerCareDetails: i.customerCareDetails ?? '',
        sellerName: i.sellerName ?? '',
        sellerAddress: i.sellerAddress ?? '',
        sellerLicenseNo: i.sellerLicenseNo ?? '',
        manufacturerName: i.manufacturerName ?? '',
        countryOfOrigin: i.countryOfOrigin ?? '',
        shelfLife: i.shelfLife ?? '',
      },
    })
    setFormOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || form.name.trim().toLowerCase().replace(/\s+/g, '-'),
        price: form.price === '' ? 0 : parseInt(form.price, 10),
        originalPrice: form.originalPrice === '' ? null : parseInt(form.originalPrice, 10),
        categoryId: form.categoryId || 'pastes',
        image: form.image.trim() || null,
        description: form.description.trim() || null,
        netQty: form.netQty.trim() || null,
        featured: form.featured,
        trending: form.trending,
        highlights: form.highlights,
        information: form.information,
      }
      if (editingId) {
        await adminApi.updateProduct(editingId, payload)
      } else {
        await adminApi.createProduct(payload)
      }
      setFormOpen(false)
      load()
    } catch (err) {
      setError(err?.body?.message || err?.message || 'Request failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    setError(null)
    try {
      await adminApi.deleteProduct(id)
      load()
    } catch (err) {
      setError(err?.body?.message || err?.message || 'Delete failed')
    }
  }

  if (!user) return null
  if (user.role !== 'ADMIN') return null

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-6">Admin – Products</h1>
      {error && (
        <div className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-red-800" role="alert">
          {error}
        </div>
      )}
      {loading ? (
        <p className="text-[var(--color-text-tertiary)]">Loading…</p>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[var(--color-text-secondary)]">{products.length} product(s)</p>
            <button
              type="button"
              onClick={openCreate}
              className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Add product
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[var(--color-surface)]">
                <tr>
                  <th className="px-4 py-2 font-medium text-[var(--color-text)]">Name</th>
                  <th className="px-4 py-2 font-medium text-[var(--color-text)]">Slug</th>
                  <th className="px-4 py-2 font-medium text-[var(--color-text)]">Price</th>
                  <th className="px-4 py-2 font-medium text-[var(--color-text)]">Category</th>
                  <th className="px-4 py-2 font-medium text-[var(--color-text)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-[var(--color-border)]">
                    <td className="px-4 py-2 text-[var(--color-text)]">{p.name}</td>
                    <td className="px-4 py-2 text-[var(--color-text-secondary)]">{p.slug}</td>
                    <td className="px-4 py-2 text-[var(--color-text)]">₹{p.price}</td>
                    <td className="px-4 py-2 text-[var(--color-text-secondary)]">{p.category}</td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="mr-2 text-[var(--color-primary)] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-label={editingId ? 'Edit product' : 'Add product'}>
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl bg-[var(--color-surface)] p-6 shadow-xl my-auto">
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
              {editingId ? 'Edit product' : 'Add product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)]">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)]">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)]"
                  placeholder="auto from name if empty"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)]">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)]">Original (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.originalPrice}
                    onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)]">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name ?? c.id}</option>
                  ))}
                  {categories.length === 0 && <option value="pastes">pastes</option>}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)]">Image URL</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)]"
                  placeholder="https://res.cloudinary.com/... or direct image URL"
                />
                <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                  Use the <strong>direct image URL</strong>. For Cloudinary: open the asset → copy &quot;Secure URL&quot; or &quot;URL&quot; (starts with <code className="rounded bg-[var(--color-bg-muted)] px-1">res.cloudinary.com</code>), not the dashboard page link.
                </p>
                {form.image.trim() && (
                  <div className="mt-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-muted)] p-2">
                    <p className="mb-1 text-xs text-[var(--color-text-tertiary)]">Preview:</p>
                    <img
                      src={form.image.trim()}
                      alt="Preview"
                      className="max-h-32 w-full max-w-[12rem] rounded object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        const errEl = e.target.parentElement?.querySelector('[data-preview-error]')
                        if (errEl) errEl.classList.remove('hidden')
                      }}
                    />
                    <p data-preview-error className="hidden text-xs text-amber-600" role="status">Image failed to load. Use the direct image URL (e.g. Cloudinary Secure URL).</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)]">Net qty</label>
                <input
                  type="text"
                  value={form.netQty}
                  onChange={(e) => setForm((f) => ({ ...f, netQty: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)]"
                  placeholder="e.g. 200g"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)]">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-text)]"
                />
              </div>

              {/* Highlights */}
              <fieldset className="space-y-3 rounded-lg border border-[var(--color-border)] p-4">
                <legend className="text-sm font-semibold text-[var(--color-text)]">Highlights</legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)]">Brand</label>
                    <input type="text" value={form.highlights.brand} onChange={(e) => setForm((f) => ({ ...f, highlights: { ...f.highlights, brand: e.target.value } }))} className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm text-[var(--color-text)]" placeholder="e.g. Soil2Spoon" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)]">Product type</label>
                    <input type="text" value={form.highlights.productType} onChange={(e) => setForm((f) => ({ ...f, highlights: { ...f.highlights, productType: e.target.value } }))} className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm text-[var(--color-text)]" placeholder="e.g. Paste" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)]">Dietary preference</label>
                    <input type="text" value={form.highlights.dietaryPreference} onChange={(e) => setForm((f) => ({ ...f, highlights: { ...f.highlights, dietaryPreference: e.target.value } }))} className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm text-[var(--color-text)]" placeholder="e.g. Vegetarian" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)]">Flavour</label>
                    <input type="text" value={form.highlights.flavour} onChange={(e) => setForm((f) => ({ ...f, highlights: { ...f.highlights, flavour: e.target.value } }))} className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm text-[var(--color-text)]" placeholder="e.g. Garlic" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)]">Key features</label>
                    <input type="text" value={form.highlights.keyFeatures} onChange={(e) => setForm((f) => ({ ...f, highlights: { ...f.highlights, keyFeatures: e.target.value } }))} className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm text-[var(--color-text)]" placeholder="e.g. No preservatives, Fresh" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)]">Ingredients</label>
                    <input type="text" value={form.highlights.ingredients} onChange={(e) => setForm((f) => ({ ...f, highlights: { ...f.highlights, ingredients: e.target.value } }))} className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm text-[var(--color-text)]" placeholder="e.g. Garlic, water, salt" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)]">Allergen information</label>
                    <input type="text" value={form.highlights.allergenInformation} onChange={(e) => setForm((f) => ({ ...f, highlights: { ...f.highlights, allergenInformation: e.target.value } }))} className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm text-[var(--color-text)]" placeholder="e.g. Contains: None known" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)]">Weight</label>
                    <input type="text" value={form.highlights.weight} onChange={(e) => setForm((f) => ({ ...f, highlights: { ...f.highlights, weight: e.target.value } }))} className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm text-[var(--color-text)]" placeholder="e.g. 200" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)]">Unit</label>
                    <input type="text" value={form.highlights.unit} onChange={(e) => setForm((f) => ({ ...f, highlights: { ...f.highlights, unit: e.target.value } }))} className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm text-[var(--color-text)]" placeholder="e.g. g" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)]">Packaging type</label>
                    <input type="text" value={form.highlights.packagingType} onChange={(e) => setForm((f) => ({ ...f, highlights: { ...f.highlights, packagingType: e.target.value } }))} className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm text-[var(--color-text)]" placeholder="e.g. Jar" />
                  </div>
                </div>
              </fieldset>

              {/* Information */}
              <fieldset className="space-y-3 rounded-lg border border-[var(--color-border)] p-4">
                <legend className="text-sm font-semibold text-[var(--color-text)]">Information</legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)]">Disclaimer</label>
                    <textarea value={form.information.disclaimer} onChange={(e) => setForm((f) => ({ ...f, information: { ...f.information, disclaimer: e.target.value } }))} rows={2} className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm text-[var(--color-text)]" placeholder="Product disclaimer text" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)]">Customer care details</label>
                    <textarea value={form.information.customerCareDetails} onChange={(e) => setForm((f) => ({ ...f, information: { ...f.information, customerCareDetails: e.target.value } }))} rows={2} className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm text-[var(--color-text)]" placeholder="Contact / support info" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)]">Seller name</label>
                    <input type="text" value={form.information.sellerName} onChange={(e) => setForm((f) => ({ ...f, information: { ...f.information, sellerName: e.target.value } }))} className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm text-[var(--color-text)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)]">Seller license no.</label>
                    <input type="text" value={form.information.sellerLicenseNo} onChange={(e) => setForm((f) => ({ ...f, information: { ...f.information, sellerLicenseNo: e.target.value } }))} className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm text-[var(--color-text)]" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)]">Seller address</label>
                    <input type="text" value={form.information.sellerAddress} onChange={(e) => setForm((f) => ({ ...f, information: { ...f.information, sellerAddress: e.target.value } }))} className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm text-[var(--color-text)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)]">Manufacturer name</label>
                    <input type="text" value={form.information.manufacturerName} onChange={(e) => setForm((f) => ({ ...f, information: { ...f.information, manufacturerName: e.target.value } }))} className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm text-[var(--color-text)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)]">Country of origin</label>
                    <input type="text" value={form.information.countryOfOrigin} onChange={(e) => setForm((f) => ({ ...f, information: { ...f.information, countryOfOrigin: e.target.value } }))} className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm text-[var(--color-text)]" placeholder="e.g. India" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)]">Shelf life</label>
                    <input type="text" value={form.information.shelfLife} onChange={(e) => setForm((f) => ({ ...f, information: { ...f.information, shelfLife: e.target.value } }))} className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-sm text-[var(--color-text)]" placeholder="e.g. 180 days" />
                  </div>
                </div>
              </fieldset>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                    className="rounded"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                  <input
                    type="checkbox"
                    checked={form.trending}
                    onChange={(e) => setForm((f) => ({ ...f, trending: e.target.checked }))}
                    className="rounded"
                  />
                  Trending
                </label>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  {saving ? 'Saving…' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
