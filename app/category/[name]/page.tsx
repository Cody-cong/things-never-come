import CategoryListClient from "@/components/category/CategoryListClient";

export async function generateStaticParams() {
  return [{ name: "placeholder" }, { name: "ALL" }];
}

export default function CategoryPage({ params }: { params: { name: string } }) {
  const name = decodeURIComponent(params.name);
  return <CategoryListClient name={name} />;
}
