const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-blue-100 text-gray-700 py-6 text-center shadow-inner mt-auto">
      <p className="text-lg font-semibold">
        &copy; 2025 <span className="text-blue-600">TCGMarket</span>. All rights reserved.
      </p>
      <p className="text-sm mt-2 italic">
        ซื้อ-ขายและประมูลการ์ดเกมที่คุณรักได้ที่ <span className="font-bold text-blue-500">TCGMarket</span> เท่านั้น!
      </p>
    </footer>
  );
};

export default Footer;
