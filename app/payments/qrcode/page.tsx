import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/components/context/CartContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  username: string;
  role: string;
  email?: string;
  clerkId?: string;
}

const QRCodePage = () => {
  const searchParams = useSearchParams();
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const method = searchParams.get("method") || "PromptPay";
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    if (totalPrice <= 0 || status === "loading" || !session?.user) return;
    
    const generateQRCode = async () => {
      setIsLoading(true);
      setErrorMessage(null);
  
      try {
        const user = session.user as User; // ✅ Type Assertion

        if (!user.id) {
          throw new Error("User ID is missing");
        }

        const orderId = `order-${Date.now()}`;
  
        const response = await fetch("/api/payments/qrcode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            amount: totalPrice,
            orderId,
            email: user.email ?? "no-email",
            clerkId: user.clerkId ?? "no-clerkId",
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setQrCodeUrl(data.qrCodeUrl);
        setPaymentId(data.paymentId);
        clearCart();
      } catch (error) {
        console.error(error);
        setErrorMessage("เกิดข้อผิดพลาดในการสร้าง QR Code กรุณาลองใหม่");
      } finally {
        setIsLoading(false);
      }
    };
  
    generateQRCode();
  }, [totalPrice, method, session?.user, status, clearCart]);

  useEffect(() => {
    if (paymentId) {
      router.push("/order-success");
    }
  }, [paymentId, router]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-3">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full text-center mt-2">
        <h1 className="text-2xl font-bold">ชำระเงินด้วย {method}</h1>
        <p className="text-lg">ยอดชำระ: ฿{totalPrice}</p>
        {isLoading ? <p>กำลังสร้าง QR Code...</p> : qrCodeUrl ? <Image src={qrCodeUrl} alt="QR Code" width={250} height={220} /> : <p>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default QRCodePage;
