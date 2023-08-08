/// <reference types="vite/client" />

declare module 'jq-web' {
	export function json(obj: Record<symbol, unknown>, filter: string);
}
