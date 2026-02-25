import { lazy, memo, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

const ProductListing = lazy(() => import('./pages/ProductListing'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Admin = lazy(() => import('./pages/Admin'))
const FAQs = lazy(() => import('./pages/FAQs'))
const Contact = lazy(() => import('./pages/Contact'))
const Shipping = lazy(() => import('./pages/Shipping'))
const Returns = lazy(() => import('./pages/Returns'))
const NotFound = lazy(() => import('./pages/NotFound'))

const PageFallback = memo(function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" aria-hidden>
      <span className="text-[var(--color-text-tertiary)]">Loading…</span>
    </div>
  )
})

export default function App() {
  return (
    <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="products"
            element={
              <Suspense fallback={<PageFallback />}>
                <ProductListing />
              </Suspense>
            }
          />
          <Route
            path="products/:slug"
            element={
              <Suspense fallback={<PageFallback />}>
                <ProductDetail />
              </Suspense>
            }
          />
          <Route
            path="cart"
            element={
              <Suspense fallback={<PageFallback />}>
                <Cart />
              </Suspense>
            }
          />
          <Route
            path="checkout"
            element={
              <Suspense fallback={<PageFallback />}>
                <Checkout />
              </Suspense>
            }
          />
          <Route
            path="login"
            element={
              <Suspense fallback={<PageFallback />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="signup"
            element={
              <Suspense fallback={<PageFallback />}>
                <Signup />
              </Suspense>
            }
          />
          <Route
            path="reset-password"
            element={
              <Suspense fallback={<PageFallback />}>
                <ResetPassword />
              </Suspense>
            }
          />
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<PageFallback />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="admin"
            element={
              <Suspense fallback={<PageFallback />}>
                <Admin />
              </Suspense>
            }
          />
          <Route
            path="faqs"
            element={
              <Suspense fallback={<PageFallback />}>
                <FAQs />
              </Suspense>
            }
          />
          <Route
            path="contact"
            element={
              <Suspense fallback={<PageFallback />}>
                <Contact />
              </Suspense>
            }
          />
          <Route
            path="shipping"
            element={
              <Suspense fallback={<PageFallback />}>
                <Shipping />
              </Suspense>
            }
          />
          <Route
            path="returns"
            element={
              <Suspense fallback={<PageFallback />}>
                <Returns />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<PageFallback />}>
                <NotFound />
              </Suspense>
            }
          />
        </Route>
      </Routes>
  )
}

