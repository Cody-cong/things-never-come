import ProductDetailClient from "@/components/product/ProductDetailClient";

export async function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductDetailClient id={params.id} />;
}
