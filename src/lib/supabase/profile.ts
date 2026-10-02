"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { GENERIC_ERROR_VI } from "@/lib/supabase/errors";

export type ProfileFormState = { error?: string; success?: boolean } | undefined;

export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (fullName.length < 2) return { error: "Vui lòng nhập họ và tên." };
  if (phone && !/^[0-9+()\s-]{8,15}$/.test(phone)) {
    return { error: "Số điện thoại không hợp lệ." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: GENERIC_ERROR_VI };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone: phone || null })
    .eq("id", user.id);

  if (error) return { error: GENERIC_ERROR_VI };

  revalidatePath("/tai-khoan/ho-so");
  revalidatePath("/tai-khoan");
  return { success: true };
}
