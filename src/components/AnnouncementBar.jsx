import { memo } from 'react'

function AnnouncementBar() {
  return (
    <div
      className="s2s-announcement-bar min-h-[40px] flex items-center justify-center py-2.5 text-center text-sm font-medium transition-colors duration-300"
      data-section="announcement-bar"
    >
      Authentic Indian spices, pastes & pickles — Free shipping on orders over ₹499
    </div>
  )
}

export default memo(AnnouncementBar)
