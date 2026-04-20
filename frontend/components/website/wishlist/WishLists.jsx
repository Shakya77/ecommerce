import WishListCard from "./WishListCard";

export default function WishLists({ data }) {
  return (
    <>
      <h1 className="text-2xl font-bold mt-6">My Wishlist</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mt-6">
        {data?.map((item) => (
          <WishListCard key={item.id} data={item} />
        ))}
      </div>
    </>
  );
}
