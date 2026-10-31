"use client";
import Link from "next/link";

import { useState, useEffect } from "react";
import Image from "next/image";
import { products } from "@/lib/catalogue";
import type { Order } from "@/lib/orders";
import type { FormInput } from "./OrderForm";
import OrderForm from "./OrderForm";
import OrdersTable from "./OrderTable";

const headers = { "Content-Type": "application/json" };

async function errorFrom(response: Response, fallback: string) {
  const data = await response.json().catch(() => null);
  if (data?.error) return data.error as string;
  if (data?.errors) return Object.values(data.errors)[0] as string;
  return fallback;
}

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [editing, setEditing] = useState<Order | null>(null);
  const [message, setMessage] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingId, setPendingId] = useState("");

  const selected = orders.find((order) => order.id === selectedId);
  const count = (status: Order["status"]) =>
    orders.filter((order) => order.status === status).length;

  /// mnaaml load lal orders
  async function loadOrders() {
  try {
    const response = await fetch("/api/orders", { cache: "no-store" });
    if (!response.ok) throw new Error();
    setOrders(await response.json());
    setLoadError("");
  } catch {
    setLoadError("Could not load the orders.");
  }
}

  useEffect(() => {
  fetch("/api/orders", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error();
      return response.json();
    })
    .then((data) => setOrders(data))
    .catch(() => setLoadError("Could not load the orders."))
    .finally(() => setLoading(false));
}, []);

  async function save(input: FormInput): Promise<boolean> {
  setSaving(true);
  setFormError("");
  await new Promise((resolve) => setTimeout(resolve, 2000)); // temporary delay
  try {
    const response = await fetch(
      editing ? `/api/orders/${editing.id}` : "/api/orders",
      {
        method: editing ? "PATCH" : "POST",
        headers,
        body: JSON.stringify(input),/// convert js obj into json string
      }
    );
    if (!response.ok) {
      setFormError(await errorFrom(response, "Could not save the order."));
      return false;
    }
    const saved: Order = await response.json();
    setMessage(editing ? "Order updated" : "Order added");
    setSelectedId(saved.id);
    setEditing(null);
    await loadOrders();
    return true;
  } catch {
    setFormError("Can't reach the server. Try again.");
    return false;
  } finally {
    setSaving(false);
  }
}
  async function changeStatus(id: string, status: Order["status"]) {
  setPendingId(id);
  try {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setMessage(await errorFrom(res, "Could not change the status"));
    } else {
      setMessage("Status updated");
    }
    await loadOrders();
  } catch {
    setMessage("Can't reach the server. Try again.");
  } finally {
    setPendingId("");
  }
}

  async function remove(id: string) {
  if (!confirm("Delete this order?")) return;
  setPendingId(id);
  try {
    const response = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setMessage(await errorFrom(response, "Could not delete the order"));
    } else {
      setMessage("Order deleted");
      if (selectedId === id) setSelectedId("");
      if (editing?.id === id) setEditing(null);
    }
    await loadOrders();
  } catch {
    setMessage("Can't reach the server. Try again.");
  } finally {
    setPendingId("");
  }
}

  async function retry() {
  setLoading(true);
  setLoadError("");
  await loadOrders();
  setLoading(false);
}

  return (
    <div className="dashboard-shell">
      <div className="dashboard-backdrop" aria-hidden="true" />

      <header className="dashboard-header">
        <a className="brand-lockup" href="#overview" aria-label="Nour Candle Studio dashboard">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span className="brand-name">Nour Candle<br />Studio</span>
        </a>

        <nav className="dashboard-nav" aria-label="Dashboard navigation">
           <Link className="nav-link nav-link-active" href="/">
                ← Back
              </Link>
          <a className="nav-link nav-link-active" href="#overview">
            <span className="nav-dot" aria-hidden="true" />
            Dashboard
          </a>
          <a className="nav-link" href="#orders">
            Orders <span className="nav-count">{loading ? "..." :orders.length}</span>
          </a>
        </nav>

        <div className="atelier-status">
          <span className="status-light" aria-hidden="true" />
          Active
        </div>
      </header>

      <main className="dashboard-main" id="overview">
        <section className="metrics-grid" aria-label="Order summary">
          <article className="metric-card metric-total">
            <span className="metric-icon" aria-hidden="true">▤</span>
            <p className="metric-label">Total<br />orders</p>
            <p className="metric-value">{loading ? "..." :orders.length}</p>
            <p className="metric-note">Active production &amp; dispatch cycles</p>
          </article>
          <article className="metric-card metric-pending">
            <span className="metric-icon" aria-hidden="true">◷</span>
            <p className="metric-label">Pending<br />orders</p>
            <p className="metric-value">{loading ? "..." :count("Pending")}</p>
            <p className="metric-note">Awaiting wick sizing &amp; pour queue</p>
          </article>
          <article className="metric-card metric-preparing">
            <span className="metric-icon" aria-hidden="true">♜</span>
            <p className="metric-label">Preparing /<br />curing</p>
            <p className="metric-value">{loading ? "..." :count("Preparing")}</p>
            <p className="metric-note">Currently cooling in the atelier</p>
          </article>
          <article className="metric-card metric-delivered">
            <span className="metric-icon" aria-hidden="true">✓</span>
            <p className="metric-label">Delivered</p>
            <p className="metric-value">{loading ? "..." :count("Delivered")}</p>
            <p className="metric-note">Delivered to retail &amp; clients</p>
          </article>
        </section>

        <section className="product-collection" aria-labelledby="product-collection-title">
          <div className="collection-heading">
            <div>
              <p className="eyebrow">Hand-poured in the atelier</p>
              <h2 id="product-collection-title">Our candle collection</h2>
            </div>
            <span className="collection-count">{products.length} signature scents</span>
          </div>
          <div className="collection-grid">
            {products.map((product) => (
              <article className="collection-card panel" key={product.name}>
                <div className="collection-photo">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 900px) 33vw, 25vw"
                  />
                </div>
                <div className="collection-product-details">
                  <h3>{product.name}</h3>
                  <span>${product.price.toFixed(2)}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {loading && (
            <p className="dashboard-message" role="status" aria-live="polite">
              Loading orders…
            </p>
          )}

        {message && (
          <p className="dashboard-message" role="status" aria-live="polite">
            {message}
          </p>
        )}

        {loadError && (
  <p className="dashboard-message" role="alert">
    {loadError}{" "}
    <button type="button" onClick={retry}>Retry</button>
  </p>
)}

{formError && (
  <p className="dashboard-message" role="alert">
    {formError}
  </p>
)}

{saving && (
  <p className="dashboard-message" role="status" aria-live="polite">
    Saving the order…
  </p>
)}

{pendingId && (
  <p className="dashboard-message" role="status" aria-live="polite">
    Updating the order…
  </p>
)}

        <div className="workspace-grid">
          <section className="form-panel panel">
            <div className="panel-heading form-heading">
              <div>
                <h1><span className="heading-spark" aria-hidden="true">✧</span>{editing ? "Edit Candle Order" : "New Candle Order"}</h1>
                <p>Pouring atelier requisition ticket</p>
              </div>
              <span className="form-seal" aria-hidden="true">✦</span>
            </div>
            <OrderForm
              key={editing?.id ?? "new"}
              editing={editing}
              onSave={save}
              onCancel={() => setEditing(null)}
            />
          </section>

          <OrdersTable
            orders={orders}
            selectedId={selectedId}
            onView={(order) => setSelectedId(order.id)}
            onEdit={setEditing}
            onStatusChange={changeStatus}
            onDelete={remove}
          />
        </div>

        {selected && (
          <section className="details-panel panel" aria-labelledby="details-title">
            <div className="details-emblem" aria-hidden="true">✿</div>
            <div className="details-content">
              <div className="details-title-row">
                <div>
                  <p className="eyebrow">Selected order</p>
                  <h2 id="details-title">Order details · {selected.customerName}</h2>
                </div>
                <span className={`detail-status status-${selected.status.toLowerCase()}`}>
                  {selected.status}
                </span>
              </div>
              <div className="details-grid">
                <p><span>Order ID</span><strong>#{selected.id.slice(0, 8).toUpperCase()}</strong></p>
                <p><span>Phone number</span><strong>{selected.phone}</strong></p>
                <p><span>Candle</span><strong>{selected.productName}</strong></p>
                <p><span>Quantity</span><strong>{selected.quantity}</strong></p>
                <p><span>Unit price</span><strong>${selected.unitPrice.toFixed(2)}</strong></p>
                <p className="details-total"><span>Order total</span><strong>${selected.total.toFixed(2)}</strong></p>
              </div>
            </div>
            <button
              className="icon-button details-close"
              type="button"
              onClick={() => setSelectedId("")}
              aria-label="Close order details"
            >
              ×
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
