"use client";

import { Suspense } from "react";
import ManageAuction from "../../components/ManageAuction";

export default function Page() {
  return (
    <Suspense fallback={<div>กำลังโหลด...</div>}>
      <ManageAuction />
    </Suspense>
  );
}
