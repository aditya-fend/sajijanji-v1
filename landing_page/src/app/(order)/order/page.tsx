import { Suspense } from "react";
import OrderForm from "./order-form";

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <OrderForm />
    </Suspense>
  );
}
