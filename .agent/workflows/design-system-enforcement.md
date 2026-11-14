---
description: Audit and enforce visual standards (card rounding, form inputs, button shapes) for LPPM UPNVJ Store
---

# Design System Enforcement Workflow — LPPM UPNVJ Store

This workflow audits code against LPPM Store visual standards and fixes style violations.

---

## STEP 1: SCAN & AUDIT

### 1.1 Card Containers

| Rule          | Standard (LPPM)        | Violation                             |
| ------------- | ---------------------- | ------------------------------------- |
| Border Radius | `rounded-xl`           | `rounded-none`, `rounded-sm`          |
| Borders       | `border border-border` | Missing borders or hardcoded colors   |
| Background    | `bg-card` or `bg-background` | Arbitrary hex backgrounds       |

**Audit Pattern:**
Search for inconsistent container rounding across components.

### 1.2 Form Inputs

| Rule        | Standard                                      | Violation                                      |
| ----------- | --------------------------------------------- | ---------------------------------------------- |
| Text Fields | Shadcn `<Input />` via `<FormField />`        | Raw unstyled `<input>`, missing accessible label |
| Password    | `@/components/ui/password-input` (`<PasswordInput />`) | Inconsistent password field without toggle |
| Form System | `react-hook-form` with `zodResolver`          | Uncontrolled form state or missing validation  |

### 1.3 Buttons

| Rule      | Standard (LPPM)                          | Violation                              |
| --------- | ---------------------------------------- | -------------------------------------- |
| Primary CTA | `rounded-full` (Pill-shaped action button) | Square edges on main checkout/buy CTAs |
| Form/Regular | `rounded-lg` / `rounded-md`             | Inconsistent custom border radiuses    |
| Variant   | Shadcn Button `default`, `outline`, `ghost`, `destructive` | Raw `<button>` without variant styling |

---

## STEP 2: REFACTORING PATTERNS

### 2.1 Card Container Standardization

```tsx
// Compliant LPPM Card
import { Card, CardContent } from "@/components/ui/card";

<Card className="rounded-xl border border-border bg-card shadow-sm">
  <CardContent className="p-6">
    ...
  </CardContent>
</Card>
```

### 2.2 Form Input Compliance

```tsx
// Compliant Form Field in LPPM Store
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

<FormField
  control={form.control}
  name="nama"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Nama Lengkap</FormLabel>
      <FormControl>
        <Input placeholder="Contoh: Budi Santoso" className="h-10 rounded-lg" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### 2.3 Primary CTA Button Compliance

```tsx
// Compliant CTA Button in LPPM Store
import { Button } from "@/components/ui/button";

<Button
  type="submit"
  className="h-12 w-full rounded-full font-semibold text-base transition-all hover:opacity-90 active:scale-95"
>
  Konfirmasi dan Lanjutkan
</Button>
```
