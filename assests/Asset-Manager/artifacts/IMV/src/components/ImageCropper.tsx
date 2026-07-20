import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

interface ImageCropperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  onCropComplete: (blob: Blob) => void;
}

export function ImageCropper({ open, onOpenChange, imageSrc, onCropComplete }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 25, y: 15, width: 50, height: 50 });
  const [zoom, setZoom] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (open) {
      setZoom(1);
      setCrop({ x: 25, y: 15, width: 50, height: 50 });
    }
  }, [open]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setCropStart({ x: crop.x, y: crop.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragStart.x) / rect.width) * 100;
    const dy = ((e.clientY - dragStart.y) / rect.height) * 100;

    let newX = Math.max(0, Math.min(100 - crop.width, cropStart.x + dx));
    let newY = Math.max(0, Math.min(100 - crop.height, cropStart.y + dy));

    setCrop((prev) => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const getCroppedImg = () => {
    if (!imageRef.current || !containerRef.current) return;
    const img = imageRef.current;
    const canvas = document.createElement("canvas");
    
    const targetWidth = 500;
    const targetHeight = 500;
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;

    const cropBoxXInContainer = (crop.x / 100) * containerRect.width;
    const cropBoxYInContainer = (crop.y / 100) * containerRect.height;

    const cropBoxWidthInContainer = (crop.width / 100) * containerRect.width;
    const cropBoxHeightInContainer = (crop.height / 100) * containerRect.height;

    const cropBoxXInImg = cropBoxXInContainer - (imgRect.left - containerRect.left);
    const cropBoxYInImg = cropBoxYInContainer - (imgRect.top - containerRect.top);

    const sourceX = Math.max(0, cropBoxXInImg * scaleX);
    const sourceY = Math.max(0, cropBoxYInImg * scaleY);
    const sourceW = Math.min(img.naturalWidth - sourceX, cropBoxWidthInContainer * scaleX);
    const sourceH = Math.min(img.naturalHeight - sourceY, cropBoxHeightInContainer * scaleY);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceW,
      sourceH,
      0,
      0,
      targetWidth,
      targetHeight
    );

    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob);
      }
    }, "image/jpeg", 0.92);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] bg-[#0b1329] border border-[#1e2d4a] text-white p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="pb-2 border-b border-[#1e2d4a]">
          <DialogTitle className="text-xl font-bold text-white tracking-wide">
            Crop Professional Photograph
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Main Image Cropper Preview Box */}
          <div
            ref={containerRef}
            className="relative w-full h-[320px] bg-[#050914] rounded-xl overflow-hidden flex items-center justify-center select-none border border-[#1e2d4a]"
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Source preview"
              style={{
                transform: `scale(${zoom})`,
                transition: isDragging ? "none" : "transform 0.15s ease-out",
              }}
              className="max-h-[300px] max-w-[90%] object-contain pointer-events-none"
            />

            {/* Draggable Crop Box with 3x3 Grid */}
            <div
              onMouseDown={handleMouseDown}
              className="absolute border-2 border-white/90 cursor-move shadow-[0_0_0_9999px_rgba(5,9,20,0.7)] z-10 transition-shadow"
              style={{
                left: `${crop.x}%`,
                top: `${crop.y}%`,
                width: `${crop.width}%`,
                aspectRatio: "1 / 1",
              }}
            >
              {/* 3x3 Grid Overlay Lines (Rule of Thirds) */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
                <div className="border-r border-b border-white/30"></div>
                <div className="border-r border-b border-white/30"></div>
                <div className="border-b border-white/30"></div>
                <div className="border-r border-b border-white/30"></div>
                <div className="border-r border-b border-white/30"></div>
                <div className="border-b border-white/30"></div>
                <div className="border-r border-white/30"></div>
                <div className="border-r border-white/30"></div>
                <div></div>
              </div>
            </div>
          </div>

          {/* Zoom Level Slider Bar */}
          <div className="bg-[#121c33] border border-[#1e2d4a] rounded-xl p-4 space-y-2">
            <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
              Zoom Level
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.max(1, prev - 0.15))}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <input
                type="range"
                min="1"
                max="3"
                step="0.02"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />

              <button
                type="button"
                onClick={() => setZoom((prev) => Math.min(3, prev + 0.15))}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-6 py-2.5 rounded-xl transition-all"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={getCroppedImg}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg transition-all"
            >
              Crop &amp; Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
