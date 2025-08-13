"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Upload, Search, Filter, Eye, Trash2, Calendar, User, FolderOpen } from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  category: "contract" | "report" | "training" | "marketing" | "legal"
  size: string
  uploadDate: string
  uploadedBy: string
  status: "active" | "archived" | "pending"
}

export function DocumentManager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const documents: Document[] = [
    {
      id: "1",
      name: "Franchise Agreement Template",
      type: "PDF",
      category: "contract",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      uploadedBy: "Admin",
      status: "active",
    },
    {
      id: "2",
      name: "Monthly Performance Report",
      type: "XLSX",
      category: "report",
      size: "1.8 MB",
      uploadDate: "2024-01-20",
      uploadedBy: "Sarah Johnson",
      status: "active",
    },
    {
      id: "3",
      name: "Operations Training Manual",
      type: "PDF",
      category: "training",
      size: "5.2 MB",
      uploadDate: "2024-01-10",
      uploadedBy: "Training Dept",
      status: "active",
    },
    {
      id: "4",
      name: "Marketing Campaign Assets",
      type: "ZIP",
      category: "marketing",
      size: "12.5 MB",
      uploadDate: "2024-01-18",
      uploadedBy: "Marketing Team",
      status: "active",
    },
    {
      id: "5",
      name: "Legal Compliance Checklist",
      type: "PDF",
      category: "legal",
      size: "890 KB",
      uploadDate: "2024-01-12",
      uploadedBy: "Legal Dept",
      status: "active",
    },
  ]

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "contract":
        return "bg-blue-100 text-blue-800"
      case "report":
        return "bg-green-100 text-green-800"
      case "training":
        return "bg-purple-100 text-purple-800"
      case "marketing":
        return "bg-orange-100 text-orange-800"
      case "legal":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Document Manager
        </CardTitle>
        <CardDescription>Manage and organize your franchise documents</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>
                All Documents
              </TabsTrigger>
              <TabsTrigger value="contracts" onClick={() => setSelectedCategory("contract")}>
                Contracts
              </TabsTrigger>
              <TabsTrigger value="reports" onClick={() => setSelectedCategory("report")}>
                Reports
              </TabsTrigger>
              <TabsTrigger value="training" onClick={() => setSelectedCategory("training")}>
                Training
              </TabsTrigger>
            </TabsList>
            <Button className="btn-primary">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <TabsContent value="all" className="space-y-4">
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{doc.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {doc.uploadedBy}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {doc.uploadDate}
                        </span>
                        <span>{doc.size}</span>
                        <span>{doc.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getCategoryColor(doc.category)}>{doc.category}</Badge>
                    <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
