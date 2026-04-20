import { Button } from "@/components/ui/button";

export default function CartSummary({ data, onCheckout }) {
  const items = Array.isArray(data) ? data : [];

  const numberOfItems = items.reduce(
    (sum, item) => sum + Number(item?.quantity || 0),
    0,
  );

  const total = items.reduce((sum, item) => {
    const price = Number(item?.price || 0);
    const quantity = Number(item?.quantity || 0);
    return sum + price * quantity;
  }, 0);

  return (
    <div className="sticky top-20 flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="text-xl font-semibold ">Order Summary</h2>
      <p className="text-xs text-gray-500">Summary for checked products only</p>

      <div className="flex justify-between flex-col gap-2">
        <div className="flex justify-between">
          <span>Number of Items:</span>
          <span>{numberOfItems}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Total</span>
          <span className="text-sm font-bold">Rs. {total}</span>
        </div>
      </div>

      <Button
        aria-label="Checkout"
        disabled={numberOfItems === 0}
        onClick={onCheckout}
      >
        Checkout
      </Button>
    </div>
  );
}
