import ShopRedirectClient from "@/components/shop/ShopRedirectClient";

export async function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function ShopPage() {
  return <ShopRedirectClient />;
}
