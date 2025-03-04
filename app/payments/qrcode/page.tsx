import { Suspense } from "react";
import QRCodePageContent from "@/components/ui/QRCodePageContent";

const QRCodePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QRCodePageContent />
    </Suspense>
  );
};

export default QRCodePage;
