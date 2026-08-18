"use client"

import { useEffect, useState,useRef,useCallback } from "react"
import {
  formatBytes,
  useFileUpload,
  type FileMetadata,
    type FileWithPreview,
} from "@/hooks/use-file-upload"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/reui/alert"
import { Badge } from "@/components/reui/badge"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { uploadFile, type UploadResult } from "@/lib/upload-service"
import { ImageIcon, VideoCameraIcon, Headphones, FileTextIcon, FileArchive, UploadSimple, XIcon, WarningCircleIcon, ArrowsClockwiseIcon } from "@phosphor-icons/react"

interface FileUploadItem extends FileWithPreview {
  progress: number
  status: "uploading" | "completed" | "error" | "uploading-real"
  error?: string
  uploadResult?: UploadResult
}

interface ProgressUploadProps {
  maxFiles?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  className?: string
  onFilesChange?: (files: FileWithPreview[]) => void
  simulateUpload?: boolean
  onUploadComplete?: (file: FileUploadItem, response: UploadResult) => void
  onUploadError?: (file: FileUploadItem, error: Error) => void
}

export function Pattern({
  maxFiles = 1,
  maxSize = 50 * 1024 * 1024, // 10MB
  accept = "*",
  multiple = true,
  className,
  onFilesChange,
  simulateUpload = true,
  onUploadComplete,
  onUploadError,
}: ProgressUploadProps) {
  // Create default images using FileMetadata type
  const defaultImages: FileMetadata[] = [
    
  ]

  // Convert default images to FileUploadItem format
  const defaultUploadFiles: FileUploadItem[] = defaultImages.map((image) => ({
    id: image.id,
    file: {
      name: image.name,
      size: image.size,
      type: image.type,
    } as File,
    preview: image.url,
    progress: 100,
    status: "completed" as const,
  }))

  const [uploadFiles, setUploadFiles] =
    useState<FileUploadItem[]>(defaultUploadFiles)

  const uploadedFilesRef = useRef<Set<string>>(new Set())

  const [
    { isDragging, errors },
    {
      removeFile,
      clearFiles: originalClearFiles,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple,
    initialFiles: defaultImages,
    onFilesChange: (newFiles) => {
      // Convert to upload items when files change, preserving existing status
      const newUploadFiles = newFiles.map((file) => {
        // Check if this file already exists in uploadFiles
        const existingFile = uploadFiles.find(
          (existing) => existing.id === file.id
        )

        if (existingFile) {
          // Preserve existing file status and progress
          return {
            ...existingFile,
            ...file, // Update any changed properties from the file
          }
        } else {
          // New file - set to uploading
          return {
            ...file,
            progress: 0,
            status: "uploading" as const,
          }
        }
      })
setUploadFiles(newUploadFiles)
      onFilesChange?.(newFiles)
    },
  })

  const clearFiles = useCallback(() => {
    uploadedFilesRef.current.clear()
    originalClearFiles()
  }, [originalClearFiles])

  // Simulate upload progress
  useEffect(() => {
    if (!simulateUpload) return

    const interval = setInterval(() => {
      setUploadFiles((prev) =>
        prev.map((file) => {
          if (file.status !== "uploading") return file

          const increment = Math.random() * 15 + 5 // 5-20% increment
          const newProgress = Math.min(file.progress + increment, 100)

          // Simulate occasional errors (10% chance when progress > 50%)

          // Complete when progress reaches 100%
          if (newProgress >= 100 && (file as FileUploadItem).status !== "uploading-real" && !uploadedFilesRef.current.has(file.id)) {
            // Mark as uploaded to prevent duplicate triggers
            uploadedFilesRef.current.add(file.id)
            // Trigger real upload asynchronously
            const fileForUpload = file.file as File
            uploadFile(fileForUpload)
              .then((result) => {
                setUploadFiles((current) =>
                  current.map((f) =>
                    f.id === file.id
                      ? { ...f, progress: 100, status: "completed" as const, uploadResult: result }
                      : f
                  )
                )
              })
              .catch((error) => {
                setUploadFiles((current) =>
                  current.map((f) =>
                    f.id === file.id
                      ? { ...f, status: "error" as const, error: error instanceof Error ? error.message : "Upload failed" }
                      : f
                  )
                )
              })

            // Return intermediate state - mark as "uploading-real" to prevent duplicate triggers
            return {
              ...file,
              progress: 100,
              status: "uploading-real" as const,
            }
          }

          return {
            ...file,
            progress: newProgress,
          }
        })
      )
    }, 500)

    return () => clearInterval(interval)
  }, [simulateUpload])

  // Trigger callbacks on upload completion/error
  useEffect(() => {
    uploadFiles.forEach((file) => {
      if (file.status === "completed" && file.uploadResult && onUploadComplete) {
        onUploadComplete(file, file.uploadResult)
      }
      if (file.status === "error" && file.error && onUploadError) {
        onUploadError(file, new Error(file.error))
      }
    })
  }, [uploadFiles, onUploadComplete, onUploadError])

  const retryUpload = (fileId: string) => {
    uploadedFilesRef.current.delete(fileId)
    setUploadFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              progress: 0,
              status: "uploading" as const,
              error: undefined,
            }
          : file
      )
    )
  }

  const removeUploadFile = (fileId: string) => {
    uploadedFilesRef.current.delete(fileId)
    setUploadFiles((prev) => prev.filter((file) => file.id !== fileId))
    removeFile(fileId)
  }

  const getFileIcon = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type
    if (type.startsWith("image/"))
      return (
        <ImageIcon className="size-4" />
      )
    if (type.startsWith("video/"))
      return (
        <VideoCameraIcon className="size-4" />
      )
    if (type.startsWith("audio/"))
      return (
        <Headphones className="size-4" />
      )
    if (type.includes("pdf"))
      return (
        <FileTextIcon className="size-4" />
      )
    if (type.includes("word") || type.includes("doc"))
      return (
        <FileTextIcon className="size-4" />
      )
    if (type.includes("excel") || type.includes("sheet"))
      return (
        <FileTextIcon className="size-4" />
      )
    if (type.includes("zip") || type.includes("rar"))
      return (
        <FileArchive className="size-4" />
      )
    return (
      <FileTextIcon className="size-4" />
    )
  }

  const completedCount = uploadFiles.filter(
    (f) => f.status === "completed"
  ).length
  const errorCount = uploadFiles.filter((f) => f.status === "error").length
  const uploadingCount = uploadFiles.filter(
    (f) => f.status === "uploading"
  ).length

  return (
    <div className={cn("w-full max-w-2xl", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "rounded-lg relative border border-dashed p-8 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-orange-300"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input {...getInputProps()} className="sr-only" />

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full",
              isDragging ? "bg-primary/10" : "bg-muted"
            )}
          >
            <UploadSimple className={cn(
                                      "h-6",
                                      isDragging ? "text-primary" : "text-muted-foreground"
                                    )} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg text-white font-semibold">Upload your files</h3>
            <p className="text-muted-foreground text-sm">
              Drag and drop files here or click to browse
            </p>
            <p className="text-muted-foreground text-xs">
              Support for multiple file types up to {formatBytes(maxSize)} each
            </p>
          </div>

          <Button className={`rounded-lg`} onClick={openFileDialog}>
            <UploadSimple className="h-4 w-4" />
            Select files
          </Button>
        </div>
      </div>

      {/* Upload Stats */}
      {uploadFiles.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm text-white font-medium">Upload Progress</h4>
            <div className="flex items-center gap-2">
              {completedCount > 0 && (
                <Badge size="sm" variant="success-light">
                  Completed: {completedCount}
                </Badge>
              )}
              {errorCount > 0 && (
                <Badge size="sm" variant="destructive">
                  Failed: {errorCount}
                </Badge>
              )}
              {uploadingCount > 0 && (
                <Badge size="sm" variant="secondary">
                  Uploading: {uploadingCount}
                </Badge>
              )}
            </div>
          </div>

          <Button className={`text-white`} onClick={clearFiles} variant="outline" size="sm">
            Clear all
          </Button>
        </div>
      )}

      {/* File List */}
      {uploadFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          {uploadFiles.map((fileItem: FileUploadItem) => (
            <div
              key={fileItem.id}
              className="border-border bg-orange-50 rounded-lg border p-2.5"
            >
              <div className="flex items-start gap-5.5">
                {/* File Icon */}
                <div className="shrink-0">
                  {fileItem.preview &&
                  fileItem.file.type.startsWith("image/") ? (
                    <img
                      src={fileItem.preview}
                      alt={fileItem.file.name}
                      className="rounded-lg h-12 w-12 border object-cover"
                    />
                  ) : (
                    <div className="border-border text-muted-foreground rounded-lg flex h-12 w-12 items-center justify-center border">
                      {getFileIcon(fileItem.file)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="min-w-0 flex-1">
                  <div className="mt-0.75 flex items-center justify-between ">
                    <p className="flex flex-col gap-1 font-medium">
                      <span className="text-sm">{fileItem.file.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {formatBytes(fileItem.file.size)}
                      </span>
                    </p>
                    <div className="flex items-center gap-2">
                      {/* Remove Button */}
                      <Button
                        onClick={() => removeUploadFile(fileItem.id)}
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground size-10 hover:bg-transparent hover:opacity-100"
                      >
                        <XIcon className="size-6" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {fileItem.status === "uploading" && (
                    <div className="mt-2">
                      <Progress value={fileItem.progress} className="h-1" />
                    </div>
                  )}

                  {/* Error Message */}
                  {fileItem.status === "error" && fileItem.error && (
                    <Alert variant="destructive" className="mt-2 px-2 py-1">
                      <WarningCircleIcon className="size-4" />
                      <AlertTitle className="text-xs">
                        {fileItem.error}
                      </AlertTitle>
                      <AlertAction>
                        <Button
                          onClick={() => retryUpload(fileItem.id)}
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground size-6 hover:bg-transparent hover:opacity-100"
                        >
                          <ArrowsClockwiseIcon className="size-3.5" />
                        </Button>
                      </AlertAction>
                    </Alert>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="mt-5">
          <WarningCircleIcon
          />
          <AlertTitle>File upload error(s)</AlertTitle>
          <AlertDescription>
            {errors.map((error, index) => (
              <p key={index} className="last:mb-0">
                {error}
              </p>
            ))}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}