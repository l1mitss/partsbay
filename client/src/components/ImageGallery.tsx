import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
  images: string[];
  title?: string;
  onImageChange?: (index: number) => void;
}

export default function ImageGallery({
  images,
  title,
  onImageChange,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    onImageChange?.(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    onImageChange?.(newIndex);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    onImageChange?.(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full bg-slate-700 border border-slate-600 rounded-lg flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-2">🖼️</div>
          <p className="text-slate-400">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="w-full bg-slate-700 border border-slate-600 rounded-lg overflow-hidden relative group">
        {/* Main Image */}
        <div className="relative w-full aspect-square bg-slate-600 flex items-center justify-center overflow-hidden">
          <img
            src={images[currentIndex]}
            alt={`${title || "Listing"} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-slate-900/70 hover:bg-slate-900 rounded-full transition opacity-0 group-hover:opacity-100"
                title="Previous image"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-900/70 hover:bg-slate-900 rounded-full transition opacity-0 group-hover:opacity-100"
                title="Next image"
              >
                <ChevronRight size={24} className="text-white" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-2 right-2 bg-slate-900/70 px-3 py-1 rounded text-sm text-white">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-2 right-2 p-2 bg-slate-900/70 hover:bg-slate-900 rounded-full transition"
            title="View fullscreen"
          >
            <Maximize2 size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                index === currentIndex
                  ? "border-blue-500 ring-2 ring-blue-400"
                  : "border-slate-600 hover:border-slate-500"
              }`}
              title={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-900/70 hover:bg-slate-900 rounded-full transition z-10"
              title="Close fullscreen"
            >
              <X size={24} className="text-white" />
            </button>

            {/* Fullscreen Image */}
            <img
              src={images[currentIndex]}
              alt={`${title || "Listing"} - Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 p-2 bg-slate-900/70 hover:bg-slate-900 rounded-full transition"
                  title="Previous image"
                >
                  <ChevronLeft size={32} className="text-white" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 p-2 bg-slate-900/70 hover:bg-slate-900 rounded-full transition"
                  title="Next image"
                >
                  <ChevronRight size={32} className="text-white" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/70 px-4 py-2 rounded text-white">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
