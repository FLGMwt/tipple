import React, { FC, useState, useMemo, Dispatch, SetStateAction } from 'react';
import { TippleContext } from './context';
import { ProviderProps, DomainMap, ResponseMap } from './types';

/** Provider for using tipple. */
export const Provider: FC<ProviderProps> = ({ baseUrl, headers, children }) => {
  const [domains, setDomains] = useState<DomainMap>({});
  const [responses, setResponses] = useState<ResponseMap>({});

  const addResponse = useMemo(
    () => createAddResponse(setDomains, setResponses),
    []
  );

  const clearDomains = useMemo(
    () => createClearDomains(domains, setResponses),
    [domains]
  );

  const config = { baseUrl, headers };

  return (
    <TippleContext.Provider
      value={{ config, domains, responses, addResponse, clearDomains }}
    >
      {children}
    </TippleContext.Provider>
  );
};

/** Logic for adding a response. */
export const createAddResponse = (
  setDomains: Dispatch<SetStateAction<DomainMap>>,
  setResponses: Dispatch<SetStateAction<ResponseMap>>
): TippleContext['addResponse'] => ({ key, domains, data }) => {
  // Update domain dependents
  domains.forEach(entry =>
    setDomains(domainsState => {
      const entryDomain =
        domainsState[entry.domain] === undefined
          ? { many: [], single: {} }
          : domainsState[entry.domain];

      // Add key to many collection
      if (entry.type === 'many') {
        return {
          ...domainsState,
          [entry.domain]: {
            ...entryDomain,
            many: [...entryDomain.many, key],
          },
        };
      }

      // Add key to entry collection
      return {
        ...domainsState,
        [entry.domain]: {
          ...entryDomain,
          single: {
            ...entryDomain.single,
            [entry.id]:
              entryDomain.single[entry.id] === undefined
                ? [key]
                : [...entryDomain.single[entry.id], key],
          },
        },
      };
    })
  );

  // Update cache with new data
  setResponses(responses => ({
    ...responses,
    [key]: { refetch: false, data },
  }));
};

/** Logic for clearing domains. */
export const createClearDomains = (
  domains: DomainMap,
  setResponses: Dispatch<SetStateAction<ResponseMap>>
): TippleContext['clearDomains'] => domainEntries =>
  domainEntries.forEach(entry => {
    const localDomain = domains[entry.domain];
    const targets =
      entry.type === 'many'
        ? // All keys (many and single) in domain
          [
            ...localDomain.many,
            ...Object.values(localDomain.single).reduce(
              (prevKeys, keys) => [...prevKeys, ...keys],
              []
            ),
          ]
        : // Single key in domain
          localDomain.single[entry.id] || [];

    // Flag dependents for refetch
    setResponses(responses =>
      targets.reduce(
        (p, t) => ({ ...p, [t]: { refetch: true, data: p[t].data } }),
        responses
      )
    );
  });
