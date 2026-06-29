"use client";

import { ALL_STORE_SOURCES } from "@/lib/db/stores";
import { slugify } from "@/lib/slug";
import type { Store, StoreSource } from "@/lib/types";
import { useActionState, useState } from "react";
import type { StoreFormState } from "@/app/admin/stores/actions";

const sourceLabels: Record<StoreSource, string> = {
  website: "Website",
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  tiktok: "TikTok",
};

interface StoreFormProps {
  action: (
    prev: StoreFormState,
    formData: FormData,
  ) => Promise<StoreFormState>;
  store?: Store;
  submitLabel: string;
}

const initialState: StoreFormState = {};

export function StoreForm({ action, store, submitLabel }: StoreFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [name, setName] = useState(store?.name ?? "");
  const [slug, setSlug] = useState(store?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(store?.slug));

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {state.error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Store name" required>
          <input
            name="name"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={inputClass}
            placeholder="GearUp UAE"
          />
        </Field>

        <Field label="Slug" required>
          <input
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={inputClass}
            placeholder="gearup-uae"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Website">
          <input
            name="website"
            type="url"
            defaultValue={store?.website}
            className={inputClass}
            placeholder="https://example.com"
          />
        </Field>

        <Field label="Location">
          <input
            name="location"
            defaultValue={store?.location}
            className={inputClass}
            placeholder="Dubai"
          />
        </Field>
      </div>

      <Field label="Logo initials" hint="2 letters shown in listing cards">
        <input
          name="logoInitials"
          maxLength={2}
          defaultValue={store?.logoInitials}
          className={`${inputClass} max-w-[120px] uppercase`}
          placeholder="GU"
        />
      </Field>

      <Field label="Price sources" required>
        <div className="flex flex-wrap gap-3">
          {ALL_STORE_SOURCES.map((source) => (
            <label
              key={source}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                name="sources"
                value={source}
                defaultChecked={store?.sources.includes(source)}
                className="accent-violet-500"
              />
              {sourceLabels[source]}
            </label>
          ))}
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Rating (0–5)">
          <input
            name="rating"
            type="number"
            min={0}
            max={5}
            step={0.1}
            defaultValue={store?.rating ?? 0}
            className={inputClass}
          />
        </Field>

        <Field label="Review count">
          <input
            name="reviewCount"
            type="number"
            min={0}
            defaultValue={store?.reviewCount ?? 0}
            className={inputClass}
          />
        </Field>

        <Field label="Default warranty (months)">
          <input
            name="warrantyMonths"
            type="number"
            min={0}
            defaultValue={store?.warrantyMonths ?? 12}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Warranty description" required>
        <textarea
          name="warrantyDescription"
          required
          rows={3}
          defaultValue={store?.warrantyDescription}
          className={inputClass}
          placeholder="2-year manufacturer warranty with local RMA support"
        />
      </Field>

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
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-300">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </span>
      {hint && <span className="mt-0.5 block text-xs text-slate-500">{hint}</span>}
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20";
