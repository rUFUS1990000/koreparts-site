import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-kp py-20 text-center">
      <h1 className="text-4xl font-bold text-[var(--text-h)]">404</h1>
      <p className="mt-3 text-[var(--text-muted)]">Страница не найдена</p>
      <Link href="/" className="btn btn-primary mt-6">
        На главную
      </Link>
    </div>
  );
}
