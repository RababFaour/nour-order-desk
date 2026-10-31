import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/catalogue";

export default function HomePage() {
  return (
    <div className="dashboard-shell">
      <div className="dashboard-backdrop" aria-hidden="true" />
      <header className="dashboard-header">
        <Link className="brand-lockup" href="/" aria-label="Nour Candle Studio home">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span className="brand-name">Nour Candle<br />Studio</span>
        </Link>
        <Link className="button button-primary" href="/dashboard">
          Owner dashboard
        </Link>
      </header>

      <main className="catalogue-main">
        <section className="catalogue-intro">
          <p className="eyebrow">Hand-poured with care</p>
          <h1>Find your signature scent</h1>
          <p>
            Thoughtfully crafted candles for slow evenings, thoughtful gifts,
            and everyday rituals.
          </p>
        </section>

        <section className="collection-grid catalogue-grid" aria-label="Candle products">
          {products.map((product) => (
            <article className="collection-card panel" key={product.name}>
              <div className="collection-photo catalogue-photo">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
                />
              </div>
              <div className="collection-product-details">
                <h2>{product.name}</h2>
                <span>${product.price.toFixed(2)}</span>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
