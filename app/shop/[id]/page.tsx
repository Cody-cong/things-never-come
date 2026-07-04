import { redirect } from "next/navigation";

export async function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function ShopPage() {
  redirect("/");
}
