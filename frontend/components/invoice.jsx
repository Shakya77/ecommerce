import { formatCurrency } from "@/lib/currency";
import formatDate from "@/lib/date";
import { toWords } from "to-words";

export default function Invoice({ data }) {
  return (
    <div className="  flex items-center justify-center ">
      <div className="w-full max-w-4xl    border p-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">INVOICE</h1>
            <p className="text-sm text-gray-500 mt-1">#{data.id}</p>
          </div>

          <div className="text-right text-sm text-gray-600">
            <p className="font-semibold text-gray-800">Ecommerce Store</p>
            <p className="mt-1">{formatDate(data.createdAt)}</p>
          </div>
        </div>

        {/* Billing */}
        <div className="flex justify-between mb-10">
          <div>
            <p className="text-xs text-gray-400 uppercase">Bill To</p>
            <h2 className="text-lg font-semibold">{data.getUser.name}</h2>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase">Shipping Address</p>
            <p className="font-medium text-gray-700">
              {data.getAddress.address}
            </p>
            <p className="text-gray-600">
              {data.getAddress.city}, {data.getAddress.state}
            </p>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 text-xs uppercase text-gray-400 font-semibold border-b pb-3">
          <div className="col-span-1">Qty</div>
          <div className="col-span-7">Product</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-2 text-right">Total</div>
        </div>

        {/* Items */}
        <div className="divide-y">
          {data.orderItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 py-4 text-sm items-center"
            >
              <div className="col-span-1 text-gray-700">{item.quantity}</div>
              <div className="col-span-7 font-medium text-gray-800">
                {item.getProduct.name}
              </div>
              <div className="col-span-2 text-right text-gray-600">
                {formatCurrency(item.price)}
              </div>
              <div className="col-span-2 text-right font-semibold text-gray-900">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-10 flex justify-end">
          <div className="w-full sm:w-1/2 ">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>{formatCurrency(data.subTotal)}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Discount</span>
              <span>- {formatCurrency(data.discount)}</span>
            </div>

            <div className="border-t pt-3 mt-3 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-red-500">
                {formatCurrency(data.totalAmount)}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              {toWords(data.totalAmount, { currency: true })}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t text-xs text-gray-500 flex justify-between">
          <p>ecommerce.com</p>
          <p>test@ecommerce.com | +977-9842092500</p>
        </div>
      </div>
    </div>
  );
}
