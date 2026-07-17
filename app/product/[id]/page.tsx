import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { CategoryIcon } from "@/components/CategoryIcons";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ProductCard } from "@/components/ProductCard";
import { telegramProductUrl } from "@/lib/constants";
import {
  brandTitle,
  CATEGORIES,
  formatPrice,
  getProduct,
  modelTitle,
  PRODUCTS,
} from "@/lib/products";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) return { title: "Товар не найден" };
  const title = `${p.name} — ${brandTitle(p.brand)} ${modelTitle(p.brand, p.model)}`;
  return {
    title,
    description: `${p.name}. OEM ${p.oem}. ${p.desc} Цена ${formatPrice(p.price)}. Купить в KoreParts.`,
    openGraph: {
      title,
      description: p.desc,
      images: [{ url: p.image, alt: p.name }],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const related = PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      (p.model === product.model || p.category === product.category),
  ).slice(0, 4);

  const cat = CATEGORIES[product.category];
  const gallery = [product.image, product.image, product.image];

  const specs = [
    { k: "Бренд", v: brandTitle(product.brand) },
    { k: "Модель", v: modelTitle(product.brand, product.model) },
    { k: "Категория", v: cat?.title ?? product.category },
    { k: "Артикул OEM", v: product.oem },
    { k: "Цена", v: formatPrice(product.price) },
    {
      k: "Наличие",
      v:
        product.stock > 5
          ? `В наличии (${product.stock} шт.)`
          : product.stock > 0
            ? `Мало (${product.stock} шт.)`
            : "Нет в наличии",
    },
    { k: "Совместимость", v: `${brandTitle(product.brand)} ${modelTitle(product.brand, product.model)}` },
    { k: "Доставка", v: "По России · ТК / ПВЗ" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.desc,
    sku: product.oem,
    mpn: product.oem,
    image: product.image,
    brand: { "@type": "Brand", name: brandTitle(product.brand) },
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container-kp py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--blue-bright)]">
          Главная
        </Link>
        {" / "}
        <Link href="/catalog" className="hover:text-[var(--blue-bright)]">
          Каталог
        </Link>
        {" / "}
        <span className="text-[var(--text-h)]">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-3">
          <div className="card relative aspect-square overflow-hidden bg-[var(--bg-muted)] md:aspect-[4/3]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition duration-700 hover:scale-105"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {product.popular && (
              <span className="badge badge-red absolute left-4 top-4">Хит продаж</span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {gallery.map((src, i) => (
              <div
                key={i}
                className="relative aspect-video overflow-hidden rounded-xl ring-1 ring-[var(--border)]"
              >
                <Image
                  src={src}
                  alt={`${product.name} фото ${i + 1}`}
                  fill
                  className={`object-cover ${i === 1 ? "scale-110" : i === 2 ? "scale-125 grayscale-[0.2]" : ""}`}
                  sizes="120px"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <Link
            href={`/catalog?category=${product.category}`}
            className="badge inline-flex items-center gap-1.5"
          >
            <CategoryIcon id={product.category} size={16} />
            {cat?.title}
          </Link>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[var(--text-h)] md:text-4xl">
            {product.name}
          </h1>
          <p className="text-lg text-[var(--text)]">
            {brandTitle(product.brand)}{" "}
            {modelTitle(product.brand, product.model)}
          </p>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3.5 font-mono text-sm text-[var(--blue-bright)]">
            Артикул OEM: <b className="text-[var(--text-h)]">{product.oem}</b>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <div className="text-4xl font-black tracking-tight text-[var(--text-h)]">
              {formatPrice(product.price)}
            </div>
            {product.popular && (
              <span className="mb-1 text-sm text-[var(--red-bright)]">
                − популярная позиция
              </span>
            )}
          </div>
          <p className="leading-relaxed text-[var(--text)]">{product.desc}</p>
          <p className="text-sm">
            {product.stock > 5 ? (
              <span className="text-[var(--success)]">
                ✅ В наличии · {product.stock} шт.
              </span>
            ) : product.stock > 0 ? (
              <span className="text-[var(--red-bright)]">
                ⚠️ Осталось мало · {product.stock} шт.
              </span>
            ) : (
              <span className="text-[var(--text-muted)]">❌ Нет в наличии</span>
            )}
          </p>
          <div className="flex flex-wrap gap-3 border-t border-[var(--border)] pt-5">
            <AddToCartButton
              productId={product.id}
              disabled={product.stock <= 0}
              className="btn btn-primary"
            />
            <FavoriteButton productId={product.id} />
            <Link href="/cart" className="btn btn-ghost">
              Корзина
            </Link>
            <Link href="/checkout" className="btn btn-ghost">
              Оформить
            </Link>
            <a
              href={telegramProductUrl(product.oem, product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent"
            >
              ✈️ Спросить в боте
            </a>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-[var(--border)] px-4 py-3 text-sm font-bold uppercase tracking-wider text-[var(--text-h)]">
              Характеристики
            </div>
            <dl className="divide-y divide-[var(--border)]">
              {specs.map((s) => (
                <div
                  key={s.k}
                  className="grid grid-cols-2 gap-2 px-4 py-2.5 text-sm"
                >
                  <dt className="text-[var(--text-muted)]">{s.k}</dt>
                  <dd className="font-semibold text-[var(--text-h)]">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid gap-2 text-sm text-[var(--text-muted)] sm:grid-cols-2">
            <div className="rounded-xl bg-[var(--bg-muted)]/50 p-3 ring-1 ring-[var(--border)]">
              🚚 Доставка 2–7 дней по РФ
            </div>
            <div className="rounded-xl bg-[var(--bg-muted)]/50 p-3 ring-1 ring-[var(--border)]">
              🔧 Подбор по VIN на сайте и в боте
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 section-title">Похожие товары</h2>
          <div className="grid-products">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
