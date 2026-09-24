import type { Metadata } from "next";
import { PageIntro } from "@/components/pages/PageIntro";
import { ResetPasswordForm } from "@/components/account/ResetPasswordForm";

export const metadata: Metadata = { title: "Đặt lại mật khẩu | DOPAMIND" };

export default function ResetPasswordPage() {
  return (
    <>
      <PageIntro
        eyebrow="Tài khoản DOPAMIND"
        title={
          <>
            Đặt lại
            <br />
            <span className="text-purple">mật khẩu.</span>
          </>
        }
        body="Chọn mật khẩu mới cho tài khoản DOPAMIND của bạn."
      />
      <section className="px-[clamp(20px,4vw,64px)] py-[clamp(56px,8vw,120px)]">
        <div className="mx-auto max-w-md bg-lavender/35 p-[clamp(28px,5vw,64px)]">
          <ResetPasswordForm />
        </div>
      </section>
    </>
  );
}
