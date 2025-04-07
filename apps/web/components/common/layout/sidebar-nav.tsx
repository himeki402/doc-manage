"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown, FileText, FolderIcon, Heart, Plus, Settings } from "lucide-react"

export function SidebarNav() {
  return (
    <div className="w-72 border-r bg-white flex flex-col h-screen">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 8L12 12L20 8L12 4Z" fill="white" />
              <path d="M4 12L12 16L20 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 16L12 20L20 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100">
            <FileText size={18} className="text-blue-500" />
            <span className="text-sm font-medium">My Document</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100">
            <Heart size={18} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Favourite</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100">
            <FileText size={18} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Unsorted</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100">
            <FileText size={18} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-700">My Template</span>
          </div>
        </div>
      </div>

      <div className="mt-4 px-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500">FOLDERS</span>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Plus size={16} />
          </Button>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100">
            <FolderIcon size={18} className="text-blue-500" />
            <span className="text-sm font-medium">Keitoto Shot</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100">
            <FolderIcon size={18} className="text-blue-500" />
            <span className="text-sm font-medium">Design System Journal</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100">
            <FolderIcon size={18} className="text-blue-500" />
            <span className="text-sm font-medium">Social Media Marketing</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100">
            <FolderIcon size={18} className="text-blue-500" />
            <span className="text-sm font-medium">Usability Testing</span>
          </div>
        </div>

        <Button variant="ghost" className="w-full justify-start mt-2 text-sm text-slate-500">
          Show more <ChevronDown size={14} className="ml-1" />
        </Button>
      </div>

      <div className="mt-auto p-4 space-y-2">
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-100">
          <Settings size={18} className="text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Settings</span>
        </div>
      </div>
    </div>
  )
}

