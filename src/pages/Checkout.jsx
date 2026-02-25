import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useAuthState } from '../context/AuthContext'
import { createOrder } from '../api/orders'
import { getAddresses, createAddress, updateAddress as updateAddressApi } from '../api/addresses'

const PAYMENT_OPTIONS = [
  { id: 'cod', label: 'Cash on Delivery (COD)', value: 'COD' },
  { id: 'card', label: 'Credit / Debit Card', value: 'CARD' },
  { id: 'upi', label: 'UPI', value: 'UPI' },
  { id: 'netbanking', label: 'Net Banking', value: 'NETBANKING' },
]

const initialAddress = {
  shippingName: '',
  shippingPhone: '',
  shippingAddressLine1: '',
  shippingAddressLine2: '',
  shippingCity: '',
  shippingState: '',
  shippingPincode: '',
}

/**
 * Validates shipping address fields. Returns an object with error messages for invalid fields (Indian phone: 10 digits; pincode: 6 digits).
 * @returns {{ shippingName?: string, shippingPhone?: string, shippingPincode?: string }}
 */
function getAddressValidationErrors(addr) {
  const errors = {}
  if (!addr) return errors
  const name = (addr.shippingName ?? '').trim()
  if (name.length > 0 && name.length < 2) {
    errors.shippingName = 'Name must be at least 2 characters'
  }
  const phone = (addr.shippingPhone ?? '').replace(/\D/g, '')
  if ((addr.shippingPhone ?? '').trim().length > 0) {
    const valid = phone.length === 10 || (phone.length === 11 && phone.startsWith('0')) || (phone.length === 12 && phone.startsWith('91'))
    if (!valid) {
      errors.shippingPhone = 'Enter a valid 10-digit Indian phone number'
    }
  }
  const pincode = (addr.shippingPincode ?? '').replace(/\D/g, '')
  if ((addr.shippingPincode ?? '').trim().length > 0) {
    if (pincode.length !== 6) {
      errors.shippingPincode = 'Pincode must be exactly 6 digits'
    }
  }
  return errors
}

function savedToCheckout(a) {
  return {
    shippingName: a.name ?? '',
    shippingPhone: a.phone ?? '',
    shippingAddressLine1: a.addressLine1 ?? '',
    shippingAddressLine2: a.addressLine2 ?? '',
    shippingCity: a.city ?? '',
    shippingState: a.state ?? '',
    shippingPincode: a.pincode ?? '',
  }
}

function AddressFormFields({ address, updateAddress, errors = {} }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)]">Full name *</label>
          <input
            type="text"
            value={address.shippingName}
            onChange={(e) => updateAddress('shippingName', e.target.value)}
            placeholder="e.g. Priya Sharma"
            className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)]"
          />
          {errors.shippingName && <p className="mt-1 text-xs text-red-600">{errors.shippingName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)]">Phone *</label>
          <input
            type="tel"
            value={address.shippingPhone}
            onChange={(e) => updateAddress('shippingPhone', e.target.value)}
            placeholder="e.g. 9876543210"
            className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)]"
          />
          {errors.shippingPhone && <p className="mt-1 text-xs text-red-600">{errors.shippingPhone}</p>}
        </div>
      </div>
      <div className="mt-3">
        <label className="block text-sm font-medium text-[var(--color-text)]">Address line 1 *</label>
        <input
          type="text"
          value={address.shippingAddressLine1}
          onChange={(e) => updateAddress('shippingAddressLine1', e.target.value)}
          placeholder="Flat, building, street"
          className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)]"
        />
      </div>
      <div className="mt-3">
        <label className="block text-sm font-medium text-[var(--color-text)]">Address line 2 (optional)</label>
        <input
          type="text"
          value={address.shippingAddressLine2}
          onChange={(e) => updateAddress('shippingAddressLine2', e.target.value)}
          placeholder="Area, landmark"
          className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)]"
        />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)]">City *</label>
          <input
            type="text"
            value={address.shippingCity}
            onChange={(e) => updateAddress('shippingCity', e.target.value)}
            placeholder="e.g. Mumbai"
            className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)]">State *</label>
          <input
            type="text"
            value={address.shippingState}
            onChange={(e) => updateAddress('shippingState', e.target.value)}
            placeholder="e.g. Maharashtra"
            className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)]">Pincode *</label>
          <input
            type="text"
            inputMode="numeric"
            value={address.shippingPincode}
            onChange={(e) => updateAddress('shippingPincode', e.target.value)}
            placeholder="e.g. 400001"
            className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)]"
          />
          {errors.shippingPincode && <p className="mt-1 text-xs text-red-600">{errors.shippingPincode}</p>}
        </div>
      </div>
    </>
  )
}

function AddressEditForm({ address, onSave, onCancel }) {
  const [edit, setEdit] = useState(savedToCheckout(address))
  const update = (field, value) => setEdit((prev) => ({ ...prev, [field]: value }))
  const editErrors = getAddressValidationErrors(edit)
  const canSave =
    edit.shippingName?.trim() &&
    edit.shippingPhone?.trim() &&
    edit.shippingAddressLine1?.trim() &&
    edit.shippingCity?.trim() &&
    edit.shippingState?.trim() &&
    edit.shippingPincode?.trim() &&
    Object.keys(editErrors).length === 0
  return (
    <div>
      <AddressFormFields address={edit} updateAddress={update} errors={editErrors} />
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => onSave({
            name: edit.shippingName,
            phone: edit.shippingPhone,
            addressLine1: edit.shippingAddressLine1,
            addressLine2: edit.shippingAddressLine2 || undefined,
            city: edit.shippingCity,
            state: edit.shippingState,
            pincode: edit.shippingPincode,
            isDefault: address.isDefault,
          })}
          disabled={!canSave}
          className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-on-primary)] disabled:opacity-60"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)]"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuthState()
  const { cart, cartTotal, cartCount, clearCart } = useCart()
  const [savedAddresses, setSavedAddresses] = useState([])
  const [addressesLoading, setAddressesLoading] = useState(true)
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [address, setAddress] = useState(initialAddress)
  const [saveNewAddress, setSaveNewAddress] = useState(false)
  const [showAddressList, setShowAddressList] = useState(false)
  const [deliveryInstructions, setDeliveryInstructions] = useState('')
  const [showInstructions, setShowInstructions] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [placing, setPlacing] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [addressListError, setAddressListError] = useState('')

  useEffect(() => {
    if (!user) {
      setAddressesLoading(false)
      return
    }
    let cancelled = false
    setAddressesLoading(true)
    getAddresses()
      .then((list) => {
        if (!cancelled && Array.isArray(list)) {
          setSavedAddresses(list)
          const defaultAddr = list.find((a) => a.isDefault) ?? list[0]
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id)
            setAddress(savedToCheckout(defaultAddr))
          }
        }
      })
      .catch(() => { if (!cancelled) setSavedAddresses([]) })
      .finally(() => { if (!cancelled) setAddressesLoading(false) })
    return () => { cancelled = true }
  }, [user])

  const updateAddress = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }))
    setSelectedAddressId(null)
  }

  const selectSavedAddress = (addr) => {
    setSelectedAddressId(addr.id)
    setAddress(savedToCheckout(addr))
  }

  const useNewAddress = () => {
    setSelectedAddressId(null)
    setAddress(initialAddress)
    setShowNewAddressForm(true)
  }

  const refreshAddresses = () => {
    getAddresses()
      .then((list) => { if (Array.isArray(list)) setSavedAddresses(list) })
      .catch(() => setSavedAddresses([]))
  }

  const canPlaceOrder =
    address.shippingName?.trim() &&
    address.shippingPhone?.trim() &&
    address.shippingAddressLine1?.trim() &&
    address.shippingCity?.trim() &&
    address.shippingState?.trim() &&
    address.shippingPincode?.trim() &&
    Object.keys(getAddressValidationErrors(address)).length === 0

  const confirmDeliverToAddress = () => {
    if (savedAddresses.length > 0 && selectedAddressId != null) {
      setShowAddressList(false)
      setShowNewAddressForm(false)
      return
    }
    if (selectedAddressId === null && canPlaceOrder) {
      setShowAddressList(false)
      setShowNewAddressForm(false)
    }
  }

  const selectedSavedAddr = savedAddresses.find((a) => a.id === selectedAddressId)
  const showSummaryBlock = savedAddresses.length > 0 && selectedAddressId != null && !showAddressList
  const hasValidSelection = selectedAddressId != null || (selectedAddressId === null && canPlaceOrder)

  if (!user) {
    return (
      <div className="s2s-page-checkout mx-auto max-w-2xl px-4 py-24 text-center" data-page="checkout">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">Sign in to checkout</h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">You need to be signed in to place an order.</p>
        <Link
          to="/login"
          className="s2s-btn-primary mt-8 inline-block rounded-full px-8 py-3.5"
        >
          Sign in
        </Link>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="s2s-page-checkout mx-auto max-w-2xl px-4 py-24 text-center" data-page="checkout">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">Your cart is empty</h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">Add items from the store before checkout.</p>
        <Link
          to="/products"
          className="s2s-btn-primary mt-8 inline-block rounded-full px-8 py-3.5"
        >
          Shop products
        </Link>
      </div>
    )
  }

  const handlePlaceOrder = async () => {
    if (!canPlaceOrder) return
    setOrderError('')
    setPlacing(true)
    try {
      if (saveNewAddress && !selectedAddressId) {
        await createAddress({
          name: address.shippingName,
          phone: address.shippingPhone,
          addressLine1: address.shippingAddressLine1,
          addressLine2: address.shippingAddressLine2 || undefined,
          city: address.shippingCity,
          state: address.shippingState,
          pincode: address.shippingPincode,
          isDefault: savedAddresses.length === 0,
        })
      }
      const selectedPayment = PAYMENT_OPTIONS.find((o) => o.id === paymentMethod)?.value || 'COD'
      await createOrder({
        ...address,
        paymentMethod: selectedPayment,
      })
      clearCart()
      navigate('/dashboard')
    } catch (err) {
      setOrderError(err.body?.message || err.message || 'Could not place order')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="s2s-page-checkout mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14" data-page="checkout">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold tracking-tight text-[var(--color-primary)]"
      >
        Secure checkout
      </motion.h1>
      <p className="mt-2 text-[var(--color-text-secondary)]">
        Delivering to your address · {cartCount} {cartCount === 1 ? 'item' : 'items'}
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-3" data-section="checkout-content">
        {/* Left: Address + Payment */}
        <div className="lg:col-span-2 space-y-10">
          {addressesLoading ? (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]"
            >
              <p className="text-[var(--color-text-tertiary)]">Loading addresses…</p>
            </motion.section>
          ) : showAddressList ? (
            /* --- Select a delivery address (2nd screen) --- */
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]"
              data-section="select-address"
            >
              <h2 className="text-xl font-bold text-[var(--color-primary)]">Select a delivery address</h2>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                Delivery addresses ({savedAddresses.length})
              </p>
              <div className="mt-5 space-y-3">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`rounded-xl border p-4 ${selectedAddressId === addr.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-[var(--color-border-subtle)]'}`}
                  >
                    {editingAddressId === addr.id ? (
                      <AddressEditForm
                        address={addr}
                        onSave={async (body) => {
                          try {
                            await updateAddressApi(addr.id, body)
                            refreshAddresses()
                            setAddress(savedToCheckout({ ...addr, ...body }))
                            setEditingAddressId(null)
                          } catch (e) {
                            setAddressListError(e.body?.message || e.message || 'Failed to update')
                          }
                        }}
                        onCancel={() => setEditingAddressId(null)}
                      />
                    ) : (
                      <>
                        <label className="flex cursor-pointer items-start gap-3">
                          <input
                            type="radio"
                            name="deliveryAddressList"
                            checked={selectedAddressId === addr.id}
                            onChange={() => { selectSavedAddress(addr); setAddressListError('') }}
                            className="mt-1 h-4 w-4 border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-[var(--color-text)]">{addr.name}</span>
                            {addr.isDefault && (
                              <span className="ml-2 text-xs font-medium text-[var(--color-primary)]">Default</span>
                            )}
                            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                              {addr.addressLine1}
                              {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}, {addr.city}, {addr.state} {addr.pincode}, India
                            </p>
                            <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">{addr.phone}</p>
                            <div className="mt-2 flex flex-wrap gap-3 text-sm">
                              <button
                                type="button"
                                onClick={() => setEditingAddressId(addr.id)}
                                className="text-[var(--color-primary)] underline-offset-2 hover:underline"
                              >
                                Edit address
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowInstructions(true)}
                                className="text-[var(--color-primary)] underline-offset-2 hover:underline"
                              >
                                Add delivery instructions
                              </button>
                            </div>
                          </div>
                        </label>
                      </>
                    )}
                  </div>
                ))}
                {showNewAddressForm ? (
                  <div className="rounded-xl border border-dashed border-[var(--color-primary)] bg-[var(--color-primary)]/5 p-4">
                    <p className="mb-3 font-medium text-[var(--color-text)]">New delivery address</p>
                    <AddressFormFields address={address} updateAddress={updateAddress} errors={getAddressValidationErrors(address)} />
                    <label className="mt-3 flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={saveNewAddress}
                        onChange={(e) => setSaveNewAddress(e.target.checked)}
                        className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)]"
                      />
                      <span className="text-sm text-[var(--color-text)]">Save for next time</span>
                    </label>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => { useNewAddress(); setAddressListError('') }}
                    className="w-full rounded-xl border border-dashed border-[var(--color-border-subtle)] p-4 text-left text-sm font-medium text-[var(--color-primary)] transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
                  >
                    Add a new delivery address
                  </button>
                )}
              </div>
              {addressListError && <p className="mt-4 text-sm text-red-600">{addressListError}</p>}
            </motion.section>
          ) : showSummaryBlock ? (
            /* --- Delivering to [name] summary (1st screen) --- */
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]"
              data-section="delivery-summary"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-text)]">Delivering to {address.shippingName}</h2>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                    {address.shippingAddressLine1}
                    {address.shippingAddressLine2 ? `, ${address.shippingAddressLine2}` : ''}<br />
                    {address.shippingCity}, {address.shippingState} {address.shippingPincode}, India
                  </p>
                  {deliveryInstructions && (
                    <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">Instructions: {deliveryInstructions}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddressList(true)}
                  className="shrink-0 text-sm font-medium text-[var(--color-primary)] underline-offset-2 hover:underline"
                >
                  Change
                </button>
              </div>
              <div className="mt-3 flex gap-4 text-sm">
                <button
                  type="button"
                  onClick={() => setShowInstructions(true)}
                  className="text-[var(--color-primary)] underline-offset-2 hover:underline"
                >
                  Add delivery instructions
                </button>
              </div>
              {showInstructions && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-[var(--color-text)]">Delivery instructions</label>
                  <textarea
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="e.g. Gate code, leave at door"
                    rows={2}
                    className="mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                  />
                </div>
              )}
            </motion.section>
          ) : (
            /* --- Address form (no saved addresses or new address on main screen) --- */
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]"
              data-section="delivery-address"
            >
              <h2 className="text-xl font-bold text-[var(--color-primary)]">Delivery address</h2>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Enter where you want your order delivered.</p>
              <div className="mt-5">
                <AddressFormFields address={address} updateAddress={updateAddress} errors={getAddressValidationErrors(address)} />
                <label className="mt-4 flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={saveNewAddress}
                    onChange={(e) => setSaveNewAddress(e.target.checked)}
                    className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  <span className="text-sm text-[var(--color-text)]">Save this address for next time</span>
                </label>
              </div>
            </motion.section>
          )}

          {!showAddressList && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]"
            data-section="payment-method"
          >
            <h2 className="text-xl font-bold text-[var(--color-primary)]">Payment method</h2>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Choose how you want to pay.</p>
            <div className="mt-5 space-y-3">
              {PAYMENT_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--color-border-subtle)] p-4 transition-colors has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary)]/5"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.id}
                    checked={paymentMethod === opt.id}
                    onChange={() => setPaymentMethod(opt.id)}
                    className="h-4 w-4 border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  <span className="font-medium text-[var(--color-text)]">{opt.label}</span>
                </label>
              ))}
            </div>
          </motion.section>
          )}
        </div>

        {/* Right: Order summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-1"
          data-section="order-summary"
        >
          <div className="sticky top-24 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-lg font-bold text-[var(--color-primary)]">Order summary</h2>
            <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto border-t border-[var(--color-border-subtle)] pt-4">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span className="text-[var(--color-text)]">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-[var(--color-text)]">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-[var(--color-border-subtle)] pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                <span className="font-medium text-[var(--color-text)]">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Delivery</span>
                <span className="font-medium text-[var(--color-text)]">FREE</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between border-t border-[var(--color-border-subtle)] pt-4 text-lg font-semibold">
              <span>Order total</span>
              <span className="text-[var(--color-text)]">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            {orderError && <p className="mt-4 text-sm text-red-600">{orderError}</p>}
            {showAddressList ? (
              <button
                type="button"
                disabled={!hasValidSelection}
                onClick={confirmDeliverToAddress}
                className="s2s-btn-primary mt-6 w-full rounded-full py-3.5 disabled:opacity-60"
              >
                Deliver to this address
              </button>
            ) : (
              <button
                type="button"
                disabled={!canPlaceOrder || placing}
                onClick={handlePlaceOrder}
                className="s2s-btn-primary mt-6 w-full rounded-full py-3.5 disabled:opacity-60"
              >
                {placing ? 'Placing order…' : 'Place order'}
              </button>
            )}
            <Link
              to="/cart"
              className="mt-4 block w-full rounded-full border border-[var(--color-border)] py-3 text-center text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)]"
            >
              Back to cart
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
