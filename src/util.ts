import { SingleDomainEntry, ManyDomainEntry } from './types';

/** Gets unique key of request. */
export const getKey = (url: string, fetchArgs: RequestInit) =>
  `${url}+${fetchArgs.body !== undefined ? fetchArgs.body : ''}`;

/** Executes API call and throws when response is invalid. */
export const executeRequest = async (url: string, fetchArgs: RequestInit) => {
  const response = await fetch(url, fetchArgs);
  const json = await response.json();

  if (!response.ok) {
    throw json;
  }

  return json;
};

export const single = <D extends string>(
  domain: D,
  id: string | number
): SingleDomainEntry<D> => ({ type: 'single', domain, id });

export const many = <D extends string>(domain: D): ManyDomainEntry<D> => ({
  type: 'many',
  domain,
});
