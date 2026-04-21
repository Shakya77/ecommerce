export default function formatDate(value) {
  if (!value) return "Not provided";
  const date = new Date(value);
  return date.toISOString().split("T")[0];
}
