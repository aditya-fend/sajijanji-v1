"use client";

import { useState } from "react";
import {
  useEditorStore,
  type AnimationName,
  type ContainerSizeMode,
} from "@/store/useEditorStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ImageIcon, Sliders, Type } from "lucide-react";

const ANIMATION_OPTIONS: Array<{ value: AnimationName; label: string }> = [
  { value: "none", label: "None" },
  { value: "fade-up", label: "Fade up" },
  { value: "fade-right", label: "Fade right" },
  { value: "fade-down", label: "Fade down" },
  { value: "fade-left", label: "Fade left" },
  { value: "fade-in", label: "Fade in" },
  { value: "fade-out", label: "Fade out" },
];
const LOOP_OPTIONS = [
  ...ANIMATION_OPTIONS,
  { value: "wind-sway" as AnimationName, label: "Wind sway (foto lentur)" },
];

function AnimationPanel({
  animation,
  onChange,
}: {
  animation?: {
    mount: AnimationName;
    unmount: AnimationName;
    loop: AnimationName;
  };
  onChange: (key: "mount" | "unmount" | "loop", value: AnimationName) => void;
}) {
  const current = animation ?? { mount: "none", unmount: "none", loop: "none" };
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Pilih satu atau gunakan ketiganya untuk mengatur lifecycle elemen.
      </p>
      {(["mount", "unmount", "loop"] as const).map((key) => (
        <div key={key} className="space-y-2">
          <Label className="capitalize">{key}</Label>
          <select
            value={current[key]}
            onChange={(event) =>
              onChange(key, event.target.value as AnimationName)
            }
            className="h-9 w-full rounded-md border border-border bg-background px-2 text-xs"
          >
            {(key === "loop" ? LOOP_OPTIONS : ANIMATION_OPTIONS).map(
              (option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ),
            )}
          </select>
        </div>
      ))}
    </div>
  );
}

export default function RightPropertiesSidebar() {
  const [activeTab, setActiveTab] = useState<"properties" | "animation">(
    "properties",
  );
  const selectedElementId = useEditorStore((state) => state.selectedElementId);
  const element = useEditorStore((state) =>
    state.elements.find((item) => item.id === selectedElementId),
  );
  const updateElement = useEditorStore((state) => state.updateElement);
  const bgColor = useEditorStore((state) => state.bgColor);
  const setBgColor = useEditorStore((state) => state.setBgColor);

  if (!element) {
    return (
      <aside className="flex h-screen w-80 shrink-0 flex-col border-l border-border/40 bg-card/60 backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-border/40 p-4">
          <Sliders className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Properti Canvas
          </h2>
        </div>
        <div className="space-y-4 p-4">
          <p className="text-xs text-muted-foreground">
            Atur tampilan mockup frame sebelum memilih elemen.
          </p>
          <div className="space-y-2">
            <Label>Background mockup frame</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(event) => setBgColor(event.target.value)}
                className="h-9 w-9 cursor-pointer rounded border border-border bg-transparent p-0.5"
              />
              <Input
                value={bgColor}
                onChange={(event) => setBgColor(event.target.value)}
                className="h-9 flex-1 font-mono text-xs uppercase"
              />
            </div>
          </div>
        </div>
      </aside>
    );
  }

  const update = (updates: Parameters<typeof updateElement>[1]) =>
    updateElement(element.id, updates);
  const sliderValue = (value: number | readonly number[]) =>
    Array.isArray(value) ? value[0] : value;
  const isText = element.type === "text";
  const isImage = element.type === "image";
  const isContainer = element.type === "container";
  const setSpacing = (
    kind: "padding" | "margin",
    axis: "all" | "x" | "y" | "top" | "right" | "bottom" | "left",
    value: number,
  ) => {
    const prefix = kind;
    if (axis === "all") {
      update({
        [`${prefix}Top`]: value,
        [`${prefix}Right`]: value,
        [`${prefix}Bottom`]: value,
        [`${prefix}Left`]: value,
      });
    } else if (axis === "x") {
      update({ [`${prefix}Right`]: value, [`${prefix}Left`]: value });
    } else if (axis === "y") {
      update({ [`${prefix}Top`]: value, [`${prefix}Bottom`]: value });
    } else {
      update({ [`${prefix}${axis[0].toUpperCase()}${axis.slice(1)}`]: value });
    }
  };
  const spacingInput = (
    label: string,
    value: number | undefined,
    onChange: (value: number) => void,
  ) => (
    <div className="space-y-1">
      <Label className="text-[11px]">{label}</Label>
      <Input
        type="number"
        min={0}
        value={value ?? 0}
        onChange={(event) => onChange(Math.max(0, Number(event.target.value)))}
        className="h-8 text-xs"
      />
    </div>
  );

  return (
    <aside className="flex h-screen w-80 shrink-0 flex-col border-l border-border/40 bg-card/60 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-border/40 p-4">
        <div className="flex items-center gap-2">
          {isText ? (
            <Type className="h-4 w-4 text-primary" />
          ) : (
            <ImageIcon className="h-4 w-4 text-primary" />
          )}
          <h2 className="text-sm font-semibold text-foreground">
            {isText
              ? "Properti Teks"
              : isImage
                ? "Properti Gambar"
                : "Properti Shape"}
          </h2>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          {element.id}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1 border-b border-border/40 p-2">
        <button
          type="button"
          onClick={() => setActiveTab("properties")}
          className={`rounded-lg px-2 py-1.5 text-[11px] font-medium ${activeTab === "properties" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
        >
          {isContainer
            ? "Container"
            : isText
              ? "Teks"
              : isImage
                ? "Gambar"
                : "Shape"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("animation")}
          className={`rounded-lg px-2 py-1.5 text-[11px] font-medium ${activeTab === "animation" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
        >
          Animasi
        </button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {activeTab === "properties" ? (
          <div className="space-y-5">
            {isText && (
              <>
                <div className="space-y-2">
                  <Label>Isi teks</Label>
                  <Input
                    value={element.content}
                    onChange={(event) =>
                      update({ content: event.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ukuran font: {element.fontSize ?? 20}px</Label>
                  <Slider
                    value={[element.fontSize ?? 20]}
                    onValueChange={(value) =>
                      update({ fontSize: sliderValue(value) })
                    }
                    min={8}
                    max={120}
                    step={1}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label>Warna teks</Label>
                  <input
                    type="color"
                    value={element.color ?? "#fcd34d"}
                    onChange={(event) => update({ color: event.target.value })}
                    className="h-8 w-8 cursor-pointer rounded border border-border"
                  />
                </div>
                <div className="flex gap-2">
                  {(["left", "center", "right"] as const).map((align) => (
                    <button
                      key={align}
                      type="button"
                      onClick={() => update({ textAlign: align })}
                      className={`flex-1 rounded border p-2 text-xs ${element.textAlign === align ? "bg-primary text-primary-foreground" : "border-border"}`}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </>
            )}

            {isImage && (
              <>
                <div className="space-y-2">
                  <Label>Fit gambar</Label>
                  <select
                    value={element.objectFit ?? "cover"}
                    onChange={(event) =>
                      update({
                        objectFit: event.target.value as
                          | "cover"
                          | "contain"
                          | "fill",
                      })
                    }
                    className="h-9 w-full rounded-md border border-border bg-background px-2 text-xs"
                  >
                    <option value="cover">Cover</option>
                    <option value="contain">Contain</option>
                    <option value="fill">Fill</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Radius: {element.borderRadius ?? 0}px</Label>
                  <Slider
                    value={[element.borderRadius ?? 0]}
                    onValueChange={(value) =>
                      update({ borderRadius: sliderValue(value) })
                    }
                    min={0}
                    max={80}
                    step={1}
                  />
                </div>
              </>
            )}

            {isContainer && (
              <div className="space-y-2">
                <Label>Lebar container</Label>
                <select
                  value={element.widthSizeMode ?? "fit"}
                  onChange={(event) =>
                    update({
                      widthSizeMode: event.target.value as ContainerSizeMode,
                    })
                  }
                  className="h-9 w-full rounded-md border border-border bg-background px-2 text-xs"
                >
                  <option value="fit">Fit content</option>
                  <option value="custom">Custom</option>
                  <option value="full">Full parent</option>
                </select>
              </div>
            )}

            {isContainer && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Label className="font-semibold">Display container</Label>
                  <select
                    value={element.display ?? "block"}
                    onChange={(event) =>
                      update({
                        display: event.target.value as
                          | "block"
                          | "flex"
                          | "grid",
                      })
                    }
                    className="h-9 w-full rounded-md border border-border bg-background px-2 text-xs"
                  >
                    <option value="block">Block</option>
                    <option value="flex">Flex</option>
                    <option value="grid">Grid</option>
                  </select>
                  {element.display === "flex" && (
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={element.flexDirection ?? "row"}
                        onChange={(event) =>
                          update({
                            flexDirection: event.target.value as
                              | "row"
                              | "column",
                          })
                        }
                        className="h-8 rounded-md border border-border bg-background px-2 text-xs"
                      >
                        <option value="row">Row</option>
                        <option value="column">Column</option>
                      </select>
                      <select
                        value={element.justifyContent ?? "flex-start"}
                        onChange={(event) =>
                          update({
                            justifyContent: event.target.value as
                              | "flex-start"
                              | "center"
                              | "flex-end"
                              | "space-between"
                              | "space-around"
                              | "space-evenly",
                          })
                        }
                        className="h-8 rounded-md border border-border bg-background px-2 text-xs"
                      >
                        <option value="flex-start">Justify start</option>
                        <option value="center">Justify center</option>
                        <option value="flex-end">Justify end</option>
                        <option value="space-between">Space between</option>
                        <option value="space-around">Space around</option>
                        <option value="space-evenly">Space evenly</option>
                      </select>
                      <select
                        value={element.alignItems ?? "stretch"}
                        onChange={(event) =>
                          update({
                            alignItems: event.target.value as
                              | "flex-start"
                              | "center"
                              | "flex-end"
                              | "stretch",
                          })
                        }
                        className="h-8 rounded-md border border-border bg-background px-2 text-xs"
                      >
                        <option value="stretch">Align stretch</option>
                        <option value="flex-start">Align start</option>
                        <option value="center">Align center</option>
                        <option value="flex-end">Align end</option>
                      </select>
                    </div>
                  )}
                  {element.display === "grid" && (
                    <div className="grid grid-cols-2 gap-2">
                      {spacingInput("Kolom", element.gridColumns, (value) =>
                        update({ gridColumns: Math.max(1, value) }),
                      )}
                      {spacingInput("Baris", element.gridRows, (value) =>
                        update({ gridRows: Math.max(1, value) }),
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Gap antar elemen: {element.gap ?? 0}px</Label>
                  <Input
                    type="number"
                    min={0}
                    value={element.gap ?? 0}
                    onChange={(event) =>
                      update({ gap: Math.max(0, Number(event.target.value)) })
                    }
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="font-semibold">Padding</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {spacingInput("Semua", element.paddingTop, (value) =>
                      setSpacing("padding", "all", value),
                    )}
                    {spacingInput("Sumbu X", element.paddingLeft, (value) =>
                      setSpacing("padding", "x", value),
                    )}
                    {spacingInput("Sumbu Y", element.paddingTop, (value) =>
                      setSpacing("padding", "y", value),
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {spacingInput("Atas", element.paddingTop, (value) =>
                      setSpacing("padding", "top", value),
                    )}
                    {spacingInput("Kanan", element.paddingRight, (value) =>
                      setSpacing("padding", "right", value),
                    )}
                    {spacingInput("Bawah", element.paddingBottom, (value) =>
                      setSpacing("padding", "bottom", value),
                    )}
                    {spacingInput("Kiri", element.paddingLeft, (value) =>
                      setSpacing("padding", "left", value),
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="font-semibold">Margin</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {spacingInput("Semua", element.marginTop, (value) =>
                      setSpacing("margin", "all", value),
                    )}
                    {spacingInput("Sumbu X", element.marginLeft, (value) =>
                      setSpacing("margin", "x", value),
                    )}
                    {spacingInput("Sumbu Y", element.marginTop, (value) =>
                      setSpacing("margin", "y", value),
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {spacingInput("Atas", element.marginTop, (value) =>
                      setSpacing("margin", "top", value),
                    )}
                    {spacingInput("Kanan", element.marginRight, (value) =>
                      setSpacing("margin", "right", value),
                    )}
                    {spacingInput("Bawah", element.marginBottom, (value) =>
                      setSpacing("margin", "bottom", value),
                    )}
                    {spacingInput("Kiri", element.marginLeft, (value) =>
                      setSpacing("margin", "left", value),
                    )}
                  </div>
                </div>
              </>
            )}

            {isContainer && (
              <div className="space-y-2">
                <Label>Tinggi container</Label>
                <select
                  value={element.heightSizeMode ?? "fit"}
                  onChange={(event) =>
                    update({
                      heightSizeMode: event.target.value as ContainerSizeMode,
                    })
                  }
                  className="h-9 w-full rounded-md border border-border bg-background px-2 text-xs"
                >
                  <option value="fit">Fit content</option>
                  <option value="custom">Custom</option>
                  <option value="full">Full parent</option>
                </select>
              </div>
            )}

            <Separator />
            <div className="space-y-2">
              <Label>
                Opacity: {Math.round((element.opacity ?? 1) * 100)}%
              </Label>
              <Slider
                value={[Math.round((element.opacity ?? 1) * 100)]}
                onValueChange={(value) =>
                  update({ opacity: sliderValue(value) / 100 })
                }
                min={0}
                max={100}
                step={1}
              />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Lebar</Label>
                <Input
                  type="number"
                  value={element.width}
                  onChange={(event) =>
                    update({ width: Math.max(1, Number(event.target.value)) })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Tinggi</Label>
                <Input
                  type="number"
                  value={element.height}
                  onChange={(event) =>
                    update({ height: Math.max(1, Number(event.target.value)) })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Posisi X</Label>
                <Input
                  value={element.left}
                  onChange={(event) => update({ left: event.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Posisi Y</Label>
                <Input
                  value={element.top}
                  onChange={(event) => update({ top: event.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Position CSS</Label>
              <select
                value={element.positionMode ?? "relative"}
                onChange={(event) =>
                  update({
                    positionMode: event.target.value as
                      | "relative"
                      | "absolute"
                      | "fixed"
                      | "sticky",
                  })
                }
                className="h-9 w-full rounded-md border border-border bg-background px-2 text-xs"
              >
                <option value="relative">Relative</option>
                <option value="absolute">Absolute</option>
                <option value="fixed">Fixed</option>
                <option value="sticky">Sticky</option>
              </select>
            </div>
          </div>
        ) : (
          <AnimationPanel
            animation={element.animation}
            onChange={(key, value) =>
              updateElement(element.id, {
                animation: {
                  mount: element.animation?.mount ?? "none",
                  unmount: element.animation?.unmount ?? "none",
                  loop: element.animation?.loop ?? "none",
                  [key]: value,
                },
              })
            }
          />
        )}
      </ScrollArea>
    </aside>
  );
}
