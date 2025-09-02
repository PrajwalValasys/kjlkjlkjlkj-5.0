import React, { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Download,
  Search,
  Filter,
  Calendar,
  FileText,
  Trash2,
  Maximize,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DownloadedFile {
  id: string;
  fileName: string;
  dataCount: number;
  downloadedDate: string;
  type: "Prospect" | "VAIS" | "LAL";
  fileSize: string;
  status: "completed" | "processing" | "failed";
}

// Mock data based on the image
const mockDownloadedFiles: DownloadedFile[] = [
  {
    id: "1",
    fileName: "prospect_list_tech_ctos",
    dataCount: 1247,
    downloadedDate: "26 Aug 2025",
    type: "Prospect",
    fileSize: "2.3 MB",
    status: "completed",
  },
  {
    id: "2",
    fileName: "vais_scores_q3",
    dataCount: 856,
    downloadedDate: "25 Aug 2025",
    type: "VAIS",
    fileSize: "1.8 MB",
    status: "completed",
  },
  {
    id: "3",
    fileName: "lal_expansion_healthcare",
    dataCount: 2103,
    downloadedDate: "25 Aug 2025",
    type: "LAL",
    fileSize: "4.1 MB",
    status: "completed",
  },
  {
    id: "4",
    fileName: "prospects_mid_market",
    dataCount: 734,
    downloadedDate: "24 Aug 2025",
    type: "Prospect",
    fileSize: "1.5 MB",
    status: "completed",
  },
  {
    id: "5",
    fileName: "vais_fintech_analysis",
    dataCount: 1456,
    downloadedDate: "24 Aug 2025",
    type: "VAIS",
    fileSize: "3.2 MB",
    status: "completed",
  },
  {
    id: "6",
    fileName: "test_list_europe",
    dataCount: 445,
    downloadedDate: "23 Aug 2025",
    type: "Prospect",
    fileSize: "0.9 MB",
    status: "completed",
  },
  {
    id: "7",
    fileName: "lal_tech_companies",
    dataCount: 1823,
    downloadedDate: "18 Aug 2025",
    type: "LAL",
    fileSize: "3.7 MB",
    status: "completed",
  },
  {
    id: "8",
    fileName: "vais_enterprise_scores",
    dataCount: 967,
    downloadedDate: "18 Aug 2025",
    type: "VAIS",
    fileSize: "2.1 MB",
    status: "completed",
  },
  {
    id: "9",
    fileName: "test_lal_demo",
    dataCount: 234,
    downloadedDate: "17 Aug 2025",
    type: "LAL",
    fileSize: "0.6 MB",
    status: "completed",
  },
  {
    id: "10",
    fileName: "test_vais_pilot",
    dataCount: 123,
    downloadedDate: "16 Aug 2025",
    type: "VAIS",
    fileSize: "0.3 MB",
    status: "completed",
  },
];

const fileTypes = ["All Types", "Prospect", "VAIS", "LAL"];

export default function MyDownloadedList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Filter and search logic
  const filteredFiles = useMemo(() => {
    let filtered = mockDownloadedFiles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((file) =>
        file.fileName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by type
    if (selectedType !== "All Types") {
      filtered = filtered.filter((file) => file.type === selectedType);
    }

    // Sort files
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "date") {
        comparison =
          new Date(a.downloadedDate).getTime() -
          new Date(b.downloadedDate).getTime();
      } else if (sortBy === "name") {
        comparison = a.fileName.localeCompare(b.fileName);
      } else if (sortBy === "count") {
        comparison = a.dataCount - b.dataCount;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [searchTerm, selectedType, sortBy, sortOrder]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Prospect":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "VAIS":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "LAL":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleDownload = (file: DownloadedFile) => {
    // Mock download functionality
    console.log(`Downloading file: ${file.fileName}`);
    // In real implementation, would trigger actual file download
  };

  const handleDeleteClick = (fileId: string) => {
    setFileToDelete(fileId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (fileToDelete) {
      console.log(`Deleting file with ID: ${fileToDelete}`);
      // In real implementation, would remove file from list
      setFileToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleBulkDeleteClick = () => {
    if (selectedFiles.length > 0) {
      setBulkDeleteDialogOpen(true);
    }
  };

  const handleConfirmBulkDelete = () => {
    console.log(`Deleting files with IDs: ${selectedFiles.join(", ")}`);
    // In real implementation, would remove files from list
    setSelectedFiles([]);
    setBulkDeleteDialogOpen(false);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFiles(filteredFiles.map((file) => file.id));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleSelectFile = (fileId: string, checked: boolean) => {
    if (checked) {
      setSelectedFiles((prev) => [...prev, fileId]);
    } else {
      setSelectedFiles((prev) => prev.filter((id) => id !== fileId));
    }
  };

  const isAllSelected =
    selectedFiles.length === filteredFiles.length && filteredFiles.length > 0;
  const isIndeterminate =
    selectedFiles.length > 0 && selectedFiles.length < filteredFiles.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-lg flex items-center justify-center">
                <Download className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Downloaded List
              </h1>
            </div>
            <p className="text-gray-600 mt-1">
              Manage and access all your downloaded files and data exports
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              <FileText className="w-3 h-3 mr-1" />
              Total Files:{" "}
              <span className="font-bold ml-1">{filteredFiles.length}</span>
            </Badge>
            <Badge variant="secondary" className="bg-green-50 text-green-700">
              <Download className="w-3 h-3 mr-1" />
              Records:{" "}
              <span className="font-bold ml-1">
                {filteredFiles
                  .reduce((total, file) => total + file.dataCount, 0)
                  .toLocaleString()}
              </span>
            </Badge>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg">
              <Filter className="w-5 h-5 mr-2 text-valasys-orange" />
              Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Buttons Section */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Maximize className="w-4 h-4 mr-2" />
                  Full Screen
                </Button>
                {selectedFiles.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDeleteClick}
                    className="text-red-600 border-red-300 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected ({selectedFiles.length})
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by file name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* File Type Filter */}
              <div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fileTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Options */}
              <div>
                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onValueChange={(value) => {
                    const [newSortBy, newSortOrder] = value.split("-");
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder as "asc" | "desc");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Date (Newest)</SelectItem>
                    <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="count-desc">Count (High-Low)</SelectItem>
                    <SelectItem value="count-asc">Count (Low-High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Filter Button */}
              <div>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedType("All Types");
                    setSortBy("date");
                    setSortOrder("desc");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Downloads Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-valasys-gray-50">
                    <TableHead className="w-12">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={isAllSelected}
                          ref={(el) => {
                            if (el) (el as any).indeterminate = isIndeterminate;
                          }}
                          onCheckedChange={handleSelectAll}
                        />
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-semibold text-valasys-gray-900 cursor-pointer hover:bg-valasys-gray-100 transition-colors"
                      onClick={() => {
                        if (sortBy === "name") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("name");
                          setSortOrder("asc");
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        File Name
                        <div className="ml-2">
                          {sortBy === "name" ? (
                            <span className="text-valasys-orange">
                              {sortOrder === "asc" ? "↑" : "↓"}
                            </span>
                          ) : (
                            <span className="text-valasys-gray-400">↕</span>
                          )}
                        </div>
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-semibold text-valasys-gray-900 cursor-pointer hover:bg-valasys-gray-100 transition-colors"
                      onClick={() => {
                        if (sortBy === "count") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("count");
                          setSortOrder("desc");
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        Data Count
                        <div className="ml-2">
                          {sortBy === "count" ? (
                            <span className="text-valasys-orange">
                              {sortOrder === "asc" ? "↑" : "↓"}
                            </span>
                          ) : (
                            <span className="text-valasys-gray-400">↕</span>
                          )}
                        </div>
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-semibold text-valasys-gray-900 cursor-pointer hover:bg-valasys-gray-100 transition-colors"
                      onClick={() => {
                        if (sortBy === "date") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("date");
                          setSortOrder("desc");
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        Downloaded Date
                        <div className="ml-2">
                          {sortBy === "date" ? (
                            <span className="text-valasys-orange">
                              {sortOrder === "asc" ? "↑" : "↓"}
                            </span>
                          ) : (
                            <span className="text-valasys-gray-400">↕</span>
                          )}
                        </div>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-valasys-gray-900">
                      Type
                    </TableHead>
                    <TableHead className="font-semibold text-valasys-gray-900">
                      File Size
                    </TableHead>
                    <TableHead className="font-semibold text-valasys-gray-900 text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiles.length > 0 ? (
                    filteredFiles.map((file) => (
                      <TableRow
                        key={file.id}
                        className={cn(
                          "hover:bg-valasys-gray-50 transition-colors",
                          selectedFiles.includes(file.id) &&
                            "bg-valasys-orange/5",
                        )}
                      >
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={selectedFiles.includes(file.id)}
                              onCheckedChange={(checked) =>
                                handleSelectFile(file.id, checked as boolean)
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-valasys-gray-500" />
                            <span className="text-valasys-gray-900">
                              {file.fileName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-valasys-gray-700">
                            {file.dataCount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-valasys-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>{file.downloadedDate}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-medium",
                              getTypeColor(file.type),
                            )}
                          >
                            {file.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-valasys-gray-600 text-sm">
                            {file.fileSize}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(file)}
                              className="h-8 w-8 p-0 text-valasys-orange border-valasys-orange hover:bg-valasys-orange hover:text-white"
                              title="Download file"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center space-y-3">
                          <FileText className="h-12 w-12 text-valasys-gray-300" />
                          <p className="text-valasys-gray-500 font-medium">
                            No files found
                          </p>
                          <p className="text-valasys-gray-400 text-sm">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Footer Information */}
        <div className="mt-6 text-center text-sm text-valasys-gray-500">
          <p>
            Files are automatically removed after 30 days. Download important
            files to your local storage.
          </p>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this file? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Delete Confirmation Dialog */}
        <Dialog
          open={bulkDeleteDialogOpen}
          onOpenChange={setBulkDeleteDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Bulk Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedFiles.length} selected
                file(s)? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setBulkDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmBulkDelete}>
                Delete {selectedFiles.length} Files
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
