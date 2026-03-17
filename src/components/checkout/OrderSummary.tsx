'use client';

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  specs: Record<string, string>;
  price: number;
  quantity: number;
  subtotal: number;
}

interface OrderSummaryProps {
  items: CartItem[];
  totalAmount: number;
  shipping?: number;
  tax?: number;
}

export function OrderSummary({ items, totalAmount, shipping = 0, tax = 0 }: OrderSummaryProps) {
  const subtotal = totalAmount;
  const grandTotal = subtotal + shipping + tax;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">订单摘要</h2>

      {/* 商品列表 */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
              {item.productImage && (
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium truncate">{item.productName}</h3>
              {item.specs && Object.keys(item.specs).length > 0 && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {Object.entries(item.specs)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(', ')}
                </p>
              )}
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">x{item.quantity}</span>
                <span className="text-sm font-medium">¥{item.subtotal}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 费用明细 */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">商品小计</span>
          <span>¥{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">运费</span>
          <span>{shipping === 0 ? '免运费' : `¥${shipping.toFixed(2)}`}</span>
        </div>
        {tax > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">税费</span>
            <span>¥{tax.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-semibold pt-2 border-t mt-2">
          <span>合计</span>
          <span>¥{grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
