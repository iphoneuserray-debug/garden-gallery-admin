import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"

export function SearchForm({ value, onChange, placeholder = "Search...", ...props }) {
  return (
    <form onSubmit={(e) => e.preventDefault()} {...props}>
      <div className="relative">
        <Label htmlFor="search" className="sr-only">Search</Label>
        <Input
          id="search"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="pl-8"
        />
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
      </div>
    </form>
  )
}
