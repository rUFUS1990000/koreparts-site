import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogClient } from "@/components/CatalogClient";

export const metadata: Metadata = {
  title: "Каталог запчастей",
  description:
    "Каталог запчастей Kia, Hyundai, Genesis с фильтрами по бренду, модели, категории и цене.",
  openGraph: {
    title: "Каталог KoreParts",
    description: "Фильтры, тормоза, подвеска, масла и другие запчасти для корейских авто.",
  },
};

export default function CatalogPage() {
  return (
    <div className="container-kp py-8 md:py-12">
      <Suspense
        fallback={
          <div className="card p-10 text-center text-[var(--text-muted)]">
            Загрузка каталога…
          </div>
        }
      >
        <CatalogClient />
      </Suspense>
    </div>
  );
}
