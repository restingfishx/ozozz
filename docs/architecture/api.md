# API 定义

> 前端与后端的接口契约

---

## 1. 认证机制

### 1.1 C 端（用户）

- **无需登录**：游客可直接浏览、加购
- **订单关联**：通过浏览器 localStorage 存储 cartId，订单关联 cartId

### 1.2 B 端（管理员）

- **NextAuth.js** Session 认证
- 登录后 Session 存储在 Cookie 中
- API 路由通过 `getServerSession` 验证

---

## 2. 公共类型

```typescript
// 分页参数
interface PaginationParams {
  page?: number;      // 默认 1
  limit?: number;     // 默认 12
}

// 分页响应
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API 响应格式
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

---

## 3. 商品 API

### 3.1 商品列表

**GET** `/api/products`

**查询参数**：
```typescript
interface ProductsQuery {
  category?: string;      // 分类筛选
  minPrice?: number;      // 最低价格
  maxPrice?: number;      // 最高价格
  sort?: 'price_asc' | 'price_desc' | 'sales' | 'newest';
  search?: string;        // 关键词搜索
  page?: number;
  limit?: number;
}
```

**响应**：
```typescript
interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  status: 'active' | 'inactive';
  specs: ProductSpec[];
  createdAt: string;
  updatedAt: string;
}

interface ProductSpec {
  name: string;           // 规格名（如 "颜色"）
  values: string[];      // 规格值（如 ["黑色", "米白"]）
}
```

### 3.2 商品详情

**GET** `/api/products/[id]`

**响应**：
```typescript
interface ProductDetailResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  status: 'active' | 'inactive';
  specs: ProductSpec[];
  stock: number;          // 库存
  createdAt: string;
  updatedAt: string;
}
```

---

## 4. 购物车 API

### 4.1 获取购物车

**GET** `/api/cart`

**请求头**：
```
Cookie: cartId=xxx
```

**响应**：
```typescript
interface CartResponse {
  id: string;
  items: CartItem[];
  totalAmount: number;
}

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  specs: Record<string, string>;  // 规格 { color: "黑色", size: "M" }
  price: number;
  quantity: number;
  subtotal: number;
}
```

### 4.2 添加商品到购物车

**POST** `/api/cart`

**请求体**：
```typescript
interface AddToCartRequest {
  productId: string;
  quantity: number;
  specs: Record<string, string>;  // { color: "黑色", size: "M" }
}
```

**响应**：
```typescript
interface CartResponse {
  id: string;
  items: CartItem[];
  totalAmount: number;
}
```

### 4.3 更新购物车商品数量

**PATCH** `/api/cart/[itemId]`

**请求体**：
```typescript
interface UpdateCartItemRequest {
  quantity: number;
}
```

### 4.4 删除购物车商品

**DELETE** `/api/cart/[itemId]`

---

## 5. 订单 API

### 5.1 创建订单

**POST** `/api/orders`

**请求体**：
```typescript
interface CreateOrderRequest {
  cartId: string;
  address: {
    name: string;
    phone: string;
    country: string;
    province: string;
    city: string;
    district: string;
    detail: string;
    postalCode: string;
  };
}
```

**响应**：
```typescript
interface CreateOrderResponse {
  order: Order;
  checkoutUrl: string;    // Stripe Checkout URL
}

interface Order {
  id: string;
  orderNo: string;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  items: OrderItem[];
  address: Address;
  totalAmount: number;
  paidAt?: string;
  shippedAt?: string;
  trackingNumber?: string;
  createdAt: string;
}
```

### 5.2 订单列表

**GET** `/api/orders`

**查询参数**：
```typescript
interface OrdersQuery {
  page?: number;
  limit?: number;
}
```

**响应**：
```typescript
interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}
```

### 5.3 订单详情

**GET** `/api/orders/[id]`

### 5.4 Stripe 支付回调

**POST** `/api/payment/webhook`

Stripe 会发送支付事件到此接口，更新订单状态。

---

## 6. 管理后台 API

### 6.1 管理员登录

**POST** `/api/admin/login`

**请求体**：
```typescript
interface AdminLoginRequest {
  username: string;
  password: string;
}
```

**响应**：
```typescript
interface AdminLoginResponse {
  success: boolean;
  admin?: {
    id: string;
    username: string;
  };
  error?: string;
}
```

### 6.2 商品管理

| 方法 | 路由 | 说明 |
|------|------|------|
| GET | `/api/admin/products` | 商品列表 |
| POST | `/api/admin/products` | 新增商品 |
| GET | `/api/admin/products/[id]` | 商品详情 |
| PUT | `/api/admin/products/[id]` | 更新商品 |
| DELETE | `/api/admin/products/[id]` | 删除商品 |
| PATCH | `/api/admin/products/[id]/status` | 上下架 |

**新增商品请求体**：
```typescript
interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  specs: ProductSpec[];
  stock: number;
}
```

### 6.3 订单管理

| 方法 | 路由 | 说明 |
|------|------|------|
| GET | `/api/admin/orders` | 订单列表 |
| GET | `/api/admin/orders/[id]` | 订单详情 |
| PATCH | `/api/admin/orders/[id]/status` | 修改状态 |
| PATCH | `/api/admin/orders/[id]/tracking` | 填写物流单号 |

### 6.4 数据统计

**GET** `/api/admin/stats`

**响应**：
```typescript
interface AdminStatsResponse {
  totalOrders: number;
  totalSales: number;
  pendingOrders: number;
}
```

---

## 7. 错误码

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |
