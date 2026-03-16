---
name: dev
argument-hint: "[task-id]"
description: 开发调度 - 识别技术栈并调度对应开发 Agent。用于需要开始开发任务或调度开发 Agent 实现功能时。
disable-model-invocation: false
---

# 开发调度指令

参数: $ARGUMENTS

## 阶段零：前置校验

### 步骤1：检查 GitHub 登录

必须执行以下命令检查登录状态：

```bash
gh auth status
```

如果未登录，**停止执行**，显示登录引导：

```
⚠️ GitHub 未登录

请先登录 GitHub：
1. 运行 `gh auth login`
2. 选择 HTTPS 或 SSH
3. 完成认证

登录后请再次触发 /dev
```

> Subagent 无法与用户交互，必须在此步骤确保 GitHub 已登录。

### 步骤2：检查其他前置条件

1. **tasks.json 存在**：确保任务清单已创建
2. **任务状态正确**：
   - 状态为 `pending`（首次开发）
   - 状态为 `pending_fix`（修复迭代）
   - 状态为 `pending_design`（等待 DESIGN，可自动解锁）
   - 状态为 `pending_arch`（等待 ARCH，可自动解锁）
3. **任务存在**：指定的任务 ID 存在于 tasks.json 中
4. **依赖产出已就绪**：
   - 如果任务依赖 `DESIGN` → 检查设计文档是否存在
   - 如果任务依赖 `ARCH` → 检查架构文档是否存在
2. 选择 HTTPS 或 SSH
3. 完成认证

登录后请再次触发 /dev
```

### 依赖检查规则

从 tasks.json 中读取任务的 `depends_on_outputs` 字段，根据声明的依赖类型检查：

| 依赖 | 检查内容 | 适用角色 |
|------|----------|----------|
| DESIGN | `docs/design/` 目录存在 | 前端 |
| ARCH | `docs/architecture/` 目录存在 | 前端、后端 |

#### 架构文件细分

根据 tech_stack 判断需要的 ARCH 文件：

| tech_stack | 需要的 ARCH 文件 |
|------------|-----------------|
| 前端 (React/Vue/Flutter...) | `docs/architecture/api.md` |
| 后端 (Python/Go/Java...) | `docs/architecture/api.md` + `docs/architecture/data.md` |
| DevOps | `docs/architecture/deploy.md` |

> **注意**：前端只需要 `api.md`，后端需要 `api.md` + `data.md`。

### 依赖未就绪时的自动处理

如果依赖产出不存在：
- **自动更新状态**：`pending` → `blocked`
- **记录阻塞原因**：在任务的 `block_reason` 字段记录缺少的依赖
- **提示用户**：告知任务已被阻塞，需要先完成相应产出

---

## 阻塞任务处理

### 软阻塞状态

| 状态 | 说明 | 解锁条件 |
|------|------|----------|
| `pending_design` | 等待 DESIGN 完成 | `docs/design/` 目录存在 |
| `pending_arch` | 等待 ARCH 完成 | `docs/architecture/` 目录存在 |
| `blocked` | 被阻塞 | 修复阻塞原因后手动解锁 |

### 自动解锁流程

1. 用户执行 `/dev TASK-XXX`
2. 检查任务状态：
   - 如果是 `pending_design`：检查 `docs/design/` 是否存在
     - 存在 → 自动更新状态：`pending_design` → `pending`，继续开发
     - 不存在 → 提示用户 DESIGN 尚未完成
   - 如果是 `pending_arch`：检查 `docs/architecture/` 是否存在
     - 存在 → 自动更新状态：`pending_arch` → `pending`，继续开发
     - 不存在 → 提示用户 ARCH 尚未完成

### 硬阻塞状态（已弃用）

> ⚠️ `blocked` 状态已不再推荐使用。请使用 `pending_design` 或 `pending_arch` 代替。

历史兼容：如果遇到 `blocked` 状态的任务：
- 记录阻塞原因
- 提示用户先完成相应产出
- 不自动更新状态，需要用户确认后手动处理

---

## 阶段一：读取任务信息

从 tasks.json 中读取任务信息：
- 技术栈（split 阶段已确定）
- 任务描述
- 验收标准
- 当前状态

### 技术栈来源

技术栈在 /split 阶段已经确定，直接使用 task 中的 `tech_stack` 字段：
- "Python + 后端" → dev-agent-python
- "Swift + iOS" → dev-agent-ios
- 以此类推

### 检查迭代状态

如果任务状态为 `pending_fix`：

1. 获取任务详情：
   ```bash
   python .claude/skills/split/scripts/tasks.py get <task-id>
   ```
2. 从返回的 `iterations` 数组中获取最后一条记录的 `feedback` 字段
3. 将反馈内容作为开发上下文传递给 Subagent

### GitHub 仓库检查

检查本地仓库是否已关联远程仓库：

```bash
git remote -v
```

如果未配置：
- 提示用户先连接或创建 GitHub 仓库
- 不继续执行开发

> **注意**：分支创建和代码提交由 Subagent 执行。

## 阶段二：调度 Subagent

使用 **Agent 工具** 调度对应的 Subagent。

### 调用方式

```
使用 Agent 工具，参数如下：
- description: "Python 后端开发" (描述任务)
- subagent_type: "dev-agent-python" (Agent 文件名，不含 .md 后缀)
- prompt: <完整的任务信息>
```

### 技术栈映射

根据 tasks.json 中指定的技术栈，选择对应的 Agent：

| tech_stack 字段 | subagent_type |
|-----------------|-------------|
| React + Web | dev-agent-react |
| Vue + Web | dev-agent-vue |
| React Native + 移动端 | dev-agent-react-native |
| Flutter + 移动端 | dev-agent-flutter |
| Electron + 桌面端 | dev-agent-electron |
| Tauri + 桌面端 | dev-agent-tauri |
| Qt + C++ + 桌面端 | dev-agent-qt |
| Python + 后端 | dev-agent-python |
| Node.js + 后端 | dev-agent-nodejs |
| Go + 后端 | dev-agent-go |
| Java + 后端 | dev-agent-java |
| Rust + 后端 | dev-agent-rust |
| Swift + iOS | dev-agent-ios |
| Swift + macOS | dev-agent-macos |
| Kotlin + Android | dev-agent-android |

## 阶段三：执行开发

### 传递给 Subagent 的参数

dev 必须将以下信息完整传递给 Subagent：

| 参数 | 来源 | 说明 |
|------|------|------|
| 任务描述 | tasks.json | 要做什么 |
| 验收标准 | tasks.json | 做到什么程度 |
| 输入文件 | tasks.json | 依赖什么（完整路径） |
| 输出文件 | tasks.json | 产出什么 |
| 依赖产出 | tasks.json | 需要哪些前置文档 |
| **相关 API** | tasks.json.relevant_apis | 任务涉及的 API 摘要（如有） |
| 迭代反馈 | 上轮 review | 如果是修复迭代，传递具体问题 |

> **Token 优化**：只传递 `relevant_apis` 摘要（路径+方法+描述），不传完整定义在 `完整 API 定义。docs/architecture/api.md`，Subagent 需要时可自行读取。

### 子任务处理逻辑

#### 情况1：无子任务

Subagent 收到任务后，**自动拆分**为可执行的子任务：
- 拆分粒度：每个子任务可独立完成
- 边执行边记录：每完成一个子任务，记录进度

#### 情况2：有子任务

Subagent 收到任务后：
- 读取已保存的子任务进度
- 从最后一个未完成的子任务继续

### 开发前

- 状态变更：`pending` → `in_progress`
- 记录开始时间

### 开发中：代码验证

> 代码验证由 Subagent 执行，见 `_template.md` 中的"代码验证规则"

Subagent 必须验证代码能够运行后才能提交。

### 开发后

Subagent 完成后执行以下 GitHub 操作：

1. **提交代码**：`git add -A && git commit`
2. **推送代码**：`git push -u origin <分支名>`
3. **创建 PR**：`gh pr create --title "[TASK-XXX] 描述" --body "..."`

> GitHub 登录已在 dev 开始时检查，Subagent 可以直接执行上述操作。

完成后：
- 状态变更：`in_progress` → `pending_review`
- 迭代次数 +1

### 迭代场景

如果存在上一轮反馈：
- 将反馈内容和修改要求明确告知 Subagent
- Subagent 基于反馈进行修改

## 阶段四：更新状态

开发完成后，使用脚本更新状态：

```bash
# 更新状态：in_progress → pending_review
python .claude/skills/split/scripts/tasks.py update <task-id> pending_review
```

如果需要添加迭代记录：

```bash
python .claude/skills/split/scripts/tasks.py iter <task-id> <agent-name> "<结果>" "<反馈>"
```

## 阶段五：多任务并行处理

### 并行开发规则

如果存在多个 `pending` 状态的任务，可以并行开发：

#### 并行触发方式

用户可以同时触发多个 /dev：
```
/dev TASK-001
/dev TASK-002
```

#### Worktree 隔离

每任务使用独立 worktree 目录：

```
worktrees/
├── task-001/      # TASK-001
└── task-002/      # TASK-002
```

目录之间互不干扰，可真正并行开发。

**Worktree 优势**：
- 每任务独立目录，不会相互干扰
- 可同时在多个终端会话中开发
- 合并后删除 worktree 即可

#### 合并顺序

合并时需注意依赖关系：
- 如果任务之间有依赖 → 按依赖顺序合并
- 如果任务之间无依赖 → 可以任意顺序合并

### 任务依赖处理

如果 tasks.json 中定义了 `depends_on`：
- 必须等待依赖任务完成（状态为 `completed`）
- 才能开始当前任务

---

## 重要规则

- 技术栈在 /split 阶段确定，/dev 阶段直接使用，不再重新识别
- 遇到不确定问题，必须提问
- 批量编码后统一审核
- 迭代开发时，必须基于反馈内容进行修改
- 每任务独立 worktree，避免相互干扰
