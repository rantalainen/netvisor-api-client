import { PROPERTY_ORDER, PROPERTY_REFS } from '../generated/property-order';

/**
 * Recursively reorder an object's properties to match the TypeScript interface
 * declaration order. This ensures XML elements are serialized in the correct
 * order expected by the Netvisor API.
 *
 * @param obj The object to reorder
 * @param interfaceName The TypeScript interface name (e.g. 'SalesInvoice')
 * @returns A new object with properties in the correct order
 */
export function reorderProperties(obj: any, interfaceName: string): any {
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => reorderProperties(item, interfaceName));
  }

  const order = PROPERTY_ORDER[interfaceName];
  if (!order) return obj;

  const ordered: any = {};

  for (const key of order) {
    if (!(key in obj)) continue;

    const value = obj[key];
    const childPath = `${interfaceName}.${key}`;

    // Check if this property references a named interface
    const ref = PROPERTY_REFS[childPath];
    if (ref) {
      ordered[key] = reorderWithRef(value, ref);
    } else if (PROPERTY_ORDER[childPath]) {
      // Inline nested object type
      ordered[key] = reorderProperties(value, childPath);
    } else {
      ordered[key] = value;
    }
  }

  // Include any extra properties not in the order map (safety net)
  for (const key of Object.keys(obj)) {
    if (!(key in ordered)) {
      ordered[key] = obj[key];
    }
  }

  return ordered;
}

/**
 * Reorder a value that references one or more named interfaces.
 * For union types (pipe-separated), determine which interface matches
 * by checking the object's keys.
 */
function reorderWithRef(value: any, ref: string): any {
  if (value === null || value === undefined || typeof value !== 'object') return value;

  if (Array.isArray(value)) {
    return value.map((item) => reorderWithRef(item, ref));
  }

  const refNames = ref.split('|');

  if (refNames.length === 1) {
    return reorderProperties(value, refNames[0]);
  }

  // Union type - find the best matching interface
  const objKeys = Object.keys(value);
  let bestMatch = refNames[0];
  let bestScore = -1;

  for (const refName of refNames) {
    const order = PROPERTY_ORDER[refName];
    if (!order) continue;

    // Score by how many of the object's keys appear in this interface
    const score = objKeys.filter((k) => order.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = refName;
    }
  }

  return reorderProperties(value, bestMatch);
}
