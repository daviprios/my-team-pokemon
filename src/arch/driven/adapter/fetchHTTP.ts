import { HTTP } from '../port/HTTP'

export const fetchHTTP: HTTP = {
	get: async <Data>(path: string, options?: { abortSignal?: AbortSignal }): Promise<Data> => {
		const res = await fetch(path, { signal: options?.abortSignal })
		return await res.json() as Data
	}
}