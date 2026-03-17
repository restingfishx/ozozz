---
name: dev
argument-hint: "[task-id]"
description: 开发调度 - 识别技术栈并调度对应开发 Agent。
disable-model-invocation: false
---

# 开发调度指令

参数: $ARGUMENTS

## 前置校验

| 步骤 | 命令 | 说明 |
|------|------|------|
| 1. GitHub 登录 | `gh auth status` | 未登录则提示 |
| 2. tasks.json | 检查文件存在 | 未创建则提示 |
| 3. 任务状态 | 从 tasks.json 读取 | 必须是 pending/pending_fix/pending_design/pending_arch |
| 4. GitHub 仓库 | `git remote -v` | 未配置则提示 |

---

## 读取任务信息

从 tasks.json 读取：tech_stack, description, acceptance, output, depends_on_outputs, relevant_apis, iterations

---

## 任务处理

### 1. 根据状态处理

| 状态 | 处理 |
|------|------|
| pending | 无需操作，worktree 由 Subagent 创建 |
| pending_fix | 无需操作 |
| pending_design/pending_arch | 检查 docs/design/ 或 docs/architecture/ 存在则自动解锁 |

### 2. 依赖检查

```bash
python .claude/skills/split/scripts/tasks.py unlock
```

- 依赖已满足 → 继续
- 依赖未满足 → 提示用户

### 3. 更新状态

```bash
python .claude/skills/split/scripts/tasks.py update <task-id> in_progress
```

---

## 调度 Subagent

根据 tech_stack 选择对应的 Agent，使用 Agent 工具调用：

```
subagent_type: <对应的 dev-agent-xxx>
description: 开发 <tech_stack> 任务
prompt: |
  ## 任务信息
  - 任务 ID: <task-id>
  - 任务描述: <description>
  - 验收标准: <acceptance>
  - 输入文件: <input>
  - 输出目录: <output>
  - 依赖产出: <depends_on_outputs>
  - 相关 API: <relevant_apis>
  - 迭代反馈: <feedback>

  ## 工作目录
  worktrees/<task-id>/

  ## 执行步骤

  1. 创建 worktree：
     MAIN_BRANCH=$(git branch --show-current 2>/dev/null || git remote show origin | grep "HEAD branch" | cut -d' ' -f5)
     git worktree add worktrees/<task-id> $MAIN_BRANCH
     cd worktrees/<task-id>

  2. 拆分任务：按功能点拆分子任务，例如：
     - 登录功能：登录页面 登录API 退出登录
     - 用户管理：用户注册 用户列表 用户编辑 用户删除
     - 复杂模块：核心功能 辅助功能 边界处理

   3. 初始化进度：
     python .claude/agents/scripts/progress.py init <task-id> <子任务1> <子任务2> ...

  4. 查看当前任务：
     python .claude/agents/scripts/progress.py current

  5. 执行当前功能点

  6. 完成当前，开始下一个：
     python .claude/agents/scripts/progress.py next

  7. 重复步骤 4-6 直到全部完成

  8. 验证通过后提交代码：
     git add -A
     git checkout -b temp/<task-id>
     git commit -m "[<task-id>] <description>"
     git push -u origin temp/<task-id>
     gh pr create --title "[<task-id>] <description>" --body "## 任务描述\n<description>\n\n## 审核要点\n请审核代码"

  ## 断点恢复

  1. 首先检查 worktree 是否存在：
     - 如果不存在 → 执行步骤 1 创建 worktree
     - 如果存在 → cd worktrees/<task-id>

  2. 检查 subtasks.json 是否存在：
     - 如果存在 → 运行 `python .claude/agents/scripts/progress.py current` 继续当前任务
     - 如果不存在 → 执行步骤 2-3 初始化

  重新启动后，运行 `python .claude/agents/scripts/progress.py status` 查看进度，继续执行。
```

### tech_stack 映射表

| tech_stack | subagent_type |
|------------|---------------|
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
| DBA | dev-agent-dba |
| DevOps | dev-agent-devops |

---

## 自检（Subagent 完成后）

1. 确保当前在主目录（不是 worktree）：
   ```bash
   pwd
   git branch --show-current
   ```

2. 如果不在主目录，切回并拉取最新代码：
   ```bash
   MAIN_BRANCH=$(git branch --show-current 2>/dev/null || git remote show origin | grep "HEAD branch" | cut -d' ' -f5)
   git checkout $MAIN_BRANCH
   git pull origin $MAIN_BRANCH
   ```

---

## 更新状态（Subagent 完成后）

```bash
python .claude/skills/split/scripts/tasks.py update <task-id> pending_review
python .claude/skills/split/scripts/tasks.py iter <task-id> <agent> "<结果>" "<反馈>"
```

---

## 重要规则

- 验证通过才能提交
- 迭代开发基于反馈修改
