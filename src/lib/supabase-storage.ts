import { getSupabaseUrl } from "@/lib/supabase-env";

/** Public Storage bucket that holds product images. */
const PRODUCT_IMAGE_BUCKET = "product-imagess";

/** Public URL for a product image given its `product_media.storage_path`. */
export function getProductImageUrl(storagePath: string): string {
  return `${getSupabaseUrl()}/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/${storagePath}`;
}
