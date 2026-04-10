"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Upload } from "lucide-react";
import { useMemo, useRef } from "react";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3001";

const toMediaUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

export default function ProductImageManager({
  existingImages = [],
  onRemoveExisting,
  newFiles = [],
  onFilesChange,
  disabled = false,
}) {
  const fileInputRef = useRef(null);

  const previews = useMemo(
    () =>
      newFiles.map((file) => ({
        key: `${file.name}-${file.size}-${file.lastModified}`,
        url: URL.createObjectURL(file),
        file,
      })),
    [newFiles],
  );

  const handleFileSelect = (files) => {
    if (!files || !files.length || disabled) {
      return;
    }

    const selectedFiles = Array.from(files);
    onFilesChange?.([...newFiles, ...selectedFiles]);
  };

  const removeNewFile = (fileToRemove) => {
    const remaining = newFiles.filter(
      (file) =>
        !(
          file.name === fileToRemove.name &&
          file.size === fileToRemove.size &&
          file.lastModified === fileToRemove.lastModified
        ),
    );
    onFilesChange?.(remaining);
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer"
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFileSelect(event.dataTransfer.files);
        }}
      >
        <div className="mb-2 bg-muted rounded-full p-3">
          <Upload className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-pretty text-sm font-medium text-foreground">
          Add product images
        </p>
        <p className="text-pretty text-sm text-muted-foreground mt-1">
          Drag and drop files here or click to browse
        </p>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={(event) => handleFileSelect(event.target.files)}
          disabled={disabled}
        />
      </div>

      {existingImages.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Existing Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {existingImages.map((media) => (
              <div key={media.id} className="border rounded-md p-2 space-y-2">
                <div className="aspect-square overflow-hidden rounded-md bg-muted">
                  <img
                    src={toMediaUrl(media.path)}
                    alt={media.filename}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs truncate">{media.filename}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onRemoveExisting?.(media.id)}
                    disabled={disabled}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {previews.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">New Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {previews.map(({ key, url, file }) => (
              <div key={key} className="border rounded-md p-2 space-y-2">
                <div className="aspect-square overflow-hidden rounded-md bg-muted">
                  <img
                    src={url}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs truncate">{file.name}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeNewFile(file)}
                    disabled={disabled}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
