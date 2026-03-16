# AI 开发流程

## 命令速查

| 命令 | 产出 |
|------|------|
| `/pm` | PRD 文档 |
| `/arch` | 架构设计 |
| `/design` | 界面设计 |
| `/split` | 任务清单 |
| `/dev TASK-XXX` | 开发 |
| `/review TASK-XXX 通过/不通过` | 审核 |
| `/deploy` | 部署 |
| `/status` | 任务状态 |

## 链路

```
PM → PRD → [ARCH + DESIGN] → SPLIT → DEV → REVIEW → DEPLOY
```

## 任务状态

```
pending/pending_design/pending_arch → in_progress → pending_review → completed → deployed
                                      ↓
                                 pending_fix → (修复)
```

## Worktree

```
worktrees/task-XXX/
```

## 文档

- `docs/prd.md`
- `docs/architecture/`
- `docs/design/`
- `tasks.json`
