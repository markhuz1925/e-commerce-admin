"use client";

import { Button } from "@/components/ui/button";
import { ImagePlusIcon, Trash2Icon } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value,
}: {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value?: string[];
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const uploadImage = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value?.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px]">
            <div className="absolute z-10 top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" src={url} alt="Image" />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={uploadImage} uploadPreset="qapzjv4g">
        {({ open }) => {
          const onClick = () => {
            open();
          };
          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlusIcon className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
