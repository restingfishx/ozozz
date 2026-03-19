# 系统架构概览

> Ozozz 高端跨境电商独立站

---

## 1. 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Next.js 14 App Router | SSR + CSR 混合，支持 SEO |
| 语言 | TypeScript | 类型安全 |
| 样式 | Tailwind CSS | 原子化 CSS，快速开发 |
| UI 组件 | Headless UI / Radix UI | 无样式组件，可定制高端外观 |
| 动画 | Framer Motion | 页面过渡、微交互 |
| 后端 | Next.js API Routes | Serverless 函数 |
| 数据库 | Supabase PostgreSQL | PostgreSQL + 实时订阅 |
| ORM | Prisma | 类型安全的数据库操作 |
| 认证 | NextAuth.js | 管理员登录 |
| 支付 | Stripe Checkout | 托管支付页面 |
| 图片存储 | Supabase Storage | CDN 加速 |
| 部署 | Vercel | 零配置部署 |

---

## 2. 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户端 (C 端)                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │  首页   │ │ 商品页  │ │ 购物车  │ │ 订单页  │          │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘          │
│       └───────────┴───────────┴───────────┘                │
│                           │                                 │
│                    Next.js 14 App Router                   │
└───────────────────────────┼─────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    │  API Routes   │
                    │  (Serverless) │
                    └───────┬───────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    ┌────┴────┐      ┌─────┴─────┐     ┌─────┴─────┐
    │Supabase │      │  Stripe   │     │  邮件     │
    │PostgreSQL│     │ Checkout  │     │  服务     │
    └─────────┘      └───────────┘     └───────────┘
```

---

## 3. 模块划分

### 3.1 C 端模块

| 模块 | 路由 | 功能 |
|------|------|------|
| 首页 | `/` | Banner、商品分类、热销、新品 |
| 商品列表 | `/products` | 筛选、排序、搜索、分页 |
| 商品详情 | `/products/[id]` | 多图展示、规格选择、加购 |
| 购物车 | `/cart` | 数量修改、删除、合计 |
| 结算 | `/checkout` | 地址表单、订单提交 |
| 支付回调 | `/api/payment/webhook` | Stripe 回调处理 |
| 支付结果 | `/payment/success` | 支付成功页 |
| 支付失败 | `/payment/cancel` | 支付失败页 |
| 我的订单 | `/orders` | 订单列表、详情 |
| 政策页 | `/pages/*` | 关于我们、退换货等 |

### 3.2 B 端模块

| 模块 | 路由 | 功能 |
|------|------|------|
| 登录 | `/admin/login` | 管理员登录 |
| 仪表盘 | `/admin` | 数据统计 |
| 商品管理 | `/admin/products` | CRUD、上下架 |
| 订单管理 | `/admin/orders` | 查看、修改状态、填物流单号 |

---

## 4. 目录结构

```
ozozz/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (shop)/            # C 端路由组
│   │   │   ├── page.tsx       # 首页
│   │   │   ├── products/
│   │   │   │   ├── page.tsx   # 商品列表
│   │   │   │   └── [id]/      # 商品详情
│   │   │   ├── cart/
│   │   │   │   └── page.tsx   # 购物车
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx   # 结算页
│   │   │   ├── orders/
│   │   │   │   └── page.tsx   # 我的订单
│   │   │   └── payment/
│   │   │       ├── success/
│   │   │       └── cancel/
│   │   ├── (admin)/           # B 端路由组
│   │   │   ├── admin/
│   │   │   │   ├── login/
│   │   │   │   ├── page.tsx   # 仪表盘
│   │   │   │   ├── products/
│   │   │   │   └── orders/
│   │   ├── api/               # API 路由
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   ├── orders/
│   │   │   └── payment/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/            # 组件
│   │   ├── ui/               # 基础 UI 组件
│   │   ├── shop/             # C 端业务组件
│   │   └── admin/            # B 端业务组件
│   ├── lib/                   # 工具库
│   │   ├── supabase.ts       # Supabase 客户端
│   │   ├── stripe.ts         # Stripe 客户端
│   │   └── utils.ts          # 通用工具
│   ├── hooks/                 # 自定义 Hooks
│   ├── types/                 # TypeScript 类型
│   └── styles/                # 全局样式
├── prisma/
│   └── schema.prisma          # Prisma Schema
├── public/                    # 静态资源
├── docs/                      # 文档
└── scripts/                   # 脚本
```

---

## 5. 设计原则

1. **移动端优先** - 先设计移动端，再适配桌面
2. **渐进增强** - 基础功能可用，再加动画和微交互
3. **Server Components** - 默认使用 Server Components，减少客户端 JS
4. **类型安全** - 全链路 TypeScript，Prisma 生成类型
5. **环境隔离** - 开发、预发、生产环境分离
