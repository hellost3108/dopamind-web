import Image from "next/image";
import Link from "next/link";

type JournalCard = {
  categoryVi: string;
  titleVi: string;
  introVi: string;
  imageSrc: string;
  imageAlt: string;
  objectPosition: string;
};

/**
 * Homepage editorial teasers only — /nhat-ky has no individual article
 * routes yet, so every card CTA safely points at the journal index rather
 * than an invented article URL. See CLAUDE.md > JOURNAL CARD COPY.
 */
const CARDS: JournalCard[] = [
  {
    categoryVi: "LÀN DA & CẢM XÚC",
    titleVi: "Khi làn da khỏe hơn, bạn rạng rỡ hơn",
    introVi:
      "Một vài phút chăm sóc da, một chút bình yên cho tâm trí — cùng nhìn lại mối liên hệ giữa làn da và cảm xúc.",
    imageSrc: "/images/homepage/collections/C03.png",
    imageAlt: "Làn da rạng rỡ sau nghi thức chăm sóc Dopamind Mask Story",
    objectPosition: "50% 30%",
  },
  {
    categoryVi: "HƯỚNG DẪN",
    titleVi: "5 bước cho trải nghiệm đắp mặt nạ trọn vẹn hơn",
    introVi:
      "Từ làm sạch đến thư giãn — cách biến 15 phút đắp mặt nạ thành một nghi thức trọn vẹn.",
    imageSrc: "/images/homepage/ritual/R01.png",
    imageAlt: "Hướng dẫn đắp mặt nạ Dopamind Mask Story từng bước",
    objectPosition: "38% 20%",
  },
  {
    categoryVi: "LIFESTYLE",
    titleVi: "Sống chậm, đẹp hơn mỗi ngày",
    introVi:
      "Những thói quen nhỏ, lặp lại mỗi ngày, dần trở thành phong cách sống chậm rãi và dịu dàng hơn.",
    imageSrc: "/images/homepage/moments/M01.png",
    imageAlt: "Buổi sáng sống chậm cùng Dopamind Mask Story",
    objectPosition: "65% 20%",
  },
];

export function JournalStories() {
  return (
    <section className="relative bg-cloud-milk py-[clamp(64px,7vw,112px)]">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-[clamp(1.85rem,3.2vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.01em] text-charcoal">
            Những câu chuyện cảm hứng
          </h2>
          <Link
            href="/nhat-ky"
            className="flex min-h-11 items-center text-xs font-medium tracking-[0.14em] text-charcoal underline underline-offset-4 transition-colors hover:text-purple"
          >
            XEM TẤT CẢ →
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:gap-8">
          {CARDS.map((card) => (
            <Link key={card.titleVi} href="/nhat-ky" className="group flex flex-col gap-4">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px]">
                <Image
                  src={card.imageSrc}
                  alt={card.imageAlt}
                  fill
                  sizes="(min-width: 1181px) 30vw, (min-width: 431px) 46vw, 88vw"
                  style={{ objectPosition: card.objectPosition }}
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal/45">
                  {card.categoryVi}
                </span>
                <h3 className="font-serif text-[clamp(1.25rem,1.8vw,1.625rem)] font-medium leading-[1.2] text-charcoal">
                  {card.titleVi}
                </h3>
                <p className="text-sm leading-relaxed text-charcoal/60">{card.introVi}</p>
                <span className="mt-1 inline-flex w-fit items-center text-xs font-medium tracking-[0.12em] text-charcoal underline underline-offset-4 transition-colors group-hover:text-purple">
                  ĐỌC THÊM →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
