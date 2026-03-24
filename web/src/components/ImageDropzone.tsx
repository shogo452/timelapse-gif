import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CloudUpload, Folder, Image, FileArchive } from "lucide-react";

interface ImageDropzoneProps {
  addFiles: (files: File[]) => Promise<void>;
  addZip: (file: File) => Promise<void>;
  isLoading: boolean;
}

export function ImageDropzone({ addFiles, addZip, isLoading }: ImageDropzoneProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const folderRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      const zipFiles = files.filter((f) => f.name.toLowerCase().endsWith(".zip"));
      const imageFiles = files.filter((f) => !f.name.toLowerCase().endsWith(".zip"));

      for (const zip of zipFiles) {
        await addZip(zip);
      }
      if (imageFiles.length > 0) {
        await addFiles(imageFiles);
      }
    },
    [addFiles, addZip]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFolderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        addFiles(Array.from(e.target.files));
      }
    },
    [addFiles]
  );

  const handleFilesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        addFiles(Array.from(e.target.files));
      }
    },
    [addFiles]
  );

  const handleZipChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        addZip(e.target.files[0]);
      }
    },
    [addZip]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`flex flex-col items-center gap-4 border-2 border-dashed rounded-2xl p-8 bg-[#F6F7F8] transition-colors ${
        isDragging
          ? "border-[#22C55E] bg-green-50"
          : "border-[#D1D5DB] hover:border-[#9CA3AF]"
      }`}
    >
      <CloudUpload className="h-10 w-10 text-[#9CA3AF]" />
      <div className="text-center">
        <h2 className="text-lg font-bold font-[Bricolage_Grotesque] text-[#1A1A1A]">
          {t("dropzone.title")}
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          {t("dropzone.description")}
        </p>
      </div>

      <div className="flex gap-2.5">
        <button
          onClick={() => folderRef.current?.click()}
          disabled={isLoading}
          className="flex items-center gap-1.5 bg-[#22C55E] text-white text-[13px] font-semibold px-4 py-2 rounded-full hover:bg-[#16A34A] transition-colors disabled:opacity-50"
        >
          <Folder className="h-4 w-4" />
          {t("dropzone.folder")}
        </button>
        <button
          onClick={() => filesRef.current?.click()}
          disabled={isLoading}
          className="flex items-center gap-1.5 bg-white text-[#6B7280] text-[13px] font-semibold px-4 py-2 rounded-full border border-[#D1D5DB] hover:border-[#9CA3AF] transition-colors disabled:opacity-50"
        >
          <Image className="h-4 w-4" />
          {t("dropzone.images")}
        </button>
        <button
          onClick={() => zipRef.current?.click()}
          disabled={isLoading}
          className="flex items-center gap-1.5 bg-white text-[#6B7280] text-[13px] font-semibold px-4 py-2 rounded-full border border-[#D1D5DB] hover:border-[#9CA3AF] transition-colors disabled:opacity-50"
        >
          <FileArchive className="h-4 w-4" />
          {t("dropzone.zip")}
        </button>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={folderRef}
        type="file"
        className="hidden"
        onChange={handleFolderChange}
        {...({ webkitdirectory: "", directory: "" } as React.InputHTMLAttributes<HTMLInputElement>)}
        multiple
      />
      <input
        ref={filesRef}
        type="file"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFilesChange}
      />
      <input
        ref={zipRef}
        type="file"
        className="hidden"
        accept=".zip"
        onChange={handleZipChange}
      />
    </div>
  );
}
