"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FolderOpen } from "lucide-react"

interface FolderPickerProps {
  value: string
  onChange: (path: string) => void
  placeholder?: string
}

export function FolderPicker({ value, onChange, placeholder = "Sélectionner un dossier..." }: FolderPickerProps) {
  const handleBrowse = () => {
    // In a real desktop app (Electron/Tauri), this would open a native folder picker
    // For demonstration, we'll use a prompt
    const path = prompt("Entrez le chemin du dossier:", value)
    if (path !== null) {
      onChange(path)
    }
  }

  return (
    <div className="flex gap-2">
      <Input type="text" value={value} placeholder={placeholder} className="flex-1 font-mono text-sm" readOnly />
      <Button type="button" variant="outline" onClick={handleBrowse} className="shrink-0 bg-transparent">
        <FolderOpen className="mr-2 h-4 w-4" />
        Parcourir
      </Button>
    </div>
  )
}
