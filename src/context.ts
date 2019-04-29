import { createContext } from 'react';
import { DomainMap, ResponseMap, DomainEntry } from './types';

export interface AddResponseArgs<D extends string = string> {
  key: string;
  domains: DomainEntry<D>[];
  data: any;
}

export interface ContextConfig {
  baseUrl?: string;
  headers?: RequestInit['headers'];
}

export interface TippleContext<D extends string = string> {
  config: ContextConfig;
  domains: DomainMap;
  responses: ResponseMap;
  addResponse: (args: AddResponseArgs<D>) => void;
  clearDomains: (domain: DomainEntry[]) => void;
}

export const TippleContext = createContext<TippleContext>(null as any);
