import Link from "next/link";
import { getAllReviews } from "@/lib/reviews";

function StarRow({ ratingOutOf5 }: { ratingOutOf5: number }) {
  return (
    <div aria-hidden className="flex items-center gap-0.5 text-purple">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="h-3.5 w-3.5"
          fill={i < Math.round(ratingOutOf5) ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.2}
        >
          <path d="M10 1.6l2.6 5.4 5.9.8-4.3 4.2 1 5.9L10 15l-5.2 2.9 1-5.9L1.5 7.8l5.9-.8L10 1.6Z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Renders whatever `getAllReviews()` actually returns. No real DOPAMIND
 * customer reviews have been collected yet, so this is an honest empty
 * state, not placeholder testimonials — see CLAUDE.md > REVIEWS and
 * src/lib/reviews.ts.
 */
export function Reviews() {
  const reviews = getAllReviews();

  return (
    <section className="relative bg-cloud-milk py-[clamp(72px,10vh,144px)]">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-[36rem]">
            <h2 className="text-[clamp(1.75rem,3.4vw,3rem)] font-medium leading-[1.08] tracking-[-0.01em] text-charcoal">
              CẢM GIÁC SAU 15 PHÚT
            </h2>
          </div>

          {reviews.length > 0 && (
            <Link
              href="/danh-gia"
              className="hidden shrink-0 whitespace-nowrap text-xs font-medium tracking-[0.14em] text-charcoal underline underline-offset-4 transition-colors hover:text-purple sm:inline-flex sm:min-h-11 sm:items-center"
            >
              XEM THÊM ĐÁNH GIÁ →
            </Link>
          )}
        </div>

        {reviews.length > 0 ? (
          <>
            <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
              {reviews.map((review) => (
                <figure key={review.id} className="flex flex-col gap-4">
                  <StarRow ratingOutOf5={review.ratingOutOf5} />
                  <blockquote className="text-[1.0625rem] italic leading-relaxed text-charcoal/80">
                    “{review.bodyVi}”
                  </blockquote>
                  <figcaption className="mt-1 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-charcoal/50">
                    <span>{review.authorVi}</span>
                    {review.verifiedPurchase && (
                      <>
                        <span aria-hidden>·</span>
                        <span className="text-purple">ĐÃ MUA HÀNG</span>
                      </>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>

            <Link
              href="/danh-gia"
              className="mt-10 flex min-h-11 w-fit items-center text-xs font-medium tracking-[0.14em] text-charcoal underline underline-offset-4 transition-colors hover:text-purple sm:hidden"
            >
              XEM THÊM ĐÁNH GIÁ →
            </Link>
          </>
        ) : (
          <p className="mt-12 max-w-[34rem] text-sm leading-relaxed text-charcoal/55">
            Những cảm nhận đầu tiên đang được thu thập. DOPAMIND sẽ sớm chia sẻ trải nghiệm
            thực tế từ khách hàng tại đây.
          </p>
        )}
      </div>
    </section>
  );
}
