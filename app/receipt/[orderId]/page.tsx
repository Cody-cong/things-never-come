import ReceiptClient from "@/components/receipt/ReceiptClient";

export async function generateStaticParams() {
  return [{ orderId: "placeholder" }];
}

export default function ReceiptPage({ params }: { params: { orderId: string } }) {
  return <ReceiptClient orderId={params.orderId} />;
}
