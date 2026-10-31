import Image from "next/image";
import { products } from "@/lib/catalogue";
import { STATUSES } from "@/lib/orders";
import type { Order } from "@/lib/orders";
import { useState } from "react";

type OrderFilter = "All" | Order["status"];

type Props = {

  orders: Order[];
  selectedId: string;
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onStatusChange: (id: string, status: Order["status"]) => void;
  onDelete: (id: string) => void;
};

const filters: OrderFilter[] = ["All", ...STATUSES];///eza all pending prep...

export default function OrderTable({
  orders,
  selectedId,
  onView,
  onEdit,
  onStatusChange,
  onDelete,
}: Props) {
  const [activeFilter, setActiveFilter] = useState<OrderFilter>("All");
  const visibleOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  return (
    <section className="queue-section" id="orders" aria-labelledby="queue-title">
      <div className="queue-heading panel">
        <h2 id="queue-title">
          <span className="queue-icon" aria-hidden="true">▤</span>
          Production Orders Queue
        </h2>
        <div className="filter-tabs" role="group" aria-label="Filter orders by status">
          {filters.map((filter) => {
            const count =
              filter === "All"
                ? orders.length
                : orders.filter((order) => order.status === filter).length;

            return (
              <button
                className={`filter-tab${activeFilter === filter ? " filter-tab-active" : ""}`}
                key={filter}
                type="button"
                aria-pressed={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter} <span>({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="order-list">
        {visibleOrders.length === 0 ? (
          <div className="empty-orders panel">
            <span aria-hidden="true">✦</span>
            <p>{orders.length === 0 ? "Your order queue is ready." : `No ${activeFilter.toLowerCase()} orders right now.`}</p>
            <small>New candle orders will appear here.</small>
          </div>
        ) : (
          visibleOrders.map((order) => {
            const productImage = products.find(
              (product) => product.name === order.productName
            )?.image;

            return (
              <article
                className={`order-card panel${order.id === selectedId ? " order-card-selected" : ""}`}
                key={order.id}
              >
                <div className="candle-thumbnail">
                  {productImage ? (
                    <Image
                      className="candle-product-image"
                      src={productImage}
                      alt={order.productName}
                      fill
                      sizes="(max-width: 640px) 58px, (max-width: 1200px) 68px, 78px"
                    />
                  ) : (
                    <>
                      <span className="candle-art" aria-hidden="true">✦</span>
                      <span className="thumbnail-caption">Candle photo</span>
                    </>
                  )}
                </div>

                <div className="order-description">
                  <div className="customer-line">
                    <h3>{order.customerName}</h3>
                    <span className="phone-chip">{order.phone}</span>
                    <label className={`status-select-wrap status-${order.status.toLowerCase()}`}>
                      <span className="visually-hidden">Order status</span>
                      <select
                        aria-label={`Change status for ${order.customerName}'s order`}
                        value={order.status}
                        onChange={(event) =>
                          onStatusChange(order.id, event.target.value as Order["status"])
                        }
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <p className="product-name">{order.productName}</p>
                  <p className="product-note">
                    <span aria-hidden="true">✧</span>
                    Hand-poured with care · crafted in our atelier
                  </p>
                </div>

                <div className="order-total">
                  <span>Qty: {order.quantity}</span>
                  <strong>${order.total.toFixed(2)}</strong>
                </div>

                <div className="order-actions">
                  <button className="button button-quiet" type="button" onClick={() => onView(order)}>
                    View
                  </button>
                  <button className="button button-quiet" type="button" onClick={() => onEdit(order)}>
                    Edit
                  </button>
                  <button
                    className="button button-danger"
                    type="button"
                    onClick={() => onDelete(order.id)}
                    aria-label={`Delete ${order.customerName}'s order`}
                  >
                    <span aria-hidden="true">⌫</span>
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
