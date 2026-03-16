# 数据架构

> Supabase PostgreSQL 数据库设计

---

## 1. 数据库概览

- **数据库**：Supabase PostgreSQL
- **ORM**：Prisma
- **存储**：Supabase Storage（商品图片）

---

## 2. 表结构

### 2.1 商品表 (products)

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  images TEXT[], -- JSON array of image URLs
  category VARCHAR(100),
  specs JSONB, -- 规格定义
  stock INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active', -- active, inactive
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
```

**Prisma Schema**:
```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Float
  originalPrice Float?
  images      String[]
  category    String?
  specs       Json?
  stock       Int      @default(0)
  status      String   @default("active")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  orderItems  OrderItem[]
}
```

### 2.2 购物车表 (carts)

```sql
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  specs JSONB, -- 用户选择的规格
  price DECIMAL(10, 2) NOT NULL, -- 下单时的价格
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
```

**Prisma Schema**:
```prisma
model Cart {
  id        String     @id @default(uuid())
  items     CartItem[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id        String   @id @default(uuid())
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  cartId    String
  product   Product  @relation(fields: [productId], references: [id])
  productId String
  specs     Json?
  price     Float
  quantity  Int       @default(1)
  createdAt DateTime @default(now())
}
```

### 2.3 订单表 (orders)

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no VARCHAR(50) UNIQUE NOT NULL, -- 订单号
  cart_id UUID REFERENCES carts(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, paid, shipped, completed, cancelled
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  address JSONB NOT NULL, -- 收货地址
  paid_at TIMESTAMP WITH TIME ZONE,
  shipped_at TIMESTAMP WITH TIME ZONE,
  tracking_number VARCHAR(100),
  stripe_session_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_no ON orders(order_no);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

**Prisma Schema**:
```prisma
model Order {
  id              String      @id @default(uuid())
  orderNo         String      @unique
  cartId          String?
  status          String      @default("pending")
  totalAmount     Float
  currency        String      @default("USD")
  address         Json
  paidAt          DateTime?
  shippedAt       DateTime?
  trackingNumber  String?
  stripeSessionId String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  items           OrderItem[]
}
```

### 2.4 订单商品表 (order_items)

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  product_image VARCHAR(500),
  specs JSONB, -- 下单时的规格
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

**Prisma Schema**:
```prisma
model OrderItem {
  id           String   @id @default(uuid())
  order        Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId      String
  product      Product  @relation(fields: [productId], references: [id])
  productId    String
  productName  String
  productImage String?
  specs        Json?
  price        Float
  quantity     Int
  subtotal     Float
  createdAt    DateTime @default(now())
}
```

### 2.5 管理员表 (admins)

```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Prisma Schema**:
```prisma
model Admin {
  id           String   @id @default(uuid())
  username     String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}
```

---

## 3. Supabase 配置

### 3.1 RLS 策略 (Row Level Security)

```sql
-- 商品表：所有人都可读取
CREATE POLICY "products_select" ON products
  FOR SELECT USING (true);

-- 购物车：用户只能操作自己的购物车（通过 cart_id 关联）
CREATE POLICY "cart_select" ON carts
  FOR SELECT USING (auth.uid() = id);

-- 订单：用户只能查看自己的订单
CREATE POLICY "orders_select" ON orders
  FOR SELECT USING (true); -- 后续可通过 user_id 限制

-- 管理员表：仅管理员可操作
CREATE POLICY "admins_select" ON admins
  FOR SELECT USING (true);
```

### 3.2 Storage Buckets

```sql
-- 创建商品图片存储桶
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true);

-- 设置存储策略
CREATE POLICY "products_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');
```

---

## 4. 数据关系图

```
┌─────────────┐       ┌─────────────┐
│   products  │       │    carts    │
├─────────────┤       ├─────────────┤
│ id          │       │ id          │
│ name        │       │ created_at  │
│ price       │       └──────┬──────┘
│ ...         │              │
└──────┬──────┘              │
       │              ┌──────┴──────┐
       │              │ cart_items  │
       │              ├─────────────┤
       │              │ cart_id     │
       │              │ product_id  │
       │              │ quantity    │
       │              └──────┬──────┘
       │                     │
       │                     │
       │    ┌────────────────┘
       │    │
       ▼    ▼
┌─────────────┐       ┌─────────────┐
│ order_items  │       │   orders    │
├─────────────┤       ├─────────────┤
│ order_id    │◄──────│ id          │
│ product_id  │       │ order_no    │
│ product_name│       │ status      │
│ price       │       │ total_amount│
│ quantity    │       │ address     │
└─────────────┘       │ stripe_id   │
                      └─────────────┘

┌─────────────┐
│   admins    │
├─────────────┤
│ id          │
│ username    │
│ password    │
└─────────────┘
```
