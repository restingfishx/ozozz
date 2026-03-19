# 部署架构

> Vercel 部署与运维

---

## 1. 部署方案

### 1.1 技术选型

| 服务 | 用途 | 成本 |
|------|------|------|
| Vercel | 前端 + API 部署 | 免费版够用 |
| Supabase | 数据库 + 存储 | 免费版够用 |
| Stripe | 支付 | 按交易收费 |
| Cloudflare | CDN + DNS | 免费版 |

### 1.2 环境

| 环境 | 域名 | 用途 |
|------|------|------|
| 开发 | localhost:3000 | 本地开发 |
| 生产 | ozozz.com | 正式运营 |

---

## 2. Vercel 部署步骤

### 2.1 前提条件

- Vercel 账号（可用 GitHub 登录）
- GitHub 仓库

### 2.2 部署流程

```bash
# 1. 安装 Vercel CLI（可选）
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 在项目根目录执行
vercel

# 4. 按提示选择
# - Set up and deploy? Yes
# - Which scope? 你的 Vercel 用户名
# - Link to existing project? No
# - Project name: ozozz
# - Directory? ./
# - Want to modify settings? No

# 5. 生产环境部署
vercel --prod
```

### 2.3 环境变量

在 Vercel Dashboard → 项目 → Settings → Environment Variables 添加：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# NextAuth
NEXTAUTH_URL=https://ozozz.com
NEXTAUTH_SECRET=your_random_secret

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=bcrypt_hash
```

---

## 3. 域名配置

### 3.1 添加域名

1. Vercel Dashboard → 项目 → Settings → Domains
2. 添加域名 `ozozz.com`
3. 按提示配置 DNS

### 3.2 DNS 配置

在域名注册商（Namecheap/阿里云）添加：

| 类型 | 名称 | 值 |
|------|------|-----|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

### 3.3 HTTPS

Vercel 自动提供 Let's Encrypt SSL 证书，无需手动配置。

---

## 4. Stripe 配置

### 4.1 Stripe 账户设置

1. 注册 Stripe 账户
2. 获取 API Keys（测试模式）
3. 创建产品目录（可选）

### 4.2 Webhook 配置

1. Stripe Dashboard → Developers → Webhooks
2. 添加端点：`https://ozozz.com/api/payment/webhook`
3. 选择事件：`checkout.session.completed`, `payment_intent.succeeded`
4. 获取 Webhook Secret

### 4.3 测试支付

使用 Stripe 测试卡：
- 卡号：4242424242424242
- 有效期：任意未来日期
- CVC：任意3位数

---

## 5. Supabase 配置

### 5.1 创建项目

1. 登录 [supabase.com](https://supabase.com)
2. 创建新项目
3. 获取 URL 和 Keys

### 5.2 初始化数据库

```bash
# 安装 Prisma
npm install prisma @prisma/client

# 初始化
npx prisma init

# 迁移数据库
npx prisma db push

# 生成 Prisma Client
npx prisma generate
```

### 5.3 存储配置

1. Supabase Dashboard → Storage
2. 创建 Bucket：`products`
3. 设置为 Public

---

## 6. 监控与运维

### 6.1 Vercel Analytics

Vercel Dashboard → Analytics（免费）

### 6.2 错误监控

可后续接入 Sentry（免费版够用）

### 6.3 日志

Vercel Dashboard → Functions → Logs

---

## 7. 扩容考虑

### 7.1 当前容量

| 资源 | 免费版限制 | 预估可用 |
|------|------------|----------|
| Vercel 带宽 | 100GB/月 | 初期够用 |
| Vercel 函数调用 | 100K/月 | 初期够用 |
| Supabase 数据库 | 500MB | 初期够用 |
| Supabase 存储 | 1GB | 初期够用 |

### 7.2 升级信号

- 月度流量超过 100GB
- 日订单超过 100 单
- 数据库接近 500MB

---

## 8. 快速回滚

Vercel 支持快速回滚：
1. Dashboard → Deployments
2. 找到之前的稳定版本
3. 点击 "..." → Promote to Production
