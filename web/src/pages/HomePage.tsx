import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenLine, Film } from "lucide-react";
import type { ImageFile } from "@/types";
import { useImageUpload } from "@/hooks/useImageUpload";
import { ImageDropzone } from "@/components/ImageDropzone";
import { ImageList } from "@/components/ImageList";
import { RenamePanel } from "@/components/RenamePanel";
import { GeneratePanel } from "@/components/GeneratePanel";
import { StepGuide } from "@/components/StepGuide";

export function HomePage() {
  const { t } = useTranslation();
  const [images, setImages] = useState<ImageFile[]>([]);
  const { addFiles, addZip, removeImage, rotateImage, reorderImages, isLoading } =
    useImageUpload(setImages);

  return (
    <main className="mx-auto max-w-5xl px-10 pb-10 space-y-6">
      {/* Step Guide */}
      <StepGuide />

      {/* Upload */}
      <ImageDropzone
        addFiles={addFiles}
        addZip={addZip}
        isLoading={isLoading}
      />

      {/* Image List */}
      <ImageList
        images={images}
        reorderImages={reorderImages}
        rotateImage={rotateImage}
        removeImage={removeImage}
      />

      {/* Tabs */}
      {images.length > 0 && (
        <Tabs defaultValue="generate">
          <TabsList className="w-full rounded-xl h-11 p-1 bg-[#F6F7F8]">
            <TabsTrigger value="rename" className="flex-1 gap-1.5 rounded-[10px] data-[state=active]:bg-white">
              <PenLine className="h-4 w-4" />
              {t("tabs.rename")}
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex-1 gap-1.5 rounded-[10px] data-[state=active]:bg-white">
              <Film className="h-4 w-4" />
              {t("tabs.generate")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="rename">
            <div className="bg-[#F6F7F8] rounded-b-xl p-6">
              <RenamePanel images={images} />
            </div>
          </TabsContent>
          <TabsContent value="generate">
            <GeneratePanel images={images} />
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
}
