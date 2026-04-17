import CartCard from "./CartCard";

export default function CartLayout({ data }) {
  return (
    <>
      {data?.map((item) => (
        <CartCard key={item.id} data={item} />
      ))}
    </>
  );
}
