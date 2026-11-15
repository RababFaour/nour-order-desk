import {
  getOrder,
  validateOrder,
  updateOrder,
  deleteOrder,
} from "@/lib/orders";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET
export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params; /// hon hattet parameters laen bade she m3ayan mn l server yaani mmkn ekhd she by searching aa title masalan
  const order = getOrder(id);

  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }
  return Response.json(order);
}

//PATCH
export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Malformed JSON" }, { status: 400 });
  }

  const order = getOrder(id);
  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }
  const { errors, data } = validateOrder(body, false);
  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 400 });
  }
  const updated = updateOrder(id, data);
  if (updated === undefined) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }
  if (updated === null) {
    return Response.json({ error: "Invalid product name" }, { status: 400 });
  }
  return Response.json(updated);
}

//DELETE
export async function DELETE(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const removed = deleteOrder(id);
  if (!removed) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }
  return new Response(null, { status: 204 });
}
