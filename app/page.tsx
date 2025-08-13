"use client"

import { useState, useMemo } from "react"
import { Search, Moon, Sun, Keyboard, GitBranch, FileText, Zap, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cheatSheetData } from "@/lib/cheat-sheet-data"

export default function LazyVimCheatSheet() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [darkMode, setDarkMode] = useState(false)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const categories = ["All", "Navigation", "Editing", "Git", "Files", "Tips"]

  const categoryIcons = {
    Navigation: <Keyboard className="w-4 h-4" />,
    Editing: <FileText className="w-4 h-4" />,
    Git: <GitBranch className="w-4 h-4" />,
    Files: <Terminal className="w-4 h-4" />,
    Tips: <Zap className="w-4 h-4" />,
  }

  const filteredData = useMemo(() => {
    return cheatSheetData.filter((item) => {
      const matchesSearch =
        item.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.workflow?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const toggleCard = (id: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedCards(newExpanded)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className={`min-h-screen bg-background transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">LazyVim Developer Cheat Sheet</h1>
            <p className="text-muted-foreground">
              Complete reference for LazyVim keybindings, LazyGit shortcuts, and productivity tips
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            className="self-start md:self-center bg-transparent"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search commands, descriptions, or workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex items-center gap-2"
              >
                {category !== "All" && categoryIcons[category as keyof typeof categoryIcons]}
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredData.length} of {cheatSheetData.length} commands
          </p>
        </div>

        {/* Command Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((item, index) => (
            <Collapsible
              key={`${item.category}-${index}`}
              open={expandedCards.has(`${item.category}-${index}`)}
              onOpenChange={() => toggleCard(`${item.category}-${index}`)}
            >
              <Card className="h-fit hover:shadow-md transition-all duration-200 cursor-pointer">
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {categoryIcons[item.category as keyof typeof categoryIcons]}
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg font-mono bg-muted px-2 py-1 rounded text-primary">
                          {item.command}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-sm">{item.description}</CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {item.workflow && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-md">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Workflow:</p>
                        <p className="text-sm">{item.workflow}</p>
                      </div>
                    )}
                    {item.mode && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Mode:</p>
                        <Badge variant="outline" className="text-xs">
                          {item.mode}
                        </Badge>
                      </div>
                    )}
                    {item.example && (
                      <div className="mt-3 p-3 bg-accent/20 rounded-md">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Example:</p>
                        <code className="text-sm font-mono">{item.example}</code>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No commands found matching your search.</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            LazyVim Developer Cheat Sheet • Press <kbd className="px-2 py-1 bg-muted rounded text-xs">?</kbd> in LazyVim
            for context-sensitive help
          </p>
        </footer>
      </div>
    </div>
  )
}
