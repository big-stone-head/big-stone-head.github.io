---
layout: post
title: "Claude Code Token 节省与高效使用完全指南：从原理到实操的 16 个维度"
date: 2026-04-01
lang: zh
---

# Claude Code Token 节省与高效使用完全指南

> 适用范围：Claude Code CLI、claude.ai Chat、Claude Desktop 全产品线
> 来源：Anthropic 官方文档、社区最佳实践、深度用户经验

---

## 为什么你总是碰到用量上限？

很多人以为"一条消息就是一条消息"，但实际上 **消息数 ≠ 实际消费量**。以下是推高消费的四大元凶：

### 长对话的累积成本

这是最常见的消耗加速器。在一个 50 轮对话中，每发一条消息，Claude 都要重新处理**整个对话历史**。因此：

> 长对话中一条消息的消耗量，是新对话首条消息的 **8-10 倍**。

团队在同一个对话里反复做文档整理、调研问答，就是这个模式在吃掉配额。

### 文档上传

每次上传大文件（PDF、DOCX 等），内容会完整进入 Context Window，大幅增加单次消耗。如果在新对话里重复上传同一文件，就是重复的高消耗。

### 模型选择

| 模型 | 相对消耗 |
|------|---------|
| Haiku | Sonnet 的 ~30% |
| **Sonnet** | **基准（1x）** |
| Opus | Sonnet 的 **3-5 倍** |

用 Opus 做文档整理，就是用跑车去买菜。

### 产品间共享配额

**claude.ai、Claude Code CLI、Claude Desktop 共用同一个配额池。** 你在 Claude Code 里大量编码，回头发现 claude.ai 也没额度了——因为它们是同一个池子。

---

## 五小时滚动窗口机制详解

这不是"每 5 小时自动重置"，而是一个**滚动窗口**：

1. 你发送第一条消息时窗口**开始计时**
2. 这条消息占用的配额在**发送后 5 小时释放**
3. 如果你不发消息，窗口会无限期保持开放
4. 消耗是**基于 Token 的**，不是简单的消息计数——复杂/长的消息消耗更多

**策略**：快到上限时，等 5 小时窗口过期再发下一条。利用等待时间仔细规划下一个 Prompt，让新窗口的第一条消息就发挥最大价值。

---

## 订阅计划与限额对照

### 各计划配额

| 计划 | 价格 | 5 小时窗口消息数（典型值） | 非高峰提升 |
|------|------|-------------------------|-----------|
| Pro | $20/月 | 40-45 条短消息 | 50-60+ |
| Max 5x | $100/月 | ~225 条 | 更高 |
| Max 20x | $200/月 | ~900 条 | 更高 |

### 每周上限（2025 年 8 月引入）

影响约 5% 的重度用户：

| 计划 | 每周 Sonnet 小时 | 每周 Opus 小时 |
|------|----------------|---------------|
| Pro | 40-80 | N/A |
| Max 5x | 140-280 | 15-35 |
| Max 20x | 240-480 | 24-40 |

### 高峰时段限流（2026 年 3 月起）

工作日 **太平洋时间 5-11 AM**（北京时间约 20:00-02:00）限额更紧，Pro 用户可能降至 35-40 条/窗口。调整工作时间到非高峰时段的开发者报告 **每周多出 30-40% 的有效使用时间**。

---

## Context Window 架构——理解隐性开销

这是 Token 优化最核心的概念：

> "大多数最佳实践都基于一个约束：Claude 的 Context Window 填满得很快，且随着填充性能会下降。" —— 官方文档

### 200K Token 预算分解

| 组件 | Token 数 | 占比 |
|------|---------|------|
| 系统提示 + 工具定义 | ~18,000-19,000 | ~10% |
| CLAUDE.md 文件（所有层级） | 2,000-42,000+ | 1-21% |
| MCP 服务器工具定义 | 可变 | 0-5% |
| 自动压缩预留 | ~33,000-45,000 | ~17-23% |
| **实际可用于工作** | **~100,000-145,000** | **~50-72%** |

**典型高级用户在输入第一个字之前，就已经烧掉了 50,000-70,000 token**——占 200K 窗口的 25-35%。

### 为什么 Context 大小影响成本

Token 成本随 Context 大小线性增长。你发的每条消息都包含整个对话上下文。随着 Context 增长：
- 每条消息成本更高
- Claude 性能下降
- "遗忘"早期指令的风险增加
- 自动压缩触发，可能丢失重要细节

---

## Prompt 缓存机制——为什么某些策略有效

### 前缀匹配机制

Prompt 缓存是**前缀匹配**——API 检查新请求有多少前缀与已处理内容匹配。前缀中任何位置的改变都会使其之后的所有缓存失效。

### Claude Code 的缓存结构

Claude Code 将请求组织为**静态内容在前，动态内容在后**：

1. **系统提示**（固定，始终缓存）
2. **工具定义**（稳定，缓存）
3. **CLAUDE.md 内容**（会话内稳定，缓存）
4. **对话消息**（动态，每轮增长）

### 价格影响

| Token 类型 | 成本倍率 |
|-----------|---------|
| 创建缓存 | 1.25x |
| 读取缓存 | **0.1x** |
| 盈亏平衡 | 第 2 轮 |

长会话可达 **90% 缓存命中率**，大幅降低单 Token 成本。

### 关键操作建议

- **不要在会话中途修改 CLAUDE.md**——会使之后所有缓存失效
- **保持系统上下文稳定**——CLAUDE.md 越稳定，缓存效果越好

---

## 自动压缩与手动压缩

### 自动压缩触发条件

Context Window 达到约 **95% 容量**（或剩余约 25%）时触发。但很多高级用户建议**不要等到自动压缩**，因为它可能导致 Agent "失控"——丢失重要上下文。

### `/compact` 手动压缩

```bash
/compact                              # 基础压缩
/compact 保留代码示例                    # 指定保留内容
/compact 重点保留 API 变更记录           # 自定义保留指令
```

也可以在 CLAUDE.md 中添加压缩指令：
```markdown
# Compact instructions
When you are using compact, please focus on test output and code changes
```

### `/rewind` + 摘要——精准压缩

最精确的 Context 管理技术：
1. 按 `Esc + Esc` 或执行 `/rewind`
2. 选择一个消息检查点（如 40 条对话的中间位置）
3. 选择 **"Summarize from here"**
4. 该点之前的内容被浓缩，之后的保持完整

### 推荐压缩时机

| 触发条件 | 操作 |
|---------|------|
| Context 使用约 50% | 执行 `/compact` 并指定保留内容 |
| 切换子任务 | 在开始新工作前压缩 |
| 探索结束、开始实现 | 压缩探索阶段 |
| 调试结束 | 压缩后再开始修复 |
| **不要在以下时候压缩** | 正在实现中、正在调试中、多文件重构中 |

---

## CLAUDE.md 优化——最大的隐性成本

### 问题

CLAUDE.md 在**每个会话启动时**和**每条消息的 Context 中**都会被加载。一个臃肿的 CLAUDE.md 就是对每次交互的持续税收。

**真实案例**：某开发者的 CLAUDE.md 每次对话消耗约 42,000 token。优化后降至约 2,400 token——**削减 94%**。

### 官方建议

> "将 CLAUDE.md 控制在 200 行以内，只包含必需信息。" —— 官方文档

### 应该包含 vs 不应包含

| 应该包含 | 不应包含 |
|---------|---------|
| Claude 无法猜到的 Bash 命令 | Claude 通过读代码就能发现的东西 |
| 与默认不同的代码风格规则 | 标准语言约定（Claude 已经知道） |
| 测试指令和首选测试框架 | 详细的 API 文档（改为链接） |
| 仓库规范（分支命名、PR 规则） | 频繁变化的信息 |
| 项目特定的架构决策 | 长篇解释或教程 |
| 开发环境的特殊问题 | 文件逐一描述 |
| 常见陷阱或非显而易见的行为 | "写干净代码"这类不言自明的规则 |

### 优化步骤

1. **用 `/context` 审计**：查看 CLAUDE.md 确切消耗了多少 Token
2. **对每一行问**：删掉这行会导致 Claude 犯错吗？如果不会，删
3. **用 `@` 引用替代内联**：`@docs/testing.md` 按需加载
4. **把专用工作流迁移到 Skills**
5. **保持简短**：用列表，不用段落
6. **定期清理**：像对待代码一样对待 CLAUDE.md

### CLAUDE.md 加载层级（都会产生 Token 成本）

| 位置 | 作用域 | 是否始终加载？ |
|------|-------|-------------|
| `~/.claude/CLAUDE.md` | 所有项目、所有会话 | 是 |
| `./CLAUDE.md`（项目根目录） | 本项目所有会话 | 是 |
| 父目录 | Monorepo 场景 | 是 |
| 子目录 | 子目录工作时 | 按需 |

**注意**：全局 CLAUDE.md 和项目 CLAUDE.md 会同时加载。两个都需要优化。

---

## Skills 按需加载——替代 CLAUDE.md 膨胀

### 架构原理

Skills（`.claude/skills/*/SKILL.md`）采用**渐进式加载**：

1. 启动时仅加载每个 Skill 的**名称和描述**（元数据）
2. 只有当 Skill 变得相关时，Claude 才读取完整内容
3. Skill 引用的附加文件也是按需读取

这意味着 PR Review、数据库迁移、部署工作流等专用指令在做无关工作时**消耗零 Token**。

### Token 节省的具体数字

| 方案 | 每会话 Token 数 | 节省 |
|------|---------------|------|
| 全部放在 CLAUDE.md | ~42,000 | 基准 |
| 模块化 Skills 架构 | ~2,400（始终加载） | **94%** |

### 迁移方法

1. 找出 CLAUDE.md 中仅在特定工作流中相关的内容块
2. 创建 Skill 目录：`.claude/skills/<工作流名>/SKILL.md`
3. 将内容迁移到 SKILL.md
4. 从 CLAUDE.md 中删除该内容
5. 如需要，在 CLAUDE.md 中简要提及："部署工作流请使用 /deploy"

---

## 子代理（Subagent）的 Token 经济学

### 工作原理

子代理在**独立的 Context Window** 中运行，只向主对话返回**摘要**。这是最强大的 Context 节省工具之一。

### 何时值得使用子代理

| 任务 | 直接执行（主 Context） | 子代理 | 推荐 |
|------|---------------------|--------|------|
| 读 1-2 个文件 | 开销低 | 启动成本高 | **直接** |
| 探索 3+ 个文件 | Context 污染高 | 仅返回摘要 | **子代理** |
| 运行测试 | 冗长输出填满 Context | 输出留在子代理内 | **子代理** |
| 代码审查 | 自己写的代码有偏见 | 全新 Context、无偏见 | **子代理** |
| 获取文档 | 大量内容涌入 | 过滤后摘要返回 | **子代理** |

### 子代理启动成本

每个子代理有 **5,000-15,000 token** 的启动开销（加载 CLAUDE.md、建立角色等）。所以简单任务不要用子代理。

### 子代理模型配置

在 `~/.claude/settings.json` 中配置：
```json
{
  "env": {
    "CLAUDE_CODE_SUBAGENT_MODEL": "haiku"
  }
}
```

Haiku 比 Sonnet **便宜约 80%**，用于文件读取、探索和测试运行完全够用。

### Agent Teams 的 7 倍警告

Agent Teams 使用约 **7 倍于标准会话的 Token**，因为每个 teammate 维护自己的完整 Context Window。建议：
- 用 Sonnet（不是 Opus）运行 teammates
- 团队保持小规模（最多 2-3 个 teammates）
- 完成后清理——活跃的 teammates 即使空闲也会消耗 Token

---

## Claude Code vs claude.ai——Token 消耗差异

### 共享配额池

**所有 Claude 产品共用同一个配额池**。你的 Pro/Max 配额被所有界面共同消耗。

### 为什么 Claude Code 消耗更多

| 因素 | claude.ai Chat | Claude Code CLI |
|------|---------------|----------------|
| 系统提示 | 极简 | ~18,000-19,000 token |
| CLAUDE.md | 无 | 2,000-42,000+ token |
| MCP 服务器 | 无 | 每个服务器都有开销 |
| 工具调用 | 无 | 每次调用 = 额外 token |
| 文件读取 | 手动粘贴 | 自动，可能读很多文件 |
| 多步任务 | 单轮 | Agent 循环：一个任务多轮 |
| 子代理 | 不支持 | 每个子代理新建 Context |

### 实际建议

跟编码无关的简单问题：
- 用 claude.ai 聊天，不要用 Claude Code
- 或在 Claude Code 中用 `/btw`——**不进入对话历史**，零 Context 成本

---

## 十二个具体节省技巧（按影响分级）

### 第一梯队：最高影响（每项 30-50% 节省）

**1. `.claudeignore` 文件 —— 减少 30-40%**

在项目根目录创建 `.claudeignore`，排除 Claude 不需要读取的目录：
```
node_modules/
.next/
build/
dist/
*.log
*.lock
coverage/
.git/
```
在 Next.js 项目中，仅排除 `.next/` 就能削减 30-40% 的 Context。

**2. `/clear` 切换任务 —— 防止复合浪费**

上一个任务的陈旧 Context 在后续每条消息中都在浪费 Token。养成习惯：完成任务 → `/clear` → 开始下一个任务。

**3. Plan Mode 处理复杂任务 —— 减少 20-30%**

按 `Shift+Tab` 进入 Plan Mode。Claude 只探索和规划，不执行变更，避免昂贵的试错迭代。对涉及 3 个以上文件的任务效果最佳。

### 第二梯队：显著影响（每项 10-25% 节省）

**4. Prompt 精确度 —— 减少 15-25%**

差的 Prompt：`"加一个登录功能"`

好的 Prompt：`"在 src/auth/login.ts 中添加邮箱/密码登录，参照 src/auth/register.ts 的 AuthService 模式。测试写在 tests/auth/login.test.ts"`

一个精确的 Prompt 实现一次过 vs. 四轮来回澄清。

**5. `/compact` 在 50% Context 时执行 —— 减少 10-15%**

不要等到 95% 的自动压缩。主动在以下时机执行：
- 探索结束、开始实现前
- 里程碑完成后
- 重大 Context 切换前

**6. CLAUDE.md 瘦身 —— 减少 5-10%（膨胀的话更多）**

从 600+ 行减到 200 行以内。将专用工作流转为 Skills。

**7. MCP 服务器管理 —— 减少 5-10%**

每个连接的 MCP 服务器都会向每条消息添加工具定义。默认不连接任何服务器，需要时再添加。用 `/mcp` 审计。

### 第三梯队：效率倍增器

**8. 模型选择**

- **Sonnet**：约 80% 的编码任务。默认选择。
- **Haiku**：子代理、探索、运行测试。便宜 80%。
- **Opus**：仅用于复杂架构、多步推理。用 `/model` 切换。

**9. Extended Thinking 控制**

默认思考预算可达数万 Token。简单任务时：
```json
{ "env": { "MAX_THINKING_TOKENS": "10000" } }
```
用 `Alt+T` / `Option+T` 切换。从 31,999 降到 10,000 可削减约 70% 的隐性推理成本。

**10. `/btw` 处理旁路问题 —— 零 Context 成本**

2026 年 3 月引入的命令。在不进入对话历史的浮层中提问：
```
/btw TypeScript 泛型的语法是什么来着？
```
用于语法检查、API 提醒、快速澄清。旁路问题最多节省 50%。

**11. 子代理处理冗长操作**

将测试运行、文档获取、日志分析委托给子代理。冗长输出留在子代理 Context 中，只有摘要返回。

**12. Hooks 预处理**

使用 Hooks 在 Claude 看到数据之前过滤。将上万行日志缩减到几百行关键信息：
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/hooks/filter-test-output.sh"
      }]
    }]
  }
}
```

---

## 进阶策略：高手怎么用

### 策略 1：Session 架构化

像 Git 分支一样管理 Session——不同工作流用不同的持久化 Context：

```bash
/rename oauth-migration      # 给 session 命名
claude --resume               # 恢复特定 session
claude --continue             # 继续最近的 session
```

### 策略 2：写手/审阅者模式

用两个并行 Session 避免自我审查偏见：

| Session A（写手） | Session B（审阅者） |
|----|----|
| `实现 API 端点的限流器` | （等待） |
| （完成） | `审查 @src/middleware/rateLimiter.ts 的限流器。检查边缘情况和竞态条件。` |
| `处理审查反馈：[粘贴 B 的输出]` | （完成） |

全新 Context 产生无偏见的代码审查。

### 策略 3：Fan-Out 大规模迁移

```bash
for file in $(cat files.txt); do
  claude -p "将 $file 从 React 迁移到 Vue。返回 OK 或 FAIL。" \
    --allowedTools "Edit,Bash(git commit *)"
done
```

非交互模式（`-p`）比交互 Session 消耗的 Token 显著更少。

### 策略 4：CLI 工具优于 MCP

`gh`、`aws`、`gcloud`、`sentry-cli` 等 CLI 工具是与外部服务交互最 Context 高效的方式——不像 MCP 服务器会增加每次工具列表的开销。

### 策略 5：交接文档（Handoff）

在复杂的跨 Session 工作中，开始新 Session 前：
1. 让 Claude 创建交接文档，总结进展、决策和下一步
2. `/clear` 清空 Session
3. 新 Session 用 `"读取 @handoff.md 并继续工作"` 开始

保留决策但不携带陈旧 Context。

### 策略 6：持续监控 Context

定期运行 `/context` 查看什么在消耗空间。实时感知会自然促进高效行为。

### 策略 7：非高峰时段工作

安排密集的 Claude Code 工作在**非高峰时段**（避开工作日太平洋时间 5-11 AM），可以获得：
- 更宽松的限额（Pro: 50-60+ 条 vs 高峰期 35-40 条）
- 更少的限流
- 每周多出 30-40% 的有效时间

---

## 按使用场景的具体建议

### Claude Code 编码

| 策略 | 说明 |
|------|------|
| 定期 `/compact` | 压缩 Context，降低单 Session 消耗 |
| 不要把不需要的文件放入 Context | 用 CLAUDE.md 和 `.claudeignore` 限定范围 |
| 重操作打包一次给 | "把这三个都做了" 比三次分开指示高效 |
| 精确描述任务 | 包含文件路径、参考模式、测试位置 |
| 探索和实现分阶段 | 探索完压缩，再开始写代码 |

### claude.ai Chat / Cowork

| 策略 | 说明 |
|------|------|
| 不要拖长对话 | 同一对话越长，单条消息消耗越大。适时开新对话 |
| 文档放入 Project | Project 使用 RAG，只加载相关内容。比每次上传大幅节省 |
| 关闭不需要的工具 | Web Search、Research、MCP 连接器消耗大量 Token。不用时关闭 |
| Extended Thinking 按需使用 | 简单任务关闭 Extended Thinking 以释放 Context 空间 |
| 注意 Cowork 共享配额 | Cowork 和 Chat 共用配额，避免不必要的并行使用 |

---

## 模型选择策略

这是**学习阶段**和**日常使用**中最容易忽视的优化点：

| 任务类型 | 推荐模型 | 理由 |
|---------|---------|------|
| 文档整理/要约 | Sonnet | Opus 的 3-5 分之一消耗，质量足够 |
| PPT/资料生成 | Sonnet | 同上 |
| 简单编码/重构 | Sonnet | 默认设置即可 |
| 文件探索/测试 | Haiku | 最便宜，足以胜任 |
| 复杂推理/战略 | Opus | 只在这里用 Opus |
| 子代理 | Haiku | 80% 成本削减 |

**切换方法**：在 Claude Code 中用 `/model` 命令随时切换。

---

## 近期变化与已知问题

### 关键时间线

| 日期 | 变化 |
|------|------|
| 2025 年 8 月 | 引入每周使用上限（影响重度用户） |
| 2026 年 3 月 | `/btw` 命令发布——旁路问题零 Context 成本 |
| 2026 年 3 月 | 高峰时段限流实施（工作日太平洋时间 5-11 AM） |
| 2026 年 3 月 | MCP 工具延迟加载改进——工具定义默认延迟加载 |

### 已知问题（2026 年 3 月）

- **配额计数不同步**：部分 Max 用户报告配额消耗速度超预期
- **Prompt 缓存损坏**：长子代理 Session 后 Context 压缩可能出现无关对话内容
- **高峰时段限制偏激**：约 7% 的用户在美国工作时间段受影响

---

## 速查表

### 必知命令

| 命令 | 用途 | Token 影响 |
|------|------|-----------|
| `/clear` | 任务间重置 Context | 防止复合浪费 |
| `/compact [指令]` | 压缩对话 | 节省 10-15% |
| `/btw` | 旁路问题，零 Context 成本 | 旁路问题节省最多 50% |
| `/context` | 查看什么在消耗 Token | 诊断工具 |
| `/cost` | 当前 Session Token 花费（API 用户） | 诊断工具 |
| `/stats` | 使用模式（订阅用户） | 诊断工具 |
| `/model` | 会话中切换模型 | 简单任务节省 60-80% |
| `/effort` | 调整推理深度 | 减少思考 Token |
| `/mcp` | 审计 MCP 服务器连接 | 移除未使用的服务器 |
| `/rewind` + 摘要 | 部分对话压缩 | 精准 Context 清理 |
| `Esc` | 中止正在进行的操作 | 避免错误路径浪费 |
| `Esc + Esc` | 打开回退菜单 | 恢复检查点 |

### Token 优化配置

```json
// ~/.claude/settings.json
{
  "model": "sonnet",
  "env": {
    "MAX_THINKING_TOKENS": "10000",
    "CLAUDE_CODE_SUBAGENT_MODEL": "haiku"
  }
}
```

### 综合效果预期

| 起始状态 | 优化后 | 削减幅度 |
|---------|--------|---------|
| 未优化基准 | 全部技巧应用 | 50-70% |
| 膨胀 CLAUDE.md（42K token） | 优化 + Skills | CLAUDE.md 部分 94% |
| 无 .claudeignore | 有 .claudeignore | 文件读取 30-40% |
| 默认思考预算 | 调至 10K | 思考 Token 70% |

### 自查清单

- 是否在同一个长对话里反复追加问题？（高消耗）
- 是否每次新对话都重新上传同一文档？（重复消耗）
- 用的什么模型？Sonnet 能做的事情是否用了 Opus？
- Cowork 和 Chat 是否同时开着？（共享配额）
- CLAUDE.md 有多少行？超过 200 行了吗？
- 有没有 `.claudeignore` 文件？
- 连接了几个 MCP 服务器？有没有不需要的？

---

## 最重要的一句话

> **不要每个任务都开一次性对话。养成用 Project 管理上下文的习惯。仅这一点就能大幅改善配额利用效率。**

---

## 参考来源

### 官方文档
- [Claude Code 最佳实践](https://code.claude.com/docs/en/best-practices)
- [有效管理成本 — Claude Code 文档](https://code.claude.com/docs/en/costs)
- [Context Windows — Claude API 文档](https://platform.claude.com/docs/en/build-with-claude/context-windows)
- [Prompt Caching — Claude API 文档](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [使用限额 — Claude 帮助中心](https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work)

### 社区指南与分析
- [Everything We Know About Claude Code Limits — Portkey](https://portkey.ai/blog/claude-code-limits/)
- [12 Proven Techniques to Save Tokens — Aslam Doctor](https://aslamdoctor.com/12-proven-techniques-to-save-tokens-in-claude-code/)
- [How I Reduced Token Consumption by 50% — 32blog](https://32blog.com/en/claude-code/claude-code-token-cost-reduction-50-percent)
- [Stop Wasting Tokens: Optimize Context by 60% — Jpranav](https://medium.com/@jpranav97/stop-wasting-tokens-how-to-optimize-claude-code-context-by-60-bfad6fd477e5)
- [My CLAUDE.md Was Eating 42,000 Tokens — Cem Karaca](https://medium.com/@cem.karaca/my-claude-md-was-eating-42-000-tokens-per-conversation-heres-how-i-fixed-it-85ffba809bd4)
- [Claude Code Skills: 98% Token Savings — CodeWithSeb](https://www.codewithseb.com/blog/claude-code-skills-reusable-ai-workflows-guide)
- [Mastering /btw, /fork, and /rewind — Rick Hightower](https://medium.com/@richardhightower/mastering-claude-codes-btw-fork-and-rewind-the-context-hygiene-toolkit-5ceefa59623d)
