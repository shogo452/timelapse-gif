import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RotateCw, X, Eye } from "lucide-react";
import type { ImageFile } from "@/types";

interface ImageListProps {
  images: ImageFile[];
  reorderImages: (images: ImageFile[]) => void;
  rotateImage: (objectUrl: string) => void;
  removeImage: (objectUrl: string) => void;
}

function SortableImageItem({
  image,
  index,
  onRotate,
  onRemove,
  onPreview,
}: {
  image: ImageFile;
  index: number;
  onRotate: () => void;
  onRemove: () => void;
  onPreview: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.objectUrl });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const dateDisplay = image.dateString.slice(5); // MM/DD
  const formattedDate = dateDisplay.replace("-", "/");

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-[#F6F7F8] rounded-xl overflow-hidden"
    >
      <div
        {...attributes}
        {...listeners}
        className="relative cursor-grab active:cursor-grabbing aspect-[4/3] overflow-hidden"
      >
        <img
          src={image.objectUrl}
          alt={image.originalName}
          className="w-full h-full object-cover"
          style={{ transform: `rotate(${image.rotation}deg)` }}
          draggable={false}
        />
        <span className="absolute top-1.5 left-1.5 min-w-[22px] h-[22px] flex items-center justify-center bg-black/60 text-white text-[10px] font-bold rounded-full px-1">
          {index + 1}
        </span>
      </div>
      <div className="px-2 py-1.5">
        <span className="text-xs font-semibold text-[#1A1A1A]">{formattedDate}</span>
      </div>
      <div className="flex items-center justify-center gap-2 px-2 pb-1.5">
        <button
          onClick={onPreview}
          className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onRotate}
          className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
        >
          <RotateCw className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onRemove}
          className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function ImagePreviewModal({
  image,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  image: ImageFile;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg text-[#6B7280] hover:text-[#1A1A1A] transition-colors z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Image */}
        <img
          src={image.objectUrl}
          alt={image.originalName}
          className="max-w-full max-h-[80vh] rounded-xl object-contain"
          style={{ transform: `rotate(${image.rotation}deg)` }}
        />

        {/* Footer */}
        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={onPrev}
            disabled={index === 0}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-[#1A1A1A] text-sm font-bold disabled:opacity-30 hover:bg-white transition-colors"
          >
            ‹
          </button>
          <span className="text-white text-sm font-semibold">
            {index + 1} / {total}
          </span>
          <button
            onClick={onNext}
            disabled={index === total - 1}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-[#1A1A1A] text-sm font-bold disabled:opacity-30 hover:bg-white transition-colors"
          >
            ›
          </button>
        </div>

        {/* Info */}
        <div className="mt-2 text-white/70 text-xs">
          {image.originalName} — {image.dateString}
        </div>
      </div>
    </div>
  );
}

export function ImageList({
  images,
  reorderImages,
  rotateImage,
  removeImage,
}: ImageListProps) {
  const { t } = useTranslation();
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const closePreview = useCallback(() => setPreviewIndex(null), []);
  const showPrev = useCallback(
    () => setPreviewIndex((i) => (i !== null && i > 0 ? i - 1 : i)),
    []
  );
  const showNext = useCallback(
    () =>
      setPreviewIndex((i) =>
        i !== null && i < images.length - 1 ? i + 1 : i
      ),
    [images.length]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.objectUrl === active.id);
      const newIndex = images.findIndex((img) => img.objectUrl === over.id);
      reorderImages(arrayMove(images, oldIndex, newIndex));
    }
  }

  if (images.length === 0) {
    return (
      <p className="text-sm text-[#6B7280] text-center py-4">
        {t("imageList.empty")}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold font-[Bricolage_Grotesque] text-[#1A1A1A]">
            {t("imageList.title")}
          </h3>
          <span className="text-xs font-semibold text-[#22C55E] bg-[#F0FDF4] px-3 py-1 rounded-xl">
            {t("imageList.count", { count: images.length })}
          </span>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((img) => img.objectUrl)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {images.map((img, i) => (
              <SortableImageItem
                key={img.objectUrl}
                image={img}
                index={i}
                onRotate={() => rotateImage(img.objectUrl)}
                onRemove={() => removeImage(img.objectUrl)}
                onPreview={() => setPreviewIndex(i)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {previewIndex !== null && images[previewIndex] && (
        <ImagePreviewModal
          image={images[previewIndex]}
          index={previewIndex}
          total={images.length}
          onClose={closePreview}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}
    </div>
  );
}
