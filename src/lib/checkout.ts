/**
 * Plain constants shared between the Server Action (app/thanh-toan/actions.ts)
 * and the Client Component (components/checkout/CheckoutForm.tsx). Kept in
 * its own file with no "use server" / "use client" directive because a
 * "use server" file may only export async functions.
 */
export const SHIPPING_FEE = 30000;