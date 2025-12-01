"use client";

import { useState } from "react";
import {
  SlidersHorizontal,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  WandSparkles,
} from "lucide-react";
import { Image as IKImage } from "@imagekit/next";

export default function ImageEditorPanel() {
  const [imageSettings, setImageSettings] = useState({
    brightness: 50,
    contrast: 0,
    saturation: 0,
    hue: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
    opacity: 100,
    blur: 0,
    rotation: 0,
    flipH: false,
    flipV: false,
  });

  const handleChange = (key: string, val: number) =>
    setImageSettings((prev) => ({ ...prev, [key]: val }));

  const toggleFlip = (dir: "flipH" | "flipV") =>
    setImageSettings((prev) => ({ ...prev, [dir]: !prev[dir] }));

  const setRotation = (deg: number) =>
    setImageSettings((prev) => ({ ...prev, rotation: deg }));

  const AdjustmentSlider = ({
    label,
    name,
    unit,
    min,
    max,
  }: {
    label: string;
    name: keyof typeof imageSettings;
    unit: string;
    min: number;
    max: number;
  }) => (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm text-gray-700">{label}</label>
        <span className="text-xs text-gray-500">
          {imageSettings[name]}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={imageSettings[name] as number}
        onChange={(e) => handleChange(name, Number(e.target.value))}
        className="w-full accent-[#ec592d]"
      />
    </div>
  );

  // Build the ImageKit transformation dynamically
  const transformations = [
    { rt: imageSettings.rotation },
    { bl: imageSettings.blur },
    { o: imageSettings.opacity },
    ...(imageSettings.flipH ? [{ fl: "h" }] : []),
    ...(imageSettings.flipV ? [{ fl: "v" }] : []),
    { raw: `e-brightness-${imageSettings.brightness}` },
    { raw: `e-contrast-${imageSettings.contrast}` },
    { raw: `e-saturation-${imageSettings.saturation}` },
    { raw: `e-hue-${imageSettings.hue}` },
    ...(imageSettings.grayscale > 0 ? [{ e: "grayscale" }] : []),
    ...(imageSettings.sepia > 0 ? [{ e: "sepia" }] : []),
    ...(imageSettings.invert > 0 ? [{ e: "invert" }] : []),
  ];

  const imageSrc = "https://ik.imagekit.io/ikmedia/blue-bmw.jpg";

  return (
    <div className="grid md:grid-cols-2 gap-6 items-start">
      <div className="flex justify-center bg-gray-50 border rounded-xl p-4">
        <IKImage
          src={imageSrc}
          alt="Edited Image"
          width={500}
          height={500}
          transformation={transformations}
          loading="lazy"
          className="rounded-lg shadow-md"
        />
      </div>

      {/* Controls Panel */}
      <div className="space-y-4">
        {/* Adjustments */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="w-4 h-4 text-[#ec592d]" />
            <h2 className="text-base font-medium text-gray-900">Adjustments</h2>
          </div>
          <div className="space-y-5">
            <AdjustmentSlider
              label="Brightness"
              name="brightness"
              unit="%"
              min={0}
              max={100}
            />
            <AdjustmentSlider
              label="Contrast"
              name="contrast"
              unit="%"
              min={0}
              max={100}
            />
            <AdjustmentSlider
              label="Saturation"
              name="saturation"
              unit="%"
              min={0}
              max={300}
            />
            <AdjustmentSlider
              label="Hue"
              name="hue"
              unit="°"
              min={0}
              max={100}
            />
            <AdjustmentSlider
              label="Grayscale"
              name="grayscale"
              unit="%"
              min={0}
              max={100}
            />
            <AdjustmentSlider
              label="Sepia"
              name="sepia"
              unit="%"
              min={0}
              max={100}
            />
            <AdjustmentSlider
              label="Invert"
              name="invert"
              unit="%"
              min={0}
              max={100}
            />
            <AdjustmentSlider
              label="Opacity"
              name="opacity"
              unit="%"
              min={10}
              max={100}
            />
            <AdjustmentSlider
              label="Blur"
              name="blur"
              unit="px"
              min={0}
              max={100}
            />
          </div>
        </div>

        {/* Orientation */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <RotateCcw className="w-4 h-4 text-[#ec592d]" />
            <h2 className="text-base font-medium text-gray-900">Orientation</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {["0", "90", "180", "270"].map((deg) => (
              <button
                key={deg}
                onClick={() => setRotation(Number(deg))}
                className={`px-3 py-1.5 rounded-xl border ${
                  imageSettings.rotation === Number(deg)
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {deg}°
              </button>
            ))}
            <div className="ml-2 flex items-center gap-2">
              <button
                onClick={() => toggleFlip("flipH")}
                title="Flip Horizontal"
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border ${
                  imageSettings.flipH
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FlipHorizontal className="w-4 h-4" /> Flip H
              </button>
              <button
                onClick={() => toggleFlip("flipV")}
                title="Flip Vertical"
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border ${
                  imageSettings.flipV
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FlipVertical className="w-4 h-4" /> Flip V
              </button>
            </div>
          </div>
        </div>

        {/* Presets */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <WandSparkles className="w-4 h-4 text-[#ec592d]" />
            <h2 className="text-base font-medium text-gray-900">Presets</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Vibrant", "Warm", "Cool", "B&W", "Reset"].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  if (preset === "Reset")
                    setImageSettings({
                      brightness: 100,
                      contrast: 100,
                      saturation: 100,
                      hue: 0,
                      grayscale: 0,
                      sepia: 0,
                      invert: 0,
                      opacity: 100,
                      blur: 0,
                      rotation: 0,
                      flipH: false,
                      flipV: false,
                    });
                }}
                className="px-3 py-1.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
