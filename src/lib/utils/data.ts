/**
 * Utility functions for data normalization and safety
 */

/**
 * Normalize mixed string-array fields returned by SQLite / Supabase.
 */
export function parseStringArray(
  value: any,
  options: { allowDelimitedString?: boolean } = {}
): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value !== 'string') {
    return [];
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => String(item).trim())
        .filter(Boolean);
    }
  } catch {
    // Fall through to non-JSON parsing.
  }

  if (options.allowDelimitedString) {
    return trimmed
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [trimmed];
}

/**
 * Ensures that tags_json is always an array.
 */
export function ensureTagsArray(tags: any): string[] {
  return parseStringArray(tags, { allowDelimitedString: true });
}

/**
 * Ensures that images_json is always an array.
 */
export function ensureImagesArray(images: any): string[] {
  return parseStringArray(images);
}
