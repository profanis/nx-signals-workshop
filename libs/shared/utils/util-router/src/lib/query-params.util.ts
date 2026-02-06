export function serializeObjectToQueryParams<T extends Record<string, any>>(
  filtersState: T,
) {
  const queryParams: Record<string, string | string[] | null> = {};

  // Dynamically serialize all properties of filtersState
  // This approach is future-proof - new properties will automatically be included
  for (const [key, value] of Object.entries(filtersState)) {
    // Handle arrays (keep as arrays for multiple values)
    if (Array.isArray(value)) {
      if (value.length > 0) {
        queryParams[key] = value;
      } else {
        // Empty array means filter was cleared - remove from URL
        queryParams[key] = null;
      }
    } else if (value !== null && value !== undefined) {
      // Handle primitive values (string, number, boolean)
      queryParams[key] = String(value);
    } else {
      // null/undefined means filter was cleared - remove from URL
      queryParams[key] = null;
    }
  }
  return queryParams;
}

export function deserializeQueryParamsToObject<T extends Record<string, any>>(
  queryParams: Record<string, string | string[] | null | undefined>,
  defaultState: T,
): T {
  const result: Record<string, any> = { ...defaultState };

  // Dynamically deserialize all properties based on the default state structure
  for (const [key, defaultValue] of Object.entries(defaultState)) {
    const queryValue = queryParams[key];

    // If query param doesn't exist, keep the default value
    if (queryValue === undefined || queryValue === null) {
      result[key] = defaultValue;
      continue;
    }

    // Handle arrays - check if default value is an array
    if (Array.isArray(defaultValue)) {
      // Query param could be string or string[]
      result[key] = Array.isArray(queryValue) ? queryValue : [queryValue];
    } else if (typeof defaultValue === 'string' || defaultValue === null) {
      // Handle string or nullable string
      result[key] = Array.isArray(queryValue) ? queryValue[0] : queryValue;
    } else {
      // For other types, just convert to string
      result[key] = Array.isArray(queryValue) ? queryValue[0] : queryValue;
    }
  }

  return result as T;
}
