import React from 'react'
import { Outlet } from 'react-router-dom'
import DesktopNav from './DesktopNav'

export default function DesktopLayout() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="hidden lg:block flex-shrink-0">
        <DesktopNav />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
