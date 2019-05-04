export type CachePolicy =
  | 'cache-first'
  | 'cache-only'
  | 'network-first'
  | 'network-only';

/** Use fetch options shared across all configs. */
export interface BaseUseFetchOptions<D extends string = string, T = any> {
  onMount?: boolean;
  fetchOptions?: RequestInit;
  baseUrl?: string;
  domains: DomainEntry<D>[] | ((data: T) => DomainEntry<D>[]);
}

/** Default useFetch options. */
export interface GeneralUseFetchOptions<D extends string = string, T = any>
  extends BaseUseFetchOptions<D, T> {
  cachePolicy?: Exclude<CachePolicy, 'network-only' | 'cache-only'>;
}

/** useFetch options without domain (for network-only). */
export interface NetworkOnlyUseFetchOptions<T = any>
  extends Omit<BaseUseFetchOptions<string, T>, 'domains'> {
  cachePolicy: 'network-only';
}

/** useFetch options without onMount option (for cache-only). */
export interface CacheOnlyUseFetchOptions<D extends string = string, T = any>
  extends Omit<BaseUseFetchOptions<D, T>, 'onMount'> {
  cachePolicy: 'cache-only';
}

/** Config options for useFetch. */
export type UseFetchOptions<D extends string = string, T = any> =
  | GeneralUseFetchOptions<D, T>
  | NetworkOnlyUseFetchOptions<T>
  | CacheOnlyUseFetchOptions<D, T>;

/** Network information returned from useFetch. */
export interface FetchState<T = any> {
  fetching: boolean;
  data?: T;
  error?: Error;
}

/** useFetch hook response. */
export type UseFetchResponse<T = any> = [FetchState<T>, () => void];

/** Re-export utility type for enforcing domain. */
export type TypedUseFetch<D extends string> = <T>(
  url: string,
  opts: UseFetchOptions<D>
) => UseFetchResponse<T>;

/** Map of domain strings pointing to request keys */
export type DomainMap = Record<string, DomainCache>;

/** Domain scoped cache pointing to dependent fetches */
export type DomainCache = { many: string[]; single: Record<string, string[]> };

/** Map of request keys pointing to data states and refetch values */
export type ResponseMap = Record<string, { data: any; refetch: boolean }>;

/**
 * Tipple provider props.
 *
 * @param baseUrl - Url to prefix all requests (e.g. "https://mydomain.com/api").
 * @param headers - HTTP headers to append to all requests.
 */
export interface ProviderProps {
  baseUrl?: string;
  headers?: RequestInit['headers'];
}

/** Utility type to Omit keys from an interface/object type */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/** A 'single' entry dependency within a domain. */
export type SingleDomainEntry<D extends string = string> = {
  type: 'single';
  domain: D;
  id: number | string;
};

/** A collective entry dependency domain. */
export type ManyDomainEntry<D extends string = string> = {
  type: 'many';
  domain: D;
};

/** A domain dependency entry. */
export type DomainEntry<D extends string = string> =
  | SingleDomainEntry<D>
  | ManyDomainEntry<D>;
