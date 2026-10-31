"use client";
import { useState } from "react";
import { products } from "@/lib/catalogue";
import type { Order } from "@/lib/orders";

export type FormInput = {
  customerName: string;
  phone: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

type Props = {
  editing: Order | null;
  onSave: (input: FormInput) => Promise<boolean>;
  onCancel: () => void;
};

export default function OrderForm({ editing, onSave, onCancel }: Props) {
  const [customerName, setCustomerName] = useState(editing?.customerName ?? "");
  const [phone, setPhone] = useState(editing?.phone ?? "");
  const [productName, setProductName] = useState(
    editing?.productName ?? products[0].name
  );
  const [quantity, setQuantity] = useState(String(editing?.quantity ?? 1));
  const [unitPrice, setUnitPrice] = useState(
    String(editing?.unitPrice ?? products[0].price)
  );

  function chooseProduct(name: string) {
    setProductName(name);
    const product = products.find((p) => p.name === name);
    if (product) setUnitPrice(String(product.price)); // still editable afterwards
  }

  function resetForm() {
    setCustomerName("");
    setPhone("");
    setProductName(products[0].name);
    setQuantity("1");
    setUnitPrice(String(products[0].price));
  }

  async function submit(e: React.FormEvent) {/////used when there is a form0
    e.preventDefault();///// stops default and reload whole page
    const ok = await onSave({
      customerName,
      phone,
      productName,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
    });
    if (ok && !editing) {
      resetForm();
    }
  }

  return (
    <form className="order-form" onSubmit={submit}>
      <label className="field-group">
        <span>Customer name</span>
        <input
          autoComplete="name"
          placeholder="Enter customer name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
      </label>

      <label className="field-group">
        <span>Phone number</span>
        <input
          autoComplete="tel"
          type="tel"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </label>

      <label className="field-group">
        <span>Product selection</span>
        <select value={productName} onChange={(e) => chooseProduct(e.target.value)}>
          {products.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </label>

      <div className="field-row">
        <label className="field-group">
          <span>Quantity</span>
          <input
            type="number"
            min={1}
            step={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </label>

        <label className="field-group">
          <span>Unit price</span>
          <div className="price-input">
            <span aria-hidden="true">$</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              required
            />
          </div>
        </label>
      </div>

      <div className="form-actions">
        <button className="button button-primary submit-button" type="submit">
          <span aria-hidden="true">✧</span>
          {editing ? "Save changes" : "Add order"}
        </button>
        <button
          className="button button-quiet cancel-button"
          type="button"
          onClick={editing ? onCancel : resetForm}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}