export interface HTTP {
  get: <Data>(path: string, options?: { abortSignal?: AbortSignal }) => Promise<Data>
}