export function hydrateSystem(row) {
  if (!row) return null;
  return {
    ...row,
    features: typeof row.features === 'string' ? JSON.parse(row.features) : (row.features || []),
    is_active: Boolean(row.is_active),
  };
}

export function hydrateSystems(rows) {
  return rows.map(hydrateSystem);
}
