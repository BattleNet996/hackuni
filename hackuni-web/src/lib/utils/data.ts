/**
 * Utility functions for data normalization and safety
 */

/**
 * Ensures that tags_json is always an array
 * Handles cases where tags might be:
 * - Already an array
 * - A JSON string that needs parsing
 * - Undefined or null
 */
export function ensureTagsArray(tags: any): string[] {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Ensures that images_json is always an array
 */
export function ensureImagesArray(images: any): string[] {
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}
