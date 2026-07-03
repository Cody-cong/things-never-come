"use client";

import AdminGuard from "../components/AdminGuard";
import ProductManager from "../components/ProductManager";

export default function AdminProductsPage() {
  return (
    <AdminGuard>
      <div className="px-4 pt-5 pb-24">
        <ProductManager />
      </div>
    </AdminGuard>
  );
}
