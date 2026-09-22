import type { InputHTMLAttributes } from "react"

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
}

export function TextField({ label, error, id, ...props }: TextFieldProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-cloud-700">
                {label}
            </label>
            <input
                id={id}
                className="mt-1.5 w-full rounded-lg border border-cloud-200 bg-white px-3.5 py-2.5 text-sm text-cloud-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50"
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    )
}