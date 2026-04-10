"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import api from "@/lib/api";

import { cn } from "@/lib/utils";
import { Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function FileUpload01() {
  const fileInputRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileProgresses, setFileProgresses] = useState({});

  const handleFileSelect = (files) => {
    if (!files) return;

    const newFiles = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress for each file
    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setFileProgresses((prev) => ({
          ...prev,
          [file.name]: Math.min(progress, 100),
        }));
      }, 300);
    });
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (filename) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== filename));
    setFileProgresses((prev) => {
      const newProgresses = { ...prev };
      delete newProgresses[filename];
      return newProgresses;
    });
  };

  const uploadFiles = async () => {
    const formData = new FormData();

    try {
      if (uploadedFiles.length === 1) {
        formData.append("file", uploadedFiles[0]);
        const res = await api.post("/upload/single", formData);
        console.log("Upload response:", res.data);
      } else {
        uploadedFiles.forEach((file) => {
          formData.append("files", file);
        });
        const res = await api.post("/upload/multiple", formData);
        console.log("Upload response:", res.data);
      }
      setUploadedFiles([]);
      setFileProgresses({});
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <CardContent className="p-0">
      <div className=" pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-balance text-lg font-medium text-foreground">
              Add Product Images
            </h2>
            <p className="text-pretty text-sm text-muted-foreground mt-1">
              Drag and drop files to add images to your product.
            </p>
          </div>
        </div>
      </div>

      <div
        className="border-2 border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer"
        onClick={handleBoxClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="mb-2 bg-muted rounded-full p-3">
          <Upload className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-pretty text-sm font-medium text-foreground">
          Upload a project image
        </p>
        <p className="text-pretty text-sm text-muted-foreground mt-1">
          or,
          <label
            htmlFor="fileUpload"
            className="text-primary hover:text-primary/90 font-medium cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            click to browse
          </label>{" "}
          (4MB max)
        </p>
        <input
          type="file"
          id="fileUpload"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>

      <div className={cn("space-y-3", uploadedFiles.length > 0 ? "mt-4" : "")}>
        {uploadedFiles.map((file, index) => {
          const imageUrl = URL.createObjectURL(file);

          return (
            <div
              className="border border-border rounded-lg p-2 flex flex-col"
              key={file.name + index}
              onLoad={() => {
                return () => URL.revokeObjectURL(imageUrl);
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-18 h-14 bg-muted rounded-sm flex items-center justify-center self-start row-span-2 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 pr-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground truncate max-w-[250px]">
                        {file.name}
                      </span>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {Math.round(file.size / 1024)} KB
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="bg-transparent! hover:text-red-500"
                      onClick={() => removeFile(file.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-2 bg-muted rounded-full overflow-hidden flex-1">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${fileProgresses[file.name] || 0}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {Math.round(fileProgresses[file.name] || 0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Button onClick={() => uploadFiles()}>Upload Files</Button>
    </CardContent>
  );
}
