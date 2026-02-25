import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'
import AnnouncementBar from './AnnouncementBar'
import Navbar from './Navbar'
import Footer from './Footer'
import AddToCartToast from './AddToCartToast'

function Layout() {
  return (
    <div className="s2s-layout flex min-h-screen flex-col" data-section="layout">
      <ScrollToTop />
      <AnnouncementBar />
      <Navbar />
      <AddToCartToast />
      <main id="main-content" className="s2s-main flex-1" data-section="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default memo(Layout)
