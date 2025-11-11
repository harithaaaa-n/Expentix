import { type Session, type User, type RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { type FieldValues, type FieldPath, type ControllerProps } from "react-hook-form";
import { type infer as ZodInfer } from "zod";
import { type Variants } from "framer-motion";
import { type ThemeProviderProps } from "next-themes";
import { type DialogProps } from "@radix-ui/react-dialog";
import { type UseEmblaCarouselType } from "embla-carousel-react";
import { type LegendProps } from "recharts";

declare module "next-themes" {
  export { ThemeProviderProps };
}
declare module "sonner";
declare module "@radix-ui/react-tooltip";
declare module "@radix-ui/react-slot";
declare module "@radix-ui/react-dialog" {
  export { DialogProps };
}
declare module "@radix-ui/react-avatar";
declare module "@radix-ui/react-progress";
declare module "@radix-ui/react-separator";
declare module "@radix-ui/react-label";
declare module "@radix-ui/react-select";
declare module "@radix-ui/react-popover";
declare module "@radix-ui/react-toggle";
declare module "@radix-ui/react-toggle-group";
declare module "@radix-ui/react-alert-dialog";
declare module "@radix-ui/react-tabs";
declare module "@radix-ui/react-accordion";
declare module "@radix-ui/react-aspect-ratio";
declare module "@radix-ui/react-checkbox";
declare module "@radix-ui/react-collapsible";
declare module "@radix-ui/react-context-menu";
declare module "@radix-ui/react-dropdown-menu";
declare module "@radix-ui/react-hover-card";
declare module "@radix-ui/react-menubar";
declare module "@radix-ui/react-navigation-menu";
declare module "@radix-ui/react-radio-group";
declare module "@radix-ui/react-scroll-area";
declare module "@radix-ui/react-slider";
declare module "@radix-ui/react-switch";
declare module "@supabase/supabase-js" {
  export { Session, User, RealtimePostgresChangesPayload };
}
declare module "framer-motion" {
  export { Variants };
}
declare module "react-lottie-player";
declare module "date-fns";
declare module "zod" {
  export { ZodInfer as infer };
}
declare module "react-hook-form" {
  export { FieldValues, FieldPath, ControllerProps };
}
declare module "@hookform/resolvers/zod";
declare module "uuid";
declare module "jspdf";
declare module "jspdf-autotable";
declare module "recharts" {
  export { LegendProps };
}
declare module "react-day-picker";
declare module "cmdk";
declare module "vaul";
declare module "input-otp";
declare module "react-resizable-panels";
declare module "embla-carousel-react" {
  export { UseEmblaCarouselType };
}
declare module "react-dom/client";