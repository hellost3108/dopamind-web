"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { GENERIC_ERROR_VI } from "@/lib/supabase/errors";

export type AddressFormState = { error?: string; success?: boolean } | undefined;

function readAddressInput(formData: FormData) {
  return {
    label: String(formData.get("label") ?? "").trim() || null,
    recipient_name: String(formData.get("recipientName") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    address_line_1: String(formData.get("addressLine1") ?? "").trim(),
    address_line_2: String(formData.get("addressLine2") ?? "").trim() || null,
    ward: String(formData.get("ward") ?? "").trim() || null,
    district: String(formData.get("district") ?? "").trim() || null,
    province: String(formData.get("province") ?? "").trim(),
  };
}

function validateAddressInput(input: ReturnType<typeof readAddressInput>): string | null {
  if (input.recipient_name.length < 2) return "Vui lòng nhập họ tên người nhận.";
  if (!/^[0-9+()\s-]{8,15}$/.test(input.phone)) return "Số điện thoại không hợp lệ.";
  if (input.address_line_1.length < 4) return "Vui lòng nhập địa chỉ chi tiết.";
  if (input.province.length < 2) return "Vui lòng nhập tỉnh / thành phố.";
  return null;
}

export async function createAddressAction(
  _prevState: AddressFormState,
  formData: FormData,
): Promise<AddressFormState> {
  const input = readAddressInput(formData);
  const validationError = validateAddressInput(input);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: GENERIC_ERROR_VI };

  const wantsDefault = formData.get("isDefault") === "on";

  const { count } = await supabase
    .from("addresses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);
  const isFirstAddress = (count ?? 0) === 0;

  const { data: created, error } = await supabase
    .from("addresses")
    .insert({ ...input, user_id: user.id })
    .select("id")
    .single();

  if (error || !created) return { error: GENERIC_ERROR_VI };

  if (wantsDefault || isFirstAddress) {
    await supabase.rpc("set_default_address", { p_address_id: created.id });
  }

  revalidatePath("/tai-khoan/dia-chi");
  return { success: true };
}

export async function updateAddressAction(
  _prevState: AddressFormState,
  formData: FormData,
): Promise<AddressFormState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: GENERIC_ERROR_VI };

  const input = readAddressInput(formData);
  const validationError = validateAddressInput(input);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: GENERIC_ERROR_VI };

  const { error } = await supabase
    .from("addresses")
    .update(input)
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return { error: GENERIC_ERROR_VI };

  if (formData.get("isDefault") === "on") {
    await supabase.rpc("set_default_address", { p_address_id: id });
  }

  revalidatePath("/tai-khoan/dia-chi");
  return { success: true };
}

export async function deleteAddressAction(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: GENERIC_ERROR_VI };

  const { error } = await supabase.from("addresses").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { error: GENERIC_ERROR_VI };

  revalidatePath("/tai-khoan/dia-chi");
  return {};
}

export async function setDefaultAddressAction(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("set_default_address", { p_address_id: id });
  if (error) return { error: GENERIC_ERROR_VI };

  revalidatePath("/tai-khoan/dia-chi");
  return {};
}
