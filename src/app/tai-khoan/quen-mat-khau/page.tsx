import type { Metadata } from "next";
import { PageIntro } from "@/components/pages/PageIntro";
import { ForgotPasswordForm } from "@/components/account/ForgotPasswordForm";

export const metadata: Metadata = { title: "Quên mật khẩu | DOPAMIND" };

export default function ForgotPasswordPage() {
  return (
    <>
      <PageIntro
        eyebrow="Tài khoản DOPAMIND"
        title={
          <>
            Quên
            <br />
            <span className="text-purple">mật khẩu.</span>
          </>
        }
        body="Nhập email của bạn, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu."
      />
      <section className="px-[clamp(20px,4vw,64px)] py-[clamp(56px,8vw,120px)]">
        <div className="mx-auto max-w-md bg-lavender/35 p-[clamp(28px,5vw,64px)]">
          <ForgotPasswordForm />
        </div>
      </section>
    </>
  );
}
