import type { ReactNode } from "react";

export function Overlay({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose?: () => void;
}) {
  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="overlay-card card" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
