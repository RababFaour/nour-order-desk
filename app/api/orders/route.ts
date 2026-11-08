import {
  getOrder,
  createOrder,
  validateOrder,
  listOrders,
  OrderInput,
} from "@/lib/orders";

export async function GET() {
  return Response.json(listOrders());
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { errors, data } = validateOrder(body, true);
  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 400 });
  }

  try {
    const order = createOrder(body as OrderInput); // pushes to orders in lib
    return Response.json(order, { status: 201 });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Invalid order" },
      { status: 400 },
    );
  }
}
