#!/usr/bin/env python3
"""子任务进度管理脚本"""

import json
import sys
import os
from datetime import datetime

SUBTASKS_FILE = "subtasks.json"


def load_subtasks():
    """加载子任务文件"""
    if not os.path.exists(SUBTASKS_FILE):
        return None
    with open(SUBTASKS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_subtasks(data):
    """保存子任务文件"""
    with open(SUBTASKS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def cmd_init(task_id, subtasks):
    """初始化子任务"""
    data = {
        "task_id": task_id,
        "subtasks": [
            {"id": i + 1, "name": name, "status": "pending"}
            for i, name in enumerate(subtasks)
        ],
        "current": 1,
        "created_at": datetime.now().isoformat() + "Z",
        "updated_at": datetime.now().isoformat() + "Z"
    }
    save_subtasks(data)
    print(f"✓ 已创建子任务: {task_id}")
    print(f"  共 {len(subtasks)} 个子任务")
    for i, name in enumerate(subtasks):
        print(f"  {i+1}. {name}")


def cmd_status():
    """查看进度"""
    data = load_subtasks()
    if not data:
        print("暂无子任务")
        return

    print(f"任务: {data['task_id']}")
    print(f"当前: {data.get('current', 1)}/{len(data['subtasks'])}")
    print("进度:")
    for st in data["subtasks"]:
        icon = {"pending": "⏳", "in_progress": "🔄", "completed": "✅"}.get(st["status"], "?")
        marker = "→" if st["id"] == data.get("current") else " "
        print(f"  {marker} {icon} {st['id']}. {st['name']}")


def cmd_next():
    """完成当前，开始下一个"""
    data = load_subtasks()
    if not data:
        print("✗ 子任务文件不存在")
        return

    current = data.get("current", 1)
    # 标记当前为完成
    for st in data["subtasks"]:
        if st["id"] == current and st["status"] != "completed":
            st["status"] = "completed"
            break

    # 找下一个未完成的
    remaining = [st for st in data["subtasks"] if st["status"] != "completed"]
    if remaining:
        next_id = remaining[0]["id"]
        data["current"] = next_id
        for st in data["subtasks"]:
            if st["id"] == next_id:
                st["status"] = "in_progress"
                break
        print(f"✓ 已完成 {current}，开始子任务 {next_id}: {remaining[0]['name']}")
    else:
        data["current"] = len(data["subtasks"]) + 1
        print("✓ 所有子任务已完成！")

    data["updated_at"] = datetime.now().isoformat() + "Z"
    save_subtasks(data)


def cmd_current():
    """获取当前子任务"""
    data = load_subtasks()
    if not data:
        print("{}")
        return

    current = data.get("current", 1)
    for st in data["subtasks"]:
        if st["id"] == current:
            print(json.dumps(st, ensure_ascii=False, indent=2))
            return
    print("{}")


def cmd_update(subtask_id, status):
    """更新子任务状态"""
    data = load_subtasks()
    if not data:
        print("✗ 子任务文件不存在")
        return

    for st in data["subtasks"]:
        if st["id"] == subtask_id:
            st["status"] = status
            data["updated_at"] = datetime.now().isoformat() + "Z"
            save_subtasks(data)
            print(f"✓ 子任务 {subtask_id}: {st['name']} → {status}")
            return
    print(f"✗ 子任务 {subtask_id} 不存在")


def usage():
    print("""子任务进度管理

用法:
  python progress.py init <task-id> <子任务1> <子任务2> ...  初始化
  python progress.py status                                    查看进度
  python progress.py current                                   当前任务
  python progress.py next                                      完成当前，开始下一个
  python progress.py update <id> <status>                      更新状态
""")


def main():
    if len(sys.argv) < 2:
        usage()
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == "init":
        if len(sys.argv) < 4:
            print("用法: python progress.py init <task-id> <子任务1> <子任务2> ...")
            sys.exit(1)
        cmd_init(sys.argv[2], sys.argv[3:])

    elif cmd == "status":
        cmd_status()

    elif cmd == "current":
        cmd_current()

    elif cmd == "next":
        cmd_next()

    elif cmd == "update":
        if len(sys.argv) < 4:
            print("用法: python progress.py update <id> <status>")
            sys.exit(1)
        cmd_update(int(sys.argv[2]), sys.argv[3])

    else:
        print(f"未知命令: {cmd}")
        usage()
        sys.exit(1)


if __name__ == "__main__":
    main()
