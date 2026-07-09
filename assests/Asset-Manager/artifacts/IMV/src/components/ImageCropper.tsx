import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImageCropperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  onCropComplete: (blob: Blob) => void;
}

export function ImageCropper({ open, onOpenChange, imageSrc, onCropComplete }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 10, y: 10, width: 80, height: 80 }); // Percentage-based
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 });

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
    if (!imageRef.current) return;
    const img = imageRef.current;
    const canvas = document.createElement("canvas");
    
    // Target 400x400 for standard avatar size
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Convert percentage to pixels
    const sourceX = (crop.x / 100) * img.naturalWidth;
    const sourceY = (crop.y / 100) * img.naturalHeight;
    const sourceWidth = (crop.width / 100) * img.naturalWidth;
    const sourceHeight = (crop.height / 100) * img.naturalHeight;

    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      400,
      400
    );

    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob);
      }
    }, "image/jpeg", 0.9);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crop Faculty Photo</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          <div 
            ref={containerRef}
            className="relative max-w-full max-h-[350px] overflow-hidden border bg-black select-none"
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Source"
              className="max-w-full max-h-[350px] object-contain pointer-events-none"
            />
            <div
              onMouseDown={handleMouseDown}
              className="absolute border-2 border-white cursor-move shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] rounded-full"
              style={{
                left: `${crop.x}%`,
                top: `${crop.y}%`,
                width: `${crop.width}%`,
                height: `${crop.height}%`,
                aspectRatio: "1/1",
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Drag the circle to position your profile image.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={getCroppedImg}>
            Crop & Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
