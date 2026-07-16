# Design System & Tokens

> The visual architecture of Ultraship TMS. A premium, Vercel/Stripe-inspired Light Theme designed to manage high data density with absolute clarity.

## 🎨 Color Token Spectrum

Our color palette avoids harsh blacks and pure whites, relying on subtle grays, precise brand colors, and sophisticated surface contrasts to create a modern aesthetic.

| Token Name | Hex Value | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#FAFAFA` | `bg-neutral-50` | The deepest background layer (app body). |
| **Surface Card** | `#FFFFFF` | `bg-white` | Elevated containers, table rows, and panels. |
| **Surface Border** | `#E5E7EB` | `border-gray-200` | Subtle dividers to separate data without noise. |
| **Primary Brand** | `#000000` | `bg-black` | Primary action buttons, high-emphasis branding. |
| **Primary Hover** | `#1F2937` | `hover:bg-gray-800` | Interaction state for primary buttons. |
| **Text Primary** | `#111827` | `text-gray-900` | Main headings and critical data points. |
| **Text Secondary** | `#6B7280` | `text-gray-500` | Metadata, table column headers, helper text. |

## 📝 Typography & Visual Weights

To manage dense tabular data without overwhelming the user, we employ strict typographic hierarchy:

- **Font Family**: Inter (or system-ui for zero-latency loading).
- **Data Grids**: Font sizes are kept slightly smaller (`text-sm` / `14px`) to increase row density.
- **Visual Weight**: We rely on font-weight rather than font-size to establish hierarchy within cells (e.g., `font-medium text-gray-900` for Shipment ID, `font-normal text-gray-500` for timestamps).
- **Tabular Nums**: We enforce `tabular-nums` CSS properties on all currency and tracking number columns to ensure perfect vertical alignment.

## 🏷️ Status Badge Spec Matrix

Shipment statuses require instant visual recognition. Badges use a delicate pastel background paired with a high-contrast text color and a subtle border.

| Status | Background Color | Text Color | Border Color | Tailwind Classes |
| :--- | :--- | :--- | :--- | :--- |
| **`PENDING`** | Gray 100 (`#F3F4F6`) | Gray 700 (`#374151`) | Gray 200 (`#E5E7EB`) | `bg-gray-100 text-gray-700 border-gray-200` |
| **`IN_TRANSIT`** | Blue 50 (`#EFF6FF`) | Blue 700 (`#1D4ED8`) | Blue 200 (`#BFDBFE`) | `bg-blue-50 text-blue-700 border-blue-200` |
| **`DELIVERED`** | Emerald 50 (`#ECFDF5`) | Emerald 700 (`#047857`) | Emerald 200 (`#A7F3D0`) | `bg-emerald-50 text-emerald-700 border-emerald-200` |
| **`EXCEPTION`** | Rose 50 (`#FFF1F2`) | Rose 700 (`#BE123C`) | Rose 200 (`#FECDD3`) | `bg-rose-50 text-rose-700 border-rose-200` |

> [!TIP]
> All badges share a base class setup: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border`.

## ✨ Micro-Interactions Specification

To achieve a premium, app-like feel, we use **Framer Motion** to orchestrate fluid, hardware-accelerated animations.

### 1. Fluid Drawer Spring Dynamics
Slide-out panels (for viewing shipment details) use a carefully tuned physical spring animation rather than linear easings.
- **Config**: `{ type: "spring", damping: 25, stiffness: 200 }`
- **Result**: The drawer slides in rapidly but decelerates smoothly, mimicking physical momentum without feeling sluggish.

### 2. Hardware-Accelerated Layouts
When switching roles in the evaluation sandbox, UI elements that disappear or resize are wrapped in `<AnimatePresence>` and `layout` props. This forces the browser to composite the transition on the GPU, avoiding janky CPU layout recalculations.

### 3. Row Grid Entrance
To prevent a sudden flash of data when loading complex tables, rows cascade into view with a subtle stagger effect.
- **Config**: `initial={{ opacity: 0, y: 10 }}` to `animate={{ opacity: 1, y: 0 }}`
- **Stagger**: Delay children by `0.05s` per row for a natural waterfall effect.
