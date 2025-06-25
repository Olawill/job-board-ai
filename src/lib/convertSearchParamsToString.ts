export const convertSearchParamsToString = (
  searchParams: Record<string, string | string[]>
) => {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([Key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(Key, v));
    } else {
      params.set(Key, value);
    }
  });
  return params.toString();
};
