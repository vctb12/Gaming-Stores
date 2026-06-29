"use client";

import type { ListingFormState } from "@/app/admin/listings/actions";
import { ALL_STORE_SOURCES } from "@/lib/db/stores";
import type { ListingAdminRow } from "@/lib/db/listings";
import type { StoreSource } from "@/lib/types";
import { useActionState } from "react";

const sourceLabels: Record<StoreSource, string> = {
  website: "Website",
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  tiktok: "TikTok",
};

interface ListingFormOptions {
  products: {
    id: string;
    name: string;
    slug: string;
    imageEmoji: string | null;
  }[];
  stores: {
    id: string;
    name: string;
    slug: string;
    logoInitials: string;
  }[];
}

interface ListingFormProps {
  action: (
    prev: ListingFormState,
    formData: FormData,
  ) => Promise<ListingFormState>;
  listing?: ListingAdminRow;
  options: ListingFormOptions;
  submitLabel: string;
}

const initialState: ListingFormState = {};
const today = new Date().toISOString().slice(0, 10);

export function ListingForm({
  action,
  listing,
  options,
  submitLabel,
}: ListingFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {state.error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product" required>
          <select
            name="productId"
            required
            defaultValue={listing?.productId}
            className={inputClass}
          >
            <option value="">Select product</option>
            {options.products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.imageEmoji ?? "📦"} {product.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Store" required>
          <select
            name="storeId"
            required
            defaultValue={listing?.storeId}
            className={inputClass}
          >
            <option value="">Select store</option>
            {options.stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.logoInitials} {store.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Price (AED)" required>
          <input
            name="price"
            type="number"
            min={0}
            required
            defaultValue={listing?.price ?? 0}
            className={inputClass}
          />
        </Field>

        <Field label="Shipping (AED)">
          <input
            name="shippingCost"
            type="number"
            min={0}
            defaultValue={listing?.shippingCost ?? 0}
            className={inputClass}
          />
        </Field>

        <Field label="Shipping days">
          <input
            name="shippingDays"
            type="number"
            min={1}
            defaultValue={listing?.shippingDays ?? 1}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Source channel" required>
          <select
            name="source"
            required
            defaultValue={listing?.source ?? "website"}
            className={inputClass}
          >
            {ALL_STORE_SOURCES.map((source) => (
              <option key={source} value={source}>
                {sourceLabels[source]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Warranty (months)">
          <input
            name="warrantyMonths"
            type="number"
            min={0}
            defaultValue={listing?.warrantyMonths ?? 12}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Listing URL">
        <input
          name="url"
          type="url"
          defaultValue={listing?.url}
          className={inputClass}
          placeholder="https://store.example/product-page"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Last updated">
          <input
            name="lastUpdated"
            type="date"
            defaultValue={listing?.lastUpdated ?? today}
            className={inputClass}
          />
        </Field>

        <Field label="Currency">
          <input
            name="currency"
            defaultValue={listing?.currency ?? "AED"}
            className={inputClass}
            readOnly
          />
        </Field>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
        <input
          type="checkbox"
          name="inStock"
          defaultChecked={listing?.inStock ?? true}
          className="accent-violet-500"
        />
        <span className="text-sm text-slate-300">In stock</span>
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-300">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20";
