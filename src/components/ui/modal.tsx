"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Modal({ open, onClose, title, description, children, wide = false, locked = false }: { open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode; wide?: boolean; locked?: boolean }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-black/55 p-3 sm:p-6" onMouseDown={() => !locked && onClose()}>
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className={`my-auto max-h-[92vh] w-full overflow-y-auto rounded-2xl bg-background shadow-2xl ${wide ? "max-w-5xl" : "max-w-lg"}`} onMouseDown={(event) => event.stopPropagation()}>
      <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b bg-background p-5"><div><h2 id="modal-title" className="text-lg font-semibold">{title}</h2>{description ? <p className="text-sm text-muted-foreground">{description}</p> : null}</div>{locked ? null : <Button type="button" variant="ghost" size="icon-sm" onClick={onClose} aria-label="ปิด"><X /></Button>}</div>
      <div className="p-5">{children}</div>
    </div>
  </div>;
}
