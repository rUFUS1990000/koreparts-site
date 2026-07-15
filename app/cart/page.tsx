"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { TELEGRAM_URL } from "@/lib/constants";
import { formatPrice } from "@/lib/products";

export default function CartPage() {
  const { lines, totalPrice, totalQty, setQty, remove, clear } = useCart();

  return (
    <div className="container-kp py-8 md:py-12">
      <h1 className="mb-2 text-3xl font-bold text-[var(--text-h)]">Корзина</h1>
      <p className="mb-8 text-[var(--text-muted)]">
        Добавление, количество и итог · данные в localStorage
      </p>

      {lines.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="mb-4 text-[var(--text-muted)]">Корзина пуста</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/catalog" className="btn btn-primary">
              Перейти в каталог
            </Link>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-accent">
              ✈️ Заказать в боте
            </a>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            {lines.map(({ product, qty, sum }) => (
              <div
                key={product.id}
                className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-[var(--bg-muted)] sm:h-20 sm:w-28">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/product/${product.id}`}
                    className="font-semibold text-[var(--text-h)] hover:text-[var(--blue-bright)]"
                  >
                    {product.name}
                  </Link>
                  <div className="mt-1 font-mono text-xs text-[var(--text-muted)]">
                    OEM: {product.oem}
                  </div>
                  <div className="mt-1 text-sm text-[var(--blue-bright)]">
                    {formatPrice(product.price)} / шт.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setQty(product.id, qty - 1)}
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-[var(--text-h)]">
                    {qty}
                  </span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setQty(product.id, qty + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[var(--text-h)]">
                    {formatPrice(sum)}
                  </div>
                  <button
                    type="button"
                    className="mt-1 text-xs text-[var(--red-bright)] hover:underline"
                    onClick={() => remove(product.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-ghost btn-sm" onClick={clear}>
              Очистить корзину
            </button>
          </div>

          <aside className="card h-fit space-y-4 p-5 lg:sticky lg:top-24">
            <div className="text-sm text-[var(--text-muted)]">
              Товаров: <b className="text-[var(--text-h)]">{totalQty}</b>
            </div>
            <div className="flex items-end justify-between border-t border-[var(--border)] pt-4">
              <span className="text-[var(--text-muted)]">Итого</span>
              <span className="text-2xl font-bold text-[var(--text-h)]">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <Link href="/checkout" className="btn btn-primary w-full">
              Оформить заказ
            </Link>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent w-full"
            >
              ✈️ Заказать в Telegram
            </a>
            <Link href="/catalog" className="btn btn-ghost w-full">
              Продолжить покупки
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
