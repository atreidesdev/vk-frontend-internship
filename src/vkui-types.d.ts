import type React from "react";

declare module "react" {
  interface DOMAttributes<T> {
    onPointerEnterCapture?: React.PointerEventHandler<T>;
    onPointerLeaveCapture?: React.PointerEventHandler<T>;
    placeholder?: string;
  }
}
