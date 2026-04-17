import { Button } from "@/components/ui/button";

export default function CartSummary({ data }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold ">Order Summary</h2>

      <div className="flex justify-between flex-col gap-2">
        <div className="flex justify-between">
          <span>Number of Items:</span>
          <span>{data?.length || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Total</span>
          <span className="text-sm font-bold">Rs. 100</span>
        </div>
      </div>

      <Button aria-label="Checkout">Checkout</Button>
    </div>
  );
}
