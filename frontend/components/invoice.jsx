import formatDate from "@/lib/date";
import { toWords } from "to-words";

export default function Invoice({ data }) {
  return (
    <div className="min-h-screen flex items-start justify-center p-6">
      <div className=" max-w-3xl shadow-md  p-10 ">
        <div className="text-right text-sm mb-5">
          <p className="font-semibold">Ecommerce Store</p>
          <p>San Francisco CA, 94103</p>
        </div>

        <div className="flex justify-between mb-10">
          <div>
            <h2 className="text-xl font-semibold mb-2">{data.getUser.name}</h2>
            <p className="text-sm">
              Invoice Date:
              <span className="font-semibold">
                {formatDate(data.createdAt)}
              </span>
            </p>
            <p className="text-sm">
              Invoice No: <span className="font-semibold">{data.id}</span>
            </p>
          </div>
        </div>

        <div className="mb-10">
          <div className="grid grid-cols-12 text-sm font-semibold border-b pb-2 text-gray-500">
            <div className="col-span-1">QTY</div>
            <div className="col-span-7">DESCRIPTION</div>
            <div className="col-span-2 text-right">PRICE</div>
            <div className="col-span-2 text-right">SUBTOTAL</div>
          </div>

          {data.orderItems.map((item) => (
            <div className="grid grid-cols-12 py-3" key={item.id}>
              <div className="col-span-1">{item.quantity}</div>
              <div className="col-span-7">{item.getProduct.name}</div>
              <div className="col-span-2 text-right">Rs. {item.price}</div>
              <div className="col-span-2 text-right font-semibold">
                Rs. {item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-6 mb-10">
          <div className="text-right">
            <p className="text-sm text-gray-500 font-semibold">TOTAL </p>
            <p className="text-2xl font-bold text-red-500">
              Rs. {data.totalAmount}
            </p>
            <p className="text-sm text-gray-500">
              {toWords(data.totalAmount, { currency: true })}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-6 text-sm flex justify-end items-center text-gray-600">
          <p>test@ecommerce.com | 9842092500 | ecommerce.com</p>
        </div>
      </div>
    </div>
  );
}
