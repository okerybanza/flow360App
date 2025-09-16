import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, X } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  onFilter?: (filters: any) => void
  placeholder?: string
  showFilters?: boolean
}

export default function SearchBar({ 
  onSearch, 
  onFilter, 
  placeholder = "Rechercher...", 
  showFilters = false 
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    category: ''
  })

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch(value)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilter?.(newFilters)
  }

  const clearFilters = () => {
    setFilters({
      status: '',
      dateRange: '',
      category: ''
    })
    onFilter?.({})
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-4"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => handleSearch('')}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterOptions(!showFilterOptions)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtres
            </Button>
            {(filters.status || filters.dateRange || filters.category) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Effacer
              </Button>
            )}
          </div>

          {showFilterOptions && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tous les statuts</option>
                  <option value="DRAFT">Brouillon</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="COMPLETED">Terminé</option>
                  <option value="CANCELLED">Annulé</option>
                  <option value="SUSPENDED">Suspendu</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Période</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toutes les périodes</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="quarter">Ce trimestre</option>
                  <option value="year">Cette année</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toutes les catégories</option>
                  <option value="construction">Construction</option>
                  <option value="renovation">Rénovation</option>
                  <option value="design">Design</option>
                  <option value="consultation">Consultation</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
