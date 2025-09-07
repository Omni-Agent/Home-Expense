"use client"

import type React from "react"

import TopNav from "./kokonutui/top-nav"
import Sidebar from "./kokonutui/sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0B] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-0">
        <div className="h-16 border-b border-gray-200 dark:border-[#1F1F23]">
          <TopNav />
        </div>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
