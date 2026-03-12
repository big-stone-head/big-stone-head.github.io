---
layout: post
title: "从 Vibe Coding 到左右互搏：一个人用 Coding Agent 自动化研发、调研、写作的全过程（附完整 Skills 源码）"
date: 2026-03-02
lang: zh
lang_pair: "/2026/03/02/coding-agent-full-automation-ja/"
---
# 中文版

## 从 Vibe Coding 到左右互搏：一个人用 Coding Agent 自动化研发、调研、写作的全过程

> 这篇文章不讲感悟。讲我是怎么一步步走到"边看电影边让 AI 自动跑研发"这个状态的。文末附所有 Skills 源文件，你可以直接拿去用。

---

### 开场：一个周六晚上的画面

2 月最后一个周六，晚上九点多。

电视里放着电影，手边的 iPad 上在玩策略游戏。旁边笔记本电脑的终端里，Claude Code 和 Codex 正在"吵架"——

Claude Code 写了一版 Web Marketer Agent 的代码框架，Codex 审完说"架构有问题，这几个地方要改"，Claude Code 就自己改，改完再提交，Codex 再审。

我偶尔瞟一眼终端窗口，确认它们还在正常跑。

另一个终端窗口里，今天白天随手用 `/log` 记的碎片工作内容——"去医院查了背和腰"、"研究了一位知名品牌顾问的方法论"、"帮公司梳理了一份合作伙伴的战略合作方案"——已经被自动扩写成了一篇结构完整的工作日志。日志末尾还自动提炼了三条"适合发推的观点"和两个"可以深挖成文章的主题"。

不是效率高。是**工作方式变了**。

一个月前，我还在一个一个窗口里跟 AI 聊天，手动 copy-paste 上下文，一次只能推进一件事。现在这些东西全是自动跑的——研发有 AI 写 + AI 审的闭环，日志有自动扩写和内容提炼，文章有从日志素材自动生成的流水线。

这篇文章就是要把这一个月的过程掰开了讲：我是怎么一步步从"用 AI 聊天"走到"让 AI 自动干活"的。不是什么天才方案，就是一个普通人在日常工作中不断折腾的过程。

文末我会把所有 Skills 的源文件全部公开——`/log`、`/tweet`、`/article`、`/plan`、`/develop`——你 copy 过去就能用。

---

### 第一幕：CLI 对话框里的"啊哈时刻"

最早接触 Claude Code CLI，就是为了 vibe coding。

想搭个博客？跟它聊几轮，东西就出来了。想做个多平台自动发布的工具？描述一下需求，它帮你写。以前"我想做个 XXX"这种念头可能要搁置几个月——选框架、配环境、写代码，每一步都有摩擦。现在跟 AI 聊着天就把原型跑起来了。

但 vibe coding 只是开始。

真正让我觉得"这东西不一样"的，是我发现它的 plan mode 远超写代码的范畴。

有一天我在推进一个出海品牌的业务策略。传统做法是找一个安静的下午，铺开文档从头梳理——但作为一个管理者，我一天被会议切成七八块，这样的大块时间根本不存在。

那天我试了个新方法：把品牌的背景信息、之前的调研笔记、竞品资料，全部以 markdown 文档的形式放在本地一个目录里。然后在 Claude Code 里告诉它"你是我的策略顾问，根据这些材料帮我梳理一版新的运营策略"。

它先自己读了所有文件，然后问了我几个问题——"目标客群是哪类人？""预算约束是什么？""跟竞品的核心差异在哪？"

一来一回沟通了大概 10 分钟，它就开始输出了。

出来的不是那种通用的"建议你做好品牌定位、注重用户体验"的废话，而是非常具体的策略框架——锁定什么人群、用什么差异化打法、商品怎么定价、KOL 怎么合作、线上线下怎么联动。

好家伙。

因为我给了它足够的 context——不是一句话的描述，而是一整个目录的背景材料——它的产出质量远超"聊天式 AI"的水平。

**这就是那个"啊哈时刻"：AI agent 的产出质量，取决于你喂给它的 context 质量。** 不是它不够聪明，是你给的信息不够。

从那天起，我开始刻意构建自己本地电脑上的 context 体系。每个项目一个目录，CLAUDE.md 描述项目背景和约定，相关的调研文档、历史决策记录、会议纪要，全部以 .md 文件形式存好。

这个习惯看起来是"多做了一步"，实际上后面省了无数时间。

---

### 第二幕：从一个窗口到六个窗口

随着 context 越积越丰满，一个变化开始显现：**速度快得不像话了。**

以前每次启动一个新任务，得花 15-20 分钟交代背景——"我们公司是做什么的、这个项目的历史是什么、之前做过哪些尝试"。现在打开目录，AI 自己读 CLAUDE.md 和项目文件，30 秒就接上了上次的进度。

于是我开始同时开 5、6 个 Claude Code 窗口。

一个在做出海品牌的运营策略。一个在梳理跟合作伙伴的战略合作方案。一个在迭代自己的 AI 产品。一个在准备给外部顾问的汇报素材。一个在帮我写工作日志……

像什么？像一个人同时带了五六个实习生。每个实习生负责一个项目，你在他们之间来回切换，看进度、给反馈、调方向。以前这叫"管理能力"，现在它在 AI 协作中找到了新的用武之地。

真实的效率体感说一个例子。

有一家合作伙伴的高管多次表达了深度合作的意愿。这个信息不是只有我知道——负责跟进的团队也知道。但如果我不跳出来推一步，这个组织里大概率就没有人会碰这件事。

我用 Claude Code 花了不到 1 小时，把双方的业务信息、互补优势、合作可能的方向、具体的推进步骤全部梳理了出来。一份完整的战略合作方案初稿。

然后我想：团队里其他人面对同样的信息，没有任何一个人花哪怕 10 分钟让 AI 帮忙理一理。

这不是能力问题——谁都能做到。根源更复杂：可能是"这不是我的 KPI"，可能是职责边界感太强，可能是根本没有用 AI 辅助工作的习惯。

但这件事让我意识到一个更深层的东西：**AI 把"做一件事"的成本降到了几乎为零，但"决定要不要做这件事"的意愿——AI 帮不了。**

未来对人的核心要求，不是"会不会用 AI"，而是：你有没有更强的好奇心？你愿不愿意主动动手去试？你有没有胆子突破自己岗位的 scope、去碰那些"不一定是你的活、但做了就有价值"的事情？

这是"发起力"。执行力 AI 已经帮你民主化了，接下来拼的是发起力。

当然，速度快了，新瓶颈也来了。

**AI 产出越多，我的阅读和审阅就成了卡点。** 五六个窗口并行跑，每个都在产出方案、文档、代码。全都等着我来验收。AI 把"从 0 到 0.7"的效率拉满了，但"从 0.7 到 1.0"——也就是读、判断、调优——这个环节反而成了生产力的最大瓶颈。

一边是 N 个 AI 产出的文档等着审阅，一边是 N 个员工等着 1on1。两边都需要"我本人在场"，没法并行。

这个问题困扰了我一阵子。后面会讲我是怎么解决的。

---

### 第三幕：把碎片记录变成内容资产

每天多线程工作，大量有价值的思考和经历散落在脑子里来不及记录。

这是一个很现实的问题。早上开完会有个好想法，下午推完项目有个新洞察，晚上跟 AI 折腾出了个有意思的工作方法——但到写总结的时候，一半都忘了。

于是我开始构建自己的内容 Skills。

**什么是 Skills？** 简单说就是你预先写好的一组指令，存在 `.claude/commands/` 目录下。之后在 Claude Code 里输入 `/命令名` 就能直接触发，不用每次重新描述需求。

第一个做的是 **`/log`**。

工作一天下来，我把零散的碎片扔进去——"今天做了什么什么、遇到了什么问题、有个什么想法"——几句话就行，甚至可以很粗糙。`/log` 会自动：

1. 用 `date` 命令获取准确日期（不用我自己算今天周几）
2. 把碎片内容扩写成结构完整的日志——成果、学习收获、遇到的问题、明日计划、随想心得
3. 自动提炼"适合发推的观点"和"可以深挖成文章的主题"
4. 按 `logs/YYYY-MM/YYYY-MM-DD.md` 的路径存好

看到没？最后那一步很关键——**每篇日志末尾自动提炼内容方向**。这意味着日志不只是"记录"，而是在帮我积累未来文章和推文的素材库。

然后是 **`/tweet`**。

写推文不是随便写几句话就行。不同平台的字数限制和表达习惯完全不同。`/tweet` 的做法是：

- 我给一个主题或观点
- 它会自动去 `logs/` 目录里找相关素材（真实经历和案例）
- 然后同一个主题生成两个独立版本：300 字版（适合公众号、LinkedIn、Note）和 140 字版（适合 X/Twitter）
- 短版本不是长版本的删减，是独立写的——因为短内容和长内容的表达逻辑根本不一样

最后是 **`/article`**。

当日志积累到一定量——比如一两周——里面自然就沉淀了好几个值得深挖的主题。`/article` 做的事情是：

- 从 `logs/` 和 `summaries/` 目录里自动提取相关素材
- 搭建文章框架（引言 + 3-4 个主体部分 + 结语）
- 撰写 5000-8000 字的长文
- 每个部分都有真实经历支撑，不是空洞的观点输出

**三个 Skills 串起来，形成了一条自动化的内容流水线：**

碎片输入 → `/log` → 结构化日志（含素材提炼）→ `/tweet` → 社交媒体内容 → `/article` → 深度长文

你现在读的这篇文章，就是这条流水线的产物。我过去一个月的日志里积累了关于"左右互搏"、"context 积累"、"发起力"等话题的大量素材，今天用 `/article` 把它们串成了一篇完整的文章。

这里有一个更大的启发。

**这个时代的 go-to-market 变了。**

以前做市场推广，你需要一个团队——市场部写内容、设计做物料、运营发渠道。一篇文章从选题到发布可能要一周。

现在？每个 builder 都可以把自己的真实实践过程变成内容，通过持续发布来建立信任和影响力。不需要市场团队，不需要写手，你自己的日常工作本身就是最好的内容素材。

这篇文章本身就是证明。

---

### 第四幕：左右互搏——让 AI 审 AI

回到第二幕的瓶颈：AI 产出多了，人审不过来。怎么办？

答案其实很暴力：**让 AI 审 AI。**

我在二月底配置了一套 Claude Code + Codex CLI 的"左右互搏"工作流。核心思路很简单：

- **Claude Code** 负责思考和执行——理解需求、做规划、写代码、写文档
- **Codex CLI** 负责审核和测试——review 代码质量、跑测试、找问题
- 审核不通过？自动返工。改完再提交。循环往复，直到通过。

具体分成两个 Skills：

**`/plan` —— 方案制定 + 自动评审**

你跟 Claude Code 聊需求——做什么？给谁用？解决什么问题？技术栈？约束条件？聊清楚之后，它写一份技术方案。

然后——关键来了——方案自动提交给 Codex 评审。

Codex 扮演"资深技术架构师"的角色，从五个维度审方案：架构合理性、需求覆盖度、风险评估、可行性、测试策略。

审完返回两种结果：`APPROVED`（通过）或 `NEEDS_REVISION`（需要修改）。

如果需要修改，Codex 会逐条列出问题。然后 Claude Code 读这些反馈，逐条修改方案，改完再提交。

最多循环 5 轮。

整个过程我只需要在最开始参与需求沟通，后面的"写方案 → 审方案 → 改方案"循环是全自动的。

**`/develop` —— 并行开发 + 自动测试**

方案通过之后，输入 `/develop`。

Claude Code 根据方案中的模块划分，创建 Agent Team——比如一个前端 agent、一个后端 agent、一个测试 agent——并行开发。

开发完成后，自动进入 Codex Review + Test 循环：

1. Codex 做 Code Review——检查正确性、安全性、性能、代码质量、架构一致性
2. Codex 跑所有测试——typecheck、lint、单元测试、E2E 测试
3. Review 和测试都通过？结束。有问题？列出来，Claude Code 自动修，修完再提交
4. 最多循环 8 轮

整个开发过程中，所有决策、评审记录、bug 记录都自动写入 `.claude/memory/MEMORY.md`——这本身又成了 context 的积累，形成飞轮。

**实战效果怎么样？**

2 月 28 日，我用这套工作流搭了一个 Web Marketer Agent 的框架。从零开始，全程自动，零 bug。就是开头说的那个场景——我在看电影，它们在自己跑。

**而且不止是 coding。**

同样的思路可以用在调研和文档工作上。让一个 agent 做调研产出文档，另一个 agent 审核信息的准确性、逻辑的完整性、有没有遗漏关键角度。

回到之前那个"战略合作方案"的场景——如果我当时不只是让 Claude Code 写方案，还让 Codex 审方案，那我连"花两小时深夜验收"这个环节都可以大幅压缩。

**验收的活儿，从人转移到了 AI。**

这就是"左右互搏"解决的核心问题：单个 AI 的产出质量有上限，两个 AI 的对抗可以突破这个上限。人从"执行者"和"审阅者"双重角色中解放出来，只需要在最开始给方向、最后确认结果。

---

### 第五幕：效率变了，"野心"也变了

回头看这一个月的变化，有几个感受很真实。

**效率的变化不是"快了百分之多少"，而是"以前不敢想的事情现在敢做了"。**

以前觉得"一个人同时推进品牌策略、产品研发、战略合作、内容创作"是天方夜谭。现在它是我的日常。不是因为我变厉害了，是因为执行环节被 AI 接管了。

**"野心"在膨胀。**

当执行成本接近零，你会发现自己想做的事情突然变多了。以前很多 idea 被"没时间做"挡住——现在这个门槛消失了。每个想法都可以用极低成本先跑一版看看。想做个面向日本 Web Marketer 的 Agent？让 AI 搭个框架试试。想研究某个领域大佬的方法论并应用到自己的项目？花 20 分钟让 AI 帮你梳理。想把日常工作经验写成文章？`/log` + `/article` 就行。

以前很多想法死在了"没精力执行"这一步。现在执行成本几乎为零，idea 的成活率暴增。

**对"超级个体"的重新理解。**

"超级个体"不是一个人干所有的活——那是超人，不是超级个体。

超级个体是**一个人能发起更多的事情**。AI 是你的执行团队，你是那个"发起者"——发现机会、做出判断、给出方向。然后 AI 帮你把每一个方向都跑出一个结果。

你不需要成为最强的开发者、最好的写手、最专业的分析师。你需要的是：**懂得什么值得做，敢于去发起，然后让 AI 把执行做好。**

**最后说一句可能有点鸡汤但我真这么想的话。**

这些工具不是为了让你的工作更轻松。说实话，我现在比以前更忙了——因为能做的事情变多了。

它们的真正价值是：**让你有机会看到并尝试更多之前想做但不能做的事情。**

以前被"没时间"、"不会写代码"、"一个人做不了这么多事"挡住的可能性，现在挡不住了。

这才是 AI 时代对"人"的意义——不是替代你的工作，是扩展你的人生带宽。你可以体验更多、尝试更多、创造更多。

不是效率工具。是人生扩展包。

所以，不需要你会写代码。Claude Code CLI 本身就是跟你聊天的。不需要你是技术专家。你需要的只是一个周末的折腾时间，和一点"我试试看"的好奇心。

下面我把所有 Skills 的源文件全部公开。Copy 过去就能用。

---

### 附录：完整 Skills 源码与安装指南

#### 准备工作

1. **安装 Claude Code CLI**：按照 [官方文档](https://docs.anthropic.com/en/docs/claude-code) 安装
2. **安装 Codex CLI**（如果需要左右互搏功能）：按照 [OpenAI Codex CLI 文档](https://github.com/openai/codex) 安装
3. **创建目录结构**：

```
你的项目目录/
├── .claude/
│   └── commands/          ← 项目级 Skills 放这里
│       ├── log.md
│       ├── tweet.md
│       ├── article.md
│       └── summary.md
├── logs/                  ← 日志存放目录
│   └── YYYY-MM/
├── articles/              ← 文章存放目录
├── tweets/                ← 推文存放目录
├── summaries/             ← 工作总结存放目录
├── templates/             ← 模板目录
└── CLAUDE.md              ← 项目级 AI 指令配置
```

全局 Skills（跨项目使用）放在 `~/.claude/commands/` 下：

```
~/.claude/
└── commands/              ← 全局 Skills 放这里
    ├── plan.md
    └── develop.md
```

#### Skill 1：`/log` —— 碎片记录 → 结构化日志

**文件路径**：`.claude/commands/log.md`

**使用方法**：`/log 今天做了XXX，遇到了XXX问题，有个想法是XXX`

```markdown
# 工作日志记录

将用户提供的工作内容和心得扩写成结构化的工作日志。

## 执行步骤

1. **获取当前日期和星期**：先通过 `date` 命令获取准确的日期和星期（例如 `date '+%Y-%m-%d %A'`），**禁止自行推算星期几**，必须使用系统命令的结果
2. **解析用户输入**：识别用户提供的工作内容、成果、问题、心得等
3. **扩写日志内容**：
   - 将简短的描述扩展成完整的段落
   - 补充可能的上下文和细节
   - 保持真实，不编造用户未提及的信息
4. **按模板整理**：参考 `templates/daily-log.md` 模板结构
5. **保存日志**：
   - 路径：`logs/YYYY-MM/YYYY-MM-DD.md`
   - 如果目录不存在，先创建
   - 如果当天日志已存在，询问用户是追加还是覆盖

## 日志结构

- 基本信息（日期、星期）
- 今日成果（主要完成事项、项目进展）
- 学习收获（新知识/技能、经验总结）
- 遇到的问题（问题描述、解决方案）
- 明日计划（优先事项、待跟进事项）
- 随想与心得（深度思考和感悟）
- 可沉淀的内容（适合发推的观点、可深挖的主题）

## 写作原则

- 使用中文撰写
- 保持用户原有的表达风格
- 适当扩展但不过度润色
- 突出可能有价值的洞察点

## 用户输入

$ARGUMENTS
```

#### Skill 2：`/tweet` —— 日志 → 社交媒体双版本内容

**文件路径**：`.claude/commands/tweet.md`

**使用方法**：`/tweet AI时代的发起力` 或 `/tweet 左右互搏工作流的实践体验`

```markdown
# 社交媒体内容生成

基于指定主题，生成两个版本的社交媒体推文：300字长版本和140字短版本。

## 执行步骤

1. **理解主题**：
   - 解析用户指定的主题或观点
   - 如有需要，从相关工作日志中提取素材

2. **查找素材**：
   - 在 `logs/` 中搜索与主题相关的内容
   - 提取真实经历、数据和案例

3. **撰写推文**：
   - 核心观点突出
   - 用真实经历支撑
   - 结尾有启发性或引发思考

4. **优化打磨**：
   - 每个角度/主题生成两个版本：
     - **300字版本**（280-320字）：完整叙事，适合微信公众号、Note、LinkedIn 等长内容平台
     - **140字版本**（120-140字）：精炼金句，适合 X/Twitter（单条推文上限140字）
   - 确保两个版本各自独立成篇，短版本不是长版本的简单删减
   - 提供 2-3 个角度/主题供选择，每个角度各含300字和140字版本

5. **保存文件**：
   - 路径：`tweets/YYYY-MM-DD-topic.md`
   - 包含正式版本和备选版本

## 推文结构

- **开头（Hook）**：吸引注意力的第一句
- **主体**：核心观点 + 经历/案例支撑
- **结尾**：启发性思考或行动号召

## 写作原则

- 一篇推文只聚焦一个核心观点
- 用个人真实经历增加可信度
- 避免说教，用故事和例子说话
- 语言自然，不要过于正式或营销感
- 适当留白，给读者思考空间

## 推文风格参考

- 分享个人真实工作经验和反思
- 传递有价值的认知或方法
- 引发共鸣或讨论
- 建立专业可信的个人形象

## 主题

$ARGUMENTS
```

#### Skill 3：`/article` —— 日志积累 → 深度长文

**文件路径**：`.claude/commands/article.md`

**使用方法**：`/article 从Vibe Coding到左右互搏的自动化工作方式演进`

```markdown
# 公众号长文撰写

基于指定主题，撰写 5000-8000 字的深度文章。

## 执行步骤

1. **理解主题**：
   - 明确文章要解决的核心问题
   - 确定目标读者群体
   - 定位文章的独特视角

2. **收集素材**：
   - 从 `logs/` 中提取相关经历和案例
   - 从 `summaries/` 中找到相关总结
   - 整理可用的数据和例子

3. **制定大纲**：
   - 设计文章结构（引言 + 3-4 个主体部分 + 结语）
   - 每部分规划 1000-1500 字
   - 确保逻辑清晰、层层递进

4. **撰写正文**：
   - 引言：切入痛点，引起共鸣
   - 主体：观点 + 案例 + 方法
   - 结语：总结 + 行动建议

5. **优化打磨**：
   - 检查逻辑连贯性
   - 增强标题和小标题吸引力
   - 确保字数达标（5000+）

6. **保存文件**：
   - 路径：`articles/YYYY-MM-DD-title.md`
   - 包含大纲和正文

## 文章结构

### 引言（500-800字）
- 引入问题/痛点
- 建立与读者的连接
- 预告文章价值

### 主体（3000-5000字）
- 第一部分：问题分析/背景
- 第二部分：核心观点/方法
- 第三部分：具体做法/案例
- 第四部分：常见误区/进阶建议

### 结语（500-800字）
- 核心观点总结
- 行动建议
- 开放性思考

## 写作原则

- **有深度**：不是信息搬运，而是独特洞察
- **有案例**：用真实经历支撑观点
- **有方法**：给读者可操作的建议
- **有温度**：个人视角，真诚表达
- **有节奏**：长短句结合，段落适中

## 质量标准

- 开头 3 段能留住读者
- 每个部分都有实质内容
- 读完有收获感
- 值得收藏和分享

## 主题

$ARGUMENTS
```

#### Skill 4：`/summary` —— 日志 → 工作汇报

**文件路径**：`.claude/commands/summary.md`

**使用方法**：`/summary 本周` 或 `/summary 2026-02`

```markdown
# 工作总结生成

根据指定时间范围内的工作日志，生成工作汇报总结。

## 执行步骤

1. **解析时间范围**：
   - 理解用户指定的时间范围（如"本周"、"上个月"、"2026-01"、"Q1"等）
   - 转换为具体的起止日期

2. **读取日志文件**：
   - 扫描 `logs/` 目录下对应时间段的所有日志
   - 按时间顺序整理

3. **分析和汇总**：
   - 提取所有主要成果和里程碑
   - 归纳学习收获和能力提升
   - 整理遇到的问题和解决方案
   - 识别跨日志的主题和趋势

4. **生成总结**：
   - 参考 `templates/summary.md` 模板
   - 突出重点成果和关键数据
   - 包含个人反思和下阶段计划

5. **保存文件**：
   - 路径：`summaries/YYYY-MM-summary.md` 或 `summaries/YYYY-Qn-summary.md`
   - 同时输出给用户便于直接使用

## 总结结构

- 总结周期和基本信息
- 核心成果（重点项目、关键指标、里程碑）
- 能力提升（技能成长、认知升级）
- 问题与挑战
- 协作与沟通亮点
- 下阶段计划
- 个人反思

## 写作原则

- 数据驱动，有具体成果支撑
- 突出价值和影响
- 适合向上级或团队汇报
- 简洁有力，避免流水账

## 时间范围

$ARGUMENTS
```

#### Skill 5：`/plan` —— CC 写方案 + Codex 评审循环

**文件路径**：`~/.claude/commands/plan.md`（全局 Skill，所有项目都能用）

**使用方法**：`/plan`（然后跟 Claude Code 聊需求即可）

**前置要求**：已安装 Codex CLI

```markdown
---
description: "Phase 1: 需求沟通 → 方案制定 → Codex 评审循环。与你讨论需求、搜索信息、写技术方案，然后自动提交 Codex 评审，根据反馈修改，直到 APPROVED。"
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, TodoWrite, WebSearch, WebFetch
---

# Phase 1: 需求 → 方案 → Codex 评审

## 0. 初始化项目 Memory

每个项目有自己的 Memory。首次运行时自动创建：

` ` `bash
mkdir -p .claude/memory .claude/plans .claude/reviews .claude/bugs .claude/logs

if [ ! -f .claude/memory/MEMORY.md ]; then
  cat > .claude/memory/MEMORY.md << 'MEMEOF'
# PROJECT MEMORY

> 共享记忆文档。所有 Agent（Claude Code / Agent Teams teammate / Codex）开始前读、完成后写。

---

## 1. 项目概述
- **项目名称**: [待定]
- **创建时间**: [待定]
- **当前阶段**: 需求沟通 → 方案制定 → 方案评审 → 开发 → Review/测试 → 交付

## 2. 需求记录
### 2.1 用户原始需求
### 2.2 澄清与补充
### 2.3 确定的功能清单

## 3. 技术决策
### 3.1 技术栈
### 3.2 架构设计
### 3.3 关键决策及理由

## 4. 方案评审记录

| 轮次 | 时间 | Codex 结论 | 关键反馈 |
|------|------|-----------|---------|

## 5. 开发进度

| 任务 | Agent | 分支 | 状态 | 备注 |
|------|-------|------|------|------|

## 6. Review & 测试记录

| 轮次 | Code Review | 测试 | 详情文件 |
|------|------------|------|---------|

## 7. Bug 清单

| ID | 描述 | 严重度 | 状态 | 修复轮次 |
|----|------|--------|------|---------|

## 8. 经验教训
### 有效做法
### 踩过的坑

## 9. 变更日志

| 时间 | 更新者 | 内容 |
|------|--------|------|

MEMEOF
  echo "Memory 初始化完成"
fi
` ` `

## 1. 需求沟通（与用户对话）

与用户深入讨论，搞清楚：

1. **核心目标**: 做什么？给谁用？解决什么问题？
2. **功能清单**: 具体功能、优先级
3. **技术栈**: 框架、版本、部署方式
4. **约束条件**: 性能、兼容性、时间

沟通过程中：
- 主动用 **WebSearch** 搜索最佳实践、库版本、技术对比
- 把讨论要点实时写入 `.claude/memory/MEMORY.md` 的「需求记录」部分

## 2. 撰写技术方案

需求确认后，写 `.claude/plans/current-plan.md`，包含：

- 项目概述
- 架构设计（文字+ASCII图）
- 技术栈（具体到版本号）
- 模块划分与 Agent Teams 分配
- 数据模型
- API 设计
- 测试策略
- 风险与注意事项

写完后**先给用户看**，获得用户确认后才进入 Codex 评审。

## 3. Codex 评审循环（用户确认后自动执行）

逻辑：提交方案给 Codex → 解析结论 → APPROVED 则结束，NEEDS_REVISION 则修改方案后重新提交。最多 5 轮。

` ` `bash
MAX_ROUNDS=5
for ROUND in $(seq 1 $MAX_ROUNDS); do
  echo ""
  echo "━━━ Codex 方案评审 第 ${ROUND}/${MAX_ROUNDS} 轮 ━━━"

  PLAN=$(head -c 6000 .claude/plans/current-plan.md)

  REVIEW=$(codex exec "You are a senior technical architect reviewing an implementation plan.

## Plan to Review
${PLAN}

## Review Instructions
Evaluate this plan on:
1. Architecture soundness — any anti-patterns?
2. Completeness — all requirements covered?
3. Risks — security, performance, scalability?
4. Feasibility — is the agent task decomposition realistic?
5. Testing — adequate strategy?

## Response Format
Start with EXACTLY one of these two lines:
VERDICT: APPROVED
VERDICT: NEEDS_REVISION

Then provide detailed feedback. If NEEDS_REVISION, number each item to fix." \
    --full-auto --sandbox read-only --skip-git-repo-check 2>&1) || true

  echo "$REVIEW" > ".claude/reviews/plan-review-r${ROUND}.md"

  if echo "$REVIEW" | grep -qi "VERDICT:.*APPROVED"; then
    echo "方案通过 Codex 评审！（第 ${ROUND} 轮）"
    echo "| ${ROUND} | $(date '+%m-%d %H:%M') | APPROVED | — |" >> .claude/memory/MEMORY.md
    break
  else
    echo "Codex 要求修改（第 ${ROUND} 轮），反馈如下："
    cat ".claude/reviews/plan-review-r${ROUND}.md"
    echo "| ${ROUND} | $(date '+%m-%d %H:%M') | NEEDS_REVISION | 见 plan-review-r${ROUND}.md |" >> .claude/memory/MEMORY.md
    # Claude Code：读反馈 → 逐项修改 current-plan.md → 继续下一轮
  fi
done
` ` `

**每轮你要做的事**：
1. 仔细阅读 Codex 的每条反馈
2. 修改方案解决每个问题
3. 更新 Memory 评审记录
4. 继续循环

## 完成标志

- Codex 返回 APPROVED
- `.claude/plans/current-plan.md` 是最终版方案
- Memory 已更新
- 告诉用户：**"方案已通过 Codex 评审，输入 /develop 开始开发。"**
```

#### Skill 6：`/develop` —— Agent Teams 开发 + Codex Review/Test 循环

**文件路径**：`~/.claude/commands/develop.md`（全局 Skill）

**使用方法**：`/develop`（前提：`/plan` 已完成并通过评审）

**前置要求**：已安装 Codex CLI，`/plan` 已完成

```markdown
---
description: "Phase 2: Agent Teams 并行开发 → Codex Code Review + 测试 → 反馈修复循环，直到全部通过。前提：/plan 已完成。"
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, TodoWrite
---

# Phase 2: Agent Teams 开发 → Codex Review/Test 循环

## 0. 前置检查

` ` `bash
# 确认方案已通过评审
if ! ls .claude/reviews/plan-review-r*.md 1>/dev/null 2>&1 || \
   ! grep -rqi "VERDICT:.*APPROVED" .claude/reviews/plan-review-r*.md 2>/dev/null; then
  echo "方案尚未通过 Codex 评审，请先运行 /plan"
  exit 1
fi

# 确认 Codex 可用
if ! command -v codex &>/dev/null; then
  echo "Codex CLI 未安装"
  exit 1
fi

# 阅读 Memory 和方案
cat .claude/memory/MEMORY.md
cat .claude/plans/current-plan.md

# 创建开发分支
BRANCH="dev/$(date +%Y%m%d-%H%M%S)"
git checkout -b "$BRANCH" 2>/dev/null || true
echo "分支: $BRANCH"
` ` `

## 1. Agent Teams 并行开发

根据 `.claude/plans/current-plan.md` 中的模块划分，创建 Agent Team。

所有 teammate 的规则：
- 开始前必须阅读 .claude/memory/MEMORY.md
- 完成后必须更新 Memory 的「开发进度」部分
- 不同 teammate 不要修改同一个文件
- 遵循方案中的技术栈和架构
- 每完成一个独立功能就 git commit

**等待所有 teammate 完成开发。**

## 2. Codex Review + Test 循环

开发完成后自动循环：Codex 审查 + 测试 → 有问题则修复 → 再提交，直到全过。

` ` `bash
MAX_ROUNDS=8
ROUND=0
ALL_PASS=false

while [ $ROUND -lt $MAX_ROUNDS ] && [ "$ALL_PASS" = false ]; do
  ROUND=$((ROUND + 1))
  echo ""
  echo "Codex Review & Test — 第 ${ROUND}/${MAX_ROUNDS} 轮"

  # Part A: Code Review
  echo "Code Review..."

  DIFF_STAT=$(git diff main --stat 2>/dev/null || git log --oneline -10 2>/dev/null || echo "No diff")
  CHANGED_FILES=$(git diff main --name-only 2>/dev/null || git diff HEAD~10 --name-only 2>/dev/null || echo "")

  CODE_CONTENT=""
  for f in $CHANGED_FILES; do
    if [ -f "$f" ]; then
      CODE_CONTENT+="
=== FILE: $f ===
$(head -200 "$f")
"
    fi
  done
  CODE_CONTENT=$(echo "$CODE_CONTENT" | head -c 8000)

  REVIEW_RESULT=$(codex exec "You are a senior code reviewer. Review these code changes.

## Changed Files Summary
${DIFF_STAT}

## Code Content
${CODE_CONTENT}

## Review Criteria
1. Correctness: logic errors, edge cases, null/undefined handling
2. Security: input validation, injection risks, auth checks
3. Performance: N+1 queries, re-renders, memory leaks
4. Code Quality: naming, DRY, error handling, type safety
5. Architecture: does implementation match intended design?

## Response Format
Start with EXACTLY one of:
VERDICT: APPROVED
VERDICT: NEEDS_FIX

If NEEDS_FIX, list each issue as:
[CRITICAL/MAJOR/MINOR] file:line — description — suggested fix" \
    --full-auto --sandbox read-only --skip-git-repo-check 2>&1) || true

  echo "$REVIEW_RESULT" > ".claude/reviews/code-review-r${ROUND}.md"

  REVIEW_OK=false
  if echo "$REVIEW_RESULT" | grep -qi "VERDICT:.*APPROVED"; then
    REVIEW_OK=true
    echo "  Code Review PASSED"
  else
    echo "  Code Review: 发现问题"
  fi

  # Part B: 运行测试
  echo "Running Tests..."

  TEST_RESULT=$(codex exec "You are a QA engineer. Run ALL available tests in this project.

Instructions:
1. Check what test frameworks are configured (package.json, pyproject.toml)
2. Run all available checks:
   - npm run typecheck (if exists)
   - npm run lint (if exists)
   - npm test / npx jest / npx vitest run
   - npx playwright test (if playwright.config exists)
   - python -m pytest (if Python tests exist)
3. If no tests exist yet, report that clearly

## Response Format
Start with EXACTLY one of:
VERDICT: ALL_PASS
VERDICT: HAS_FAILURES

Then: total/passed/failed counts, and failure details with file locations." \
    --full-auto --sandbox workspace-write --skip-git-repo-check 2>&1) || true

  echo "$TEST_RESULT" > ".claude/reviews/test-result-r${ROUND}.md"

  TEST_OK=false
  if echo "$TEST_RESULT" | grep -qi "VERDICT:.*ALL_PASS"; then
    TEST_OK=true
    echo "  Tests ALL PASSED"
  else
    echo "  Tests: 存在失败"
  fi

  # 判断结果
  if [ "$REVIEW_OK" = true ] && [ "$TEST_OK" = true ]; then
    ALL_PASS=true
    echo ""
    echo "第 ${ROUND} 轮：Code Review + 测试 — 全部通过！"
  else
    echo ""
    echo "第 ${ROUND} 轮存在问题，需要修复..."
    # Claude Code：读反馈 → 修复 → commit → 更新 Memory → 继续循环
  fi
done

if [ "$ALL_PASS" = true ]; then
  echo "全部完成！Review + 测试通过"
  echo "分支: $(git branch --show-current)"
else
  echo "达到 ${MAX_ROUNDS} 轮上限，请查看 .claude/bugs/ 手动处理"
fi
` ` `

## 每轮修复时你要做的

1. **读取** 反馈文件
2. **理解** 每个 CRITICAL 和 MAJOR 问题的根因
3. **修复** 代码 — 所有 CRITICAL 和 MAJOR 必须修
4. **本地验证** — lint / typecheck
5. **Commit** — `git commit -am "fix: address round N feedback"`
6. **更新** Memory
7. 继续循环

## 完成标志

- Codex Review: APPROVED + Tests: ALL_PASS
- Memory 已更新
- 告诉用户：**"开发完成，Review + 测试全部通过。分支: xxx"**
```

---

#### 快速上手

最简单的开始方式：

1. 把 `/log` 的内容保存到你任意一个项目的 `.claude/commands/log.md`
2. 创建 `logs/` 目录
3. 在 Claude Code 里输入 `/log 今天试了一下用AI写日志，感觉还不错`
4. 看看生成的结果

就这么简单。

如果觉得好用，再把 `/tweet`、`/article` 加上，形成你的内容流水线。

如果你是开发者，想试左右互搏，把 `/plan` 和 `/develop` 放到 `~/.claude/commands/` 下，确保 Codex CLI 已安装，然后在你的项目里输入 `/plan` 开始。

---

*写于 2026 年 3 月 2 日。一个月前还在一个窗口里跟 AI 聊天。一个月后边看电影边让两个 AI 互相审代码。变化来得比你以为的快。*
