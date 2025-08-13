"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Download, FileSpreadsheet, FileText, Calendar, BarChart3 } from "lucide-react"

export function ExportManager() {
  const [selectedFormat, setSelectedFormat] = useState("xlsx")
  const [selectedData, setSelectedData] = useState<string[]>([])
  const [dateRange, setDateRange] = useState("last-month")

  const dataTypes = [
    { id: "revenue", label: "Revenue Data", description: "Monthly and yearly revenue reports" },
    { id: "customers", label: "Customer Analytics", description: "Customer demographics and behavior" },
    { id: "performance", label: "Performance Metrics", description: "KPIs and business performance data" },
    { id: "applications", label: "Applications", description: "Franchise application data" },
    { id: "documents", label: "Document Logs", description: "Document access and management logs" },
  ]

  const handleDataToggle = (dataId: string) => {
    setSelectedData((prev) => (prev.includes(dataId) ? prev.filter((id) => id !== dataId) : [...prev, dataId]))
  }

  const handleExport = () => {
    // TODO: Implement actual export functionality
    console.log("Exporting:", { format: selectedFormat, data: selectedData, dateRange })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Manager
        </CardTitle>
        <CardDescription>Export your business data and reports</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xlsx">
                    <div className="flex items-center">
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Excel (.xlsx)
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      CSV (.csv)
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      PDF (.pdf)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-quarter">Last Quarter</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Data to Export</Label>
            <div className="space-y-3">
              {dataTypes.map((dataType) => (
                <div key={dataType.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={dataType.id}
                    checked={selectedData.includes(dataType.id)}
                    onCheckedChange={() => handleDataToggle(dataType.id)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor={dataType.id} className="text-sm font-medium">
                      {dataType.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{dataType.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">{selectedData.length} data type(s) selected</div>
          <Button onClick={handleExport} disabled={selectedData.length === 0} className="btn-primary">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <Button variant="outline" className="justify-start bg-transparent">
            <BarChart3 className="w-4 h-4 mr-2" />
            Quick Export: Analytics
          </Button>
          <Button variant="outline" className="justify-start bg-transparent">
            <Calendar className="w-4 h-4 mr-2" />
            Quick Export: Monthly Report
          </Button>
          <Button variant="outline" className="justify-start bg-transparent">
            <FileText className="w-4 h-4 mr-2" />
            Quick Export: All Documents
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
