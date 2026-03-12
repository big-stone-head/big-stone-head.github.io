---
layout: post
title: "春节宅家\"养龙虾\"：我把游戏掌机变成了AI员工"
date: 2026-02-16
lang: zh
lang_pair: "/2026/02/16/openclaw-lobster-farming-guide-ja/"
---
## 正文

![封面：游戏掌机上的AI龙虾](pic/2026-02-16-openclaw-lobster-farming-guide_01_ai.png)

### 引言：春节还是那个春节，但今年多了一只龙虾

春节还是那个春节。

但今年多了一个新玩具——OpenClaw。

你知道那种感觉吗？收藏夹里攒了一堆"等有空再看"的东西，平时忙得根本没空碰，一到假期就跟开闸放水似的，恨不得全部消灭掉。今年春节我的第一个"开闸"项目，是一个听起来有点离谱的计划：**把我的联想Legion Go游戏掌机，改造成一台AI Agent服务器。**

什么叫"养龙虾"？OpenClaw——最近火得一塌糊涂的开源AI Agent平台——它的logo是一只龙虾钳子。所以圈内管在自己设备上跑OpenClaw叫"养龙虾"。我要做的事情就是：把一台本来用来玩《博德之门3》的掌机，变成一只住在飞书里的龙虾。

听起来离谱吧？但做起来，真就不到30分钟。

而且刚养上没两天，OpenAI就"收购"了OpenClaw创始人。因为刚亲手折腾过，看到新闻的一瞬间就觉得——哦，难怪。

这篇文章，就是从这只龙虾讲起的。

---

### 第一幕：Windows的"水土不服"——怪不得Mac Mini卖疯了

![Windows的混乱 vs Mac的秩序](pic/2026-02-16-openclaw-lobster-farming-guide_02_ai.png)

先交代一下"案发现场"。

我有一台联想Legion Go。不知道的朋友简单科普一下——这是联想出的一款Windows游戏掌机，8.8寸大屏，AMD的处理器，16GB内存，手柄能拆下来当控制器，接上显示器就是一台mini PC。类似Switch，但跑的是完整的Windows 11。当然也有steamOS版本。（这不是一个广告哈哈哈）

说实话，这台掌机买来之后，游戏没玩几个。一直在那儿吃灰。看着它我就想：与其让你躺着长蘑菇，不如让你去上班——跑个AI Agent，当我的7x24小时私人助手。

然后我就领教了什么叫Windows的"水土不服"。

想在Windows上跑一个Node.js后台服务，你得面对的是什么呢？

Windows Defender会把你的进程当病毒杀掉。PowerShell和cmd两套命令行互相打架。半夜三点系统自动更新给你重启了。文件路径里的反斜杠和正斜杠永远在互相拆台。还有各种"这个Linux工具在Windows上不支持"——

**怪不得Mac Mini M4一出来就火爆到断货。**

不是Mac有多好，是Windows跑各种coding CLI、跑openclaw这件事，真是有点恶心人。Mac用户？终端一开，brew一装，完事儿。两个字：省心。而Windows呢？两个字：折腾。

好在Windows有一根救命稻草：**WSL**

---

### 第二幕：Docker的"理想"与WSL的"现实"

我最初的计划是用Docker。

毕竟嘛，Docker是"标准做法"。容器化部署、环境隔离、一键启动，

现实是：在Legion Go上跑Docker Desktop，就像让一个体重200斤的人去挤地铁——技术上可行，体验上要命。Windows 11自己吃掉4-5GB内存，Docker Desktop再吃个2-3GB，16GB的内存就去了小一半，留给OpenClaw的跟施舍似的。更别提过程中还是会遇到各种小问题，且每一步都要花很长时间“等待”。

我跟Docker斗争了大概45分钟之后，做出了一个务实的决定：

**算了。**

毕竟是自己用的东西，不是给客户做交付。何必跟自己过不去？

最终我选了最朴素的方案：直接在WSL Ubuntu里裸跑OpenClaw。不套娃了，就一层Linux，简单粗暴。

事实证明这是对的。从零开始到飞书里收到龙虾的第一条回复，**总共不到30分钟**。

![Docker Desktop vs WSL：两种部署方案对比](pic/2026-02-16-openclaw-lobster-farming-guide_05_html.png)

（具体教程放在文末的参考部分了，想自己动手的朋友直接翻到最后照着做就行。）

看到飞书里龙虾回复了第一条消息的时候，说实话还挺有成就感的。一台吃灰的游戏掌机+一个开源项目+一个聊天软件——组合出一个私人AI助手。这感觉，怎么说呢，就像用乐高拼了一台能跑的车。

---

### 第三幕：给龙虾找个便宜的"大脑"

OpenClaw装好了，飞书也连上了。接下来就是最核心的问题：**用什么LLM当龙虾的大脑？**

OpenClaw官方推荐的是Claude Opus 4.5——效果确实没得说。但我有一个非常现实的问题：

**我在国内，科学上网资源有限。**

具体来说，VPN同时只能在一个PC终端上用。白天干活的Mac得挂着，不可能把VPN让给一台"养着玩"的掌机。而Legion Go跑OpenClaw是7x24小时的事儿。

总不能为了一只龙虾，让干活的机器断网吧？

这就逼出了一个务实的选择：用国内的大模型。

好在这两年国内大模型的性价比确实上来了。我最终选了**Kimi K2.5**，买了个每月199元的Kimi for Coding套餐。

为什么是它？理由很朴素：

第一，国内直连，不需要VPN，延迟低。第二，199块/月，对一只"养着玩"的龙虾来说绰绰有余。第三，之前在AI Coding Agent横评里测过Kimi——在需求明确的场景下，这小伙子手脚很麻利。

当然了，Kimi跟Claude比还是有差距的。之前写过一篇AI编程助手横评，Kimi是那种"开会时第一个举手发言，但别人一说'我觉得不太对'就立刻改口"的类型。但当一个日常助手的大脑？够用了。毕竟龙虾不需要当首席架构师，能帮忙查资料、整理信息、回答一些简单问题就很好了。

**用199块的大脑跑一只7x24小时在线的AI助手，性价比这块儿，拿捏得死死的。**

![LLM大脑选择：给龙虾找个便宜的大脑](pic/2026-02-16-openclaw-lobster-farming-guide_06_html.png)

说到这里不禁感叹：科学上网限制确实是个生产力障碍。同样一件事，海外用户配个Claude API Key就完事了，国内得多绕一大圈。但换个角度想——正是这个限制，反而有了"被迫体验国产大模型"的机会。算是因祸得福？

---

### 第四幕："裸机"到"能打"——你以为装完就无所不能了？

龙虾养上了，飞书也通了，大脑也接了。

然后呢？

然后我发现：**这玩意儿就是个"裸机"。**

你品品这个落差感——网上那些演示视频里，OpenClaw帮人订机票、写代码、管理日程、做数据分析，看起来无所不能，简直是钢铁侠的Jarvis。你满怀期待地装完，兴冲冲地在飞书里问它一句"帮我查一下明天东京的天气"——它回你一段干巴巴的文字，跟直接调API没什么区别。

**Jarvis？更像Siri。**

这感觉就像你攒了一台高配电脑，开机一看——桌面上就一个回收站和一个记事本。离你想象中的"生产力怪兽"差了十万八千里。

差在哪儿？差在两样东西：**"行事风格"和"技能"。**

![OpenClaw的两种状态：裸机 vs 满配](pic/2026-02-16-openclaw-lobster-farming-guide_03_html.png)

#### 给龙虾写一部"宪法"

OpenClaw有一套非常优雅的设计——它的个性、规则、行为边界，全部用Markdown文件定义。

没错，就是.md文件。不用写代码，不用调参数，用自然语言告诉它"你该怎么干活"就行。

核心文件就这几个：

- `AGENTS.md`——相当于龙虾的"宪法"，定义了它的能力边界和行为约束
- `SOUL.md`——定义它的人格，说话风格是高冷还是话痨
- `MEMORY.md`——龙虾的"笔记本"，它可以自己往里面写东西来记住事情

我在AGENTS.md里写了几条关键规则：回复用中文；不要主动做没被要求的事；涉及花钱、发消息、删文件的操作必须先问我；整理信息用表格别写大段文字。

看起来很简单的规则对吧？但这些规则决定了你跟龙虾的"信任关系"——定义得越清晰，它的行为就越可预测，你就越敢把事情交给它。**跟人协作是一个道理：你的期望越模糊，对方的产出就越随机。**

#### 给龙虾装"App Store"

光有宪法还不够。一个什么Skills都没装的OpenClaw，就像一部没装App的iPhone——能打电话，但也就能打电话了。

OpenClaw的Skills生态，截至2026年2月，已经有**超过5700个社区构建的Skills**，覆盖27个大类。从Google Workspace管理、浏览器自动化、GitHub集成到营销工具、CRM管理、网页抓取，应有尽有。安装就一行命令的事。

但这里有个很重要的安全问题得说一下——

2026年2月，安全研究机构发现了**341个恶意Skills**在ClawHub上分发恶意软件和键盘记录器。另一家安全公司发现约7%的Skills存在API密钥泄露问题。

你品品，这跟早年的Android应用商店是不是一模一样？生态繁荣的另一面，就是泥沙俱下。所以装任何第三方Skill之前，务必先看源码、查安全扫描结果、优先用官方命名空间的Skills。毕竟你装的每一个Skill，都有可能获得Agent的完整执行权限。

（推荐Skills清单和安装方法，同样放在文末参考部分了。）

---

### 第五幕：刚养上龙虾，OpenAI就来"抢人"了

龙虾养了没两天，我就看到了一条大新闻——

**OpenClaw的创始人Peter Steinberger宣布加入OpenAI。**

准确地说，这不是传统意义上的"收购"。OpenClaw不会变成OpenAI的私有产品——它会转入一个独立的开源基金会，继续MIT开源。但Steinberger本人加入了OpenAI，负责"推动下一代个人Agent"。Sam Altman亲自发帖确认，管他叫"天才"，说这项工作将"迅速成为我们产品的核心"。

据36Kr报道，在做决定之前，**Meta和OpenAI同时在抢他**。Steinberger最终选了OpenAI，理由是："与OpenAI合作是将Agent带给每个人的最快途径。"

好家伙。

14.5万颗GitHub Star。从发布到被巨头争抢，不到四个月。

看到这条新闻的时候，因为刚花了一整个春节在折腾OpenClaw，亲手装了、配了、养了、踩了坑，所以几乎是秒懂了这笔交易的逻辑——

**OpenAI看中的不是OpenClaw这个产品，而是OpenClaw验证的那套"架构"。**

---

### 拆开来看：龙虾到底是个啥结构？

折腾完之后回头想想，OpenClaw的架构其实可以拆成四个东西：

**第一，大脑（LLM）。** 可以接入任何大语言模型。Claude、GPT、Gemini、Kimi、甚至本地跑的开源模型。大脑是可替换的——今天用Kimi，明天模型一更新，换Claude就行。龙虾的"智商"可以随时升级。

**第二，持久化沙盒。** 这是OpenClaw跟之前所有AI Agent方案最大的区别。

以前的Agent——不管是AutoGPT还是各种"AI助手"——都是"临时工"模式。你给它一个任务，它临时开一个环境跑，跑完就没了。下次再用？一切从头开始。

OpenClaw不一样。它的环境是**一直存在的**。Agent有自己的文件系统、记忆数据库、会话历史、装好的工具。它不是一个"用完即走"的临时工，而是一个"一直在那儿"的常驻员工。

你品品这个区别——

一个"一直在那儿"的Agent，可以积累记忆，越用越懂你。可以后台跑定时任务，不需要你每次手动触发。可以维护自己的工作状态，中断了能接着干。

这就是为什么我说"养龙虾"的体验，跟以前用任何AI工具都不一样。**它不是更聪明了，而是更"在"了。**

**第三，行事风格（.md配置文件）。** 用自然语言写几篇Markdown，就能定义Agent的人格、能力边界和行为规范。不用写代码。这个设计的妙处在于——它让"配置AI"变得跟"写说明书"一样简单。会写字就能定制自己的Agent。

**第四，开放的Skills生态。** 模块化能力包，社区共建，按需安装。就像手机的App Store。

关键词是**"开放"**。以前的Agent方案大多是封闭的——能力是平台内置的，用户只能用平台提供的功能。OpenClaw把Skills开放给了社区。结果呢？不到半年，5700+个Skills。

给了生态，进化就快。这是互联网20年来反复验证的道理。

**"大脑 + 持久化沙盒 + 行事风格配置 + 开放Skills生态"——这个四件套组合，很大概率会成为后面个人AI助手、甚至企业AI助手的标准形态。**

![AI Agent"四件套"标准形态](pic/2026-02-16-openclaw-lobster-farming-guide_04_html.png)

跟之前的方案比起来，关键差异就两个：
1. 沙盒环境一直存在，不是根据任务临时生成的
2. Skills开放给了生态，不是平台自己闭门造车的

OpenAI看到的就是这个。他们不是在买一个产品，**他们是在买一套被14.5万颗星验证过的架构思路，以及创造这套架构的那个人。**

---

### 那我们还能干啥？

聊点现实的。

如果你也在琢磨AI方向的事，这个局势其实挺清楚的——**做泛用型AI助手、解决日常杂事的中小项目，可能没啥大机会了。**

当OpenAI把OpenClaw的架构融进自己的产品线——可能就是ChatGPT的下一个大版本——加上它的模型能力、用户基础和分发渠道，留给小团队的空间非常有限。辛辛苦苦做了半年的"AI帮你订外卖+管日程+写邮件"，可能一夜之间就被GPT的原生功能给替代了。

但——机会不是没有，是在另一个方向。

**围绕这套"四件套"架构，去做toB和更垂直的场景。**

想想看，企业客户要的不是"什么都能干"，而是"在我的业务场景里，安全合规地干好这一件事"。权限管理、数据安全、合规审计——这些不是OpenAI或者任何通用平台搞得定的，需要深度的行业理解和定制化能力。

而OpenClaw验证的这套架构，恰好是一个很好的"底座"。不用从零造轮子，在这个底座上做垂直化定制就行。

大白话说：**地基人家帮你打好了，你只管在上面盖自己那个领域的楼。**

![垂直化机会：在开放底座上盖自己的楼](pic/2026-02-16-openclaw-lobster-farming-guide_07_html.png)

---

### 结语：养龙虾养出来的两个想法

折腾了一整个春节，养了一只龙虾，顺便想明白了两件事。

**第一件：以后每个人可能都会有自己的"龙虾"。**

OpenClaw的"一个人+一只龙虾"模式，本质上是把一个人变成了一个"小型团队"。一个人+定制化的Agent+装好的Skills = 以前可能需要好几个人才能覆盖的事情。

往大了想——如果一个公司里的每个人都有自己的专属龙虾呢？不是那种通用的ChatGPT入口，而是像OpenClaw一样，有持久化环境、有定制配置、有跟具体业务相关Skills的专属Agent。

**每个人+自己的Agent = "超级个体"。**

这不是科幻。养了几天龙虾之后，确实感觉自己能处理的信息量变大了。如果一个团队里人手一只——那能干的事情会多出不少。

**第二件：以后公司可能需要建"不怕搞坏"的业务操场。**

OpenClaw的沙盒设计给了我很大的启发——它让Agent在一个"安全但能执行真实操作"的环境里工作。搞坏了？没关系，沙盒兜着。

公司其实也需要这样的"沙盒"。Agent可以访问知识库、CRM、项目管理系统，但有明确的权限边界。有审计日志、有回滚机制。搞砸了能恢复。

以后区分公司AI水平的，不是"我们用AI了"——谁都能用ChatGPT。而是"我们为AI构建了安全的业务环境，让AI能真正参与业务流程，而不只是回答问题"。

**这可能才是真正的AI原生组织该有的样子。**

---

说回我的龙虾。

龙虾现在安安静静地跑在Legion Go上，连着飞书，偶尔帮忙查个东西，偶尔整理下信息。不算很聪明——毕竟大脑是199块的Kimi——但胜在**一直在那儿**。

有时候深夜突然想到什么事情，拿起手机在飞书里发一条消息，它就回复了。不需要打开电脑、不需要登录网站、不需要把前因后果从头讲一遍——因为它记得。

这个体验，跟"打开浏览器→输入chatgpt.com→登录→新建对话→从头解释背景"是完全不同的。

**就像一个不用睡觉的搭档。虽然不是最聪明的那个，但永远在线。**

越来越觉得，这可能就是AI Agent真正的方向。不是更聪明，而是**更在场**。

春节结束了，龙虾还在跑。

如果你也想养一只，往下翻，教程都在参考部分。

---

*本文基于2026年春节期间的真实折腾经历撰写。文中涉及的技术细节以当时的OpenClaw版本为准，后续版本可能有所变化。安装任何开源软件前请评估安全风险。*

*如果你也养了龙虾，欢迎在评论区分享你的踩坑经历。*

---

## 参考

### 附录一：WSL Ubuntu + OpenClaw + 飞书 完整部署教程（以下内容是让AI重新搜索梳理的，毕竟当时自己操作过程自己也有点忘记细节了）

**系统要求**：Windows 10/11（64位）、管理员权限、稳定网络

#### 第一步：安装WSL2和Ubuntu

打开PowerShell（管理员模式）：

```powershell
wsl --install -d Ubuntu-24.04
```

装完重启Windows。从开始菜单打开Ubuntu，设置Linux用户名和密码。

#### 第二步：启用systemd

OpenClaw的守护进程需要systemd。在Ubuntu终端里执行：

```bash
sudo tee /etc/wsl.conf >/dev/null <<'EOF'
[boot]
systemd=true
EOF
```

回到PowerShell关闭WSL后重新打开：

```powershell
wsl --shutdown
```

#### 第三步：安装Node.js 22

方式一（推荐）——用nvm：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
node -v    # 应显示 v22.x.x
```

方式二——NodeSource直装：

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

#### 第四步：安装OpenClaw

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

引导向导会配置Gateway设置、AI模型API Key和systemd守护进程。

#### 第五步：连接飞书

安装飞书插件：

```bash
openclaw plugins install @openclaw/feishu
```

在飞书开放平台（`open.feishu.cn/app`）创建企业自建应用：

1. 创建应用，复制 **App ID** 和 **App Secret**
2. 配置权限：`im:message`、`im:message:send_as_bot`、`im:chat.members:bot_access`、`contact:user.employee_id:readonly`
3. 启用Bot功能
4. 事件订阅中选择"长连接接收事件（WebSocket）"，添加 `im.message.receive_v1`
5. 创建版本 → 审核发布

配置OpenClaw连接：

```bash
openclaw channels add
# 选择 Feishu，粘贴 App ID 和 App Secret
```

或手动编辑 `~/.openclaw/openclaw.json`：

```json5
{
  channels: {
    feishu: {
      enabled: true,
      dmPolicy: "pairing",
      accounts: {
        main: {
          appId: "cli_你的AppID",
          appSecret: "你的AppSecret",
          botName: "我的AI龙虾",
        },
      },
    },
  },
}
```

启动并测试：

```bash
openclaw gateway

# 另一个终端审批配对
openclaw pairing list feishu
openclaw pairing approve feishu <配对码>
```

#### 重要的坑

**文件路径**：`~/.openclaw/` 一定要放在WSL的Linux文件系统里（`/home/你的用户名/`），不要放在 `/mnt/c/` 下，否则IO性能暴跌，龙虾会变得巨慢。

---

### 附录二：推荐Skills清单与安装方法

**安装方法：**

```bash
clawhub search "关键词"      # 搜索
clawhub install <skill-slug>  # 安装
clawhub list                  # 查看已安装
clawhub update --all          # 全部更新
```

手动安装：把Skill文件夹放到 `~/.openclaw/skills/` 下即可。

**推荐Skills Top 10：**

| 排名 | Skill | 干什么用的 | 安装命令 |
|------|-------|-----------|---------|
| 1 | **Gog (Google Workspace)** | 统一管理Gmail、日历、Drive、Sheets、Docs | `clawhub install openclaw/gog` |
| 2 | **Browser Automation** | 网页浏览、表单填写、数据提取（Playwright） | 内置，无需安装 |
| 3 | **Notion** | 知识库管理，页面和数据库增删改查 | `clawhub install openclaw/notion-skill` |
| 4 | **GitHub Integration** | CI/CD监控、PR Review、Issue管理 | 内置（GitHub CLI） |
| 5 | **Twitter/X** | 发推、定时发布、追踪互动数据 | `clawhub install openclaw/twitter` |
| 6 | **Marketing Mode** | 23个营销技能合集：SEO、转化优化、发布策略 | `clawhub install thesethrose/marketing-mode` |
| 7 | **GA4 Analytics** | 连接Google Analytics 4和Search Console | `clawhub install adamkristopher/ga4-analytics` |
| 8 | **Firecrawl Search** | 高级网页抓取，能处理JS渲染和反爬虫 | `clawhub install openclaw/firecrawl-search` |
| 9 | **HubSpot CRM** | 管理联系人、公司、交易和活动 | `clawhub install kwall1/hubspot` |
| 10 | **SEO Content Engine** | 竞品分析、关键词研究、生成SEO文章 | 包含在Marketing Mode中 |

**安全提醒**：2026年2月，安全机构发现341个恶意Skills分发恶意软件，283个Skills泄露API密钥。安装前请：查看VirusTotal扫描结果、优先使用 `openclaw/` 官方命名空间的Skills、review源码后再安装。

---

### 附录三：OpenClaw核心.md配置文件说明

| 文件 | 作用 | 建议 |
|------|------|------|
| `AGENTS.md` | 核心运行指令，定义能力边界和行为约束 | 必须认真写，这是龙虾的"宪法" |
| `SOUL.md` | 人格和交互风格 | 按自己喜好来，但别太中二 |
| `TOOLS.md` | 用户自定义工具规范和备忘笔记 | 按需添加 |
| `MEMORY.md` | 结构化记忆，Agent可自主读写 | 让龙虾自己维护 |

配置文件位于 `~/.openclaw/openclaw.json`（JSON5格式），支持任何兼容OpenAI API格式的模型提供商。
