# Goal & Plan

更新：2026-11-03。此文件是本地项目的计划与状态基线；阶段进展在此原位维护。

## Goal

围绕小红书 App 内置点点与 PC Web，提出可验证的跨设备用户旅程连续性方案，并用可交互 H5 展示体验。最终形成五项可独立展示的成果：产品研究报告、产品方案、交互 H5、可复现的 GitHub 项目材料、小红书发布稿。GitHub 公开与小红书发帖由用户最终决定。

成功不以官方是否回复为唯一标准；作品本身应清楚证明产品洞察、证据判断、方案设计和 AI building 能力。

## 当前最短路径（用户 2026-11-03 纠偏）

1. **眼下能继续：** 给妳一段可在手机原会话使用的[手动交接提示词](HANDOFF-NOW.md)，复制核对后的摘要到 PC Web 新会话。
2. **产品真正该解决：** 聚焦 P0「同账号同一会话双向可见并继续」，用 H5 的 Conversation Handoff 展示目标状态；Context / Execution 保留为扩展建议，不阻塞 P0。
3. **证据刚好够用：** T01/T02 在妳同账号、新会话、iOS App 与 Web 的两个方向均未出现；仅补会改变判断的刷新/旧会话条件。第三方工具话题出现在推荐提问中，只作为未验证线索，不额外铺开调研。

此前「至少三个中国基模交叉询问」与广泛竞品扩展降为可选，当前不推进。研究材料用于守住事实边界，不作为展示重心；正式发布前再按实际文案核查必要来源。

## 已确认决策

1. 项目根目录是 `D:\AIdev\30_Projects\DOTS-CONTINUITY-LAB`。早期对话建议的 `D:\Code` / `D:\Studio` 双路径已被用户的新指令替代。
2. 范围是小红书 App **内置**点点与点点 PC Web。独立点点 iOS App、真实内部接口与生产级同步服务不在本期范围。
3. 产品命题从单纯的 Conversation History Sync 延伸为 User Journey Continuity；方案按 History、Agent Context、Execution State 三层展开。
4. H5 保留四个模块：Conversation Handoff、Agent Continuity、Sync Diagnostic、Metrics Dashboard。以 Conversation Handoff 为首个可操作体验。
5. 用户原创原则「好的设计，是熵减与解放」用于交互决策：降低寻找信息和重复操作的成本，释放注意力，同时保留用户的选择、修正与控制权。Business Value 与 Human Value 并行衡量。
6. 对话与模型输出只提供研究线索；公开事实、用户实测、社区反馈、推断与模拟数据分别标记。未经证据验证，不推断点点内部架构或普遍故障。
7. ChatGPT 产品端确认 **P-001**：Conversation Handoff 是首个端到端里程碑，完整演示「手机开启对话→保留历史与引用→切换电脑→恢复上下文→继续交互」。**P-002**：点点真实行为须有测试或原始来源；H5 与 README 明示所有同步和 Agent 状态为概念模拟。这两项均在 v0.3 范围内。

## 五项交付与完成标准

| 交付物 | 核心内容 | 完成标准 |
| --- | --- | --- |
| Product Research Report | T01/T02 结果、必要的官方来源、最低限度竞品参照与 Evidence Ledger | 核心判断可追溯；不为凑覆盖面扩充调研 |
| Product Solution | P0 同一会话双向接力为核心；Context / Execution 是后续扩展 | P0 场景、状态、失败反馈和验收条件清晰；内部架构仍是建议 |
| Interactive H5 | 双设备接力、三层状态、诊断流程和指标 Demo | 四个模块可操作；手机与桌面布局可用；刷新可恢复 Demo 状态；模拟数据标识清楚 |
| GitHub Project | 可运行源码、README、研究与方案、验证说明、演示素材 | 私有仓库 `main` 已推送；公开仓库前仍需核对最终文案、素材和隐私 |
| Xiaohongshu Post | 有证据的产品吐槽、H5 演示、方案与求职叙事 | 文案和视觉可审；所有链接有效；由用户批准后再公开发布 |

## 阶段计划

| 阶段 | 工作 | 退出条件 | 状态 |
| --- | --- | --- | --- |
| 0. Workspace & baseline | 建立专属目录、确认环境、固定范围与交付标准 | 路径无冲突，计划与环境记录可复核 | 已完成 |
| 1. Research & diagnosis | T01/T02 同账号双向新会话测试、必要来源与证据分级；其余测试按是否改变方案决定 | 核心观察有边界，未知项标明 | 核心证据已有；刷新条件待补 |
| 2. Product definition | 用户旅程、History / Context / Execution PRD、架构与数据模型、指标、风险 | 每个核心功能有场景、数据状态和验收方式 | 首版完成；P0 最小实施切片已明确，待刷新条件校准现状描述 |
| 3. H5 build | 先做 Conversation Handoff，再做 Agent Continuity、Sync Diagnostic、Metrics Dashboard；使用本地模拟数据 | 四模块可操作，状态与反馈明确 | 首版完成 |
| 4. QA & packaging | 桌面/手机视口、刷新恢复、关键流程与指标计算验证；整理 README、源码、演示素材和已知限制 | 本地构建与关键旅程通过，可复现 | 本地完成；Pages 工作流仅为不触发的模板，详见 [QA.md](QA.md)，实体 iPhone Safari 未验收 |
| 5. Public launch | 准备 GitHub 公开、H5 展示及小红书图文，核对来源与链接 | 用户审定并授权后执行公开动作；记录实际链接与反馈 | 主对话公开分享与 [GitHub 私有仓库](https://github.com/iJessieA1X/DOTS-CONTINUITY-LAB)创建已完成；H5 与帖子未发布 |

### 第一手测试的最小矩阵

T01 手机新会话→PC；T02 PC 新会话→手机；T03 手机旧会话→PC；T04 PC 刷新后复查；T05 手机新消息→PC；T06 笔记引用跨端；T07 换端继续时的上下文；T08 重新登录后的历史恢复。每次记录时间、客户端版本、账号一致性、步骤、预期、实际结果与截图。2026-11-03 已收到 T01/T02 双向未出现的[第一手结果](research/test-results.md)；T03–T08 尚未回报。

2026-11-03 后续补充：用户确认 T01/T02 为同账号、所称最新版 iOS App 与当前 Web 的双向新会话测试，均未出现；数字版本、等待与刷新结果仍未知，按限定条件 User-tested 记录。另有第三方工具话题出现在推荐提问中的线索，新增探索性 T09；App 更新是干扰因素，不能把推荐出现当作会话历史同步。

### Evidence Ledger 约定

Phase 1 在 [research/evidence-ledger.md](research/evidence-ledger.md) 建立台账。每项记录 Claim、来源与日期、可核对的证据、适用范围、置信度、下一步验证；状态区分 **Verified**（原始来源已核对）、**User-tested**（有步骤与结果的第一手测试）、**Reported**（用户或媒体陈述）、**Hypothesis**（尚待验证的判断）、**Demo Data**（原型示例数据）。社区转述和模型回答记录来源类型及核验情况，不因被引用就升格为 Verified。跨端测试步骤见 [research/test-protocol.md](research/test-protocol.md)。

### H5 实现基线

优先采用 Vite + React + TypeScript，轻量 CSS 和 LocalStorage。第一版不需要后端、账号或真实 API，不要求用户上传真实聊天。同步状态与执行状态均为可解释的本地模拟。技术选型在开始实现时依实际环境复核。

## 协作与权限边界

- 用户：真实点点客户端操作、产品取舍、H5 验收、公开发布的最终决定。
- ChatGPT 主对话：产品与研究讨论、证据和方案审查、传播表达；每次关键产品变更同步到本地计划。
- Codex：本地工程、必要研究核验、H5 实现、测试与结构化交接；每个阶段把变更、验证、结果和未解决项同步到主对话。
- 对话互通采用用户指定的主 ChatGPT 对话；妳已授权其[公开分享链接](https://chatgpt.com/share/6ae9d3c8-51bc-83ec-89b7-acd2607ebd0c)。另一段设计哲学对话的链接仅留在本地未公开记录中。ChatGPT 的回复作为协作输入，用户的新指令与本地验证结果决定执行基线。
- 创建远端仓库、部署公开站点、发帖、发送给第三方、权限和系统配置变更，在具体成果准备好后按用户授权执行。

## Phase 0 环境记录

- `D:\AIdev\30_Projects` 原有四个项目；DOTS 专属子目录建立前不存在，也未发现同名项目。早期建议的 `D:\Code\DOTS-Continuity-Lab` 与 `D:\Studio\projects\personal\DOTS-Continuity-Lab` 均不存在。
- 本机：Node `v24.14.0`、npm `11.9.0`、pnpm `11.25.0`、Git `2.53.0.windows.1`、GitHub CLI `2.93.0`；yarn 未发现。`app` 已安装依赖，`npm run build` 通过；本地浏览器关键流程通过。
- React Doctor 0.9.22 扫描 3 个文件得 92/100，唯一提示为 `src/App.tsx` 主函数控制流复杂度；目前是可维护性提示，未观察到功能故障，后续拆组件时处理。
- 本地 Git `main` 已推送至 `iJessieA1X/DOTS-CONTINUITY-LAB` 私有仓库；远端 `README.md` 可读，仓库元数据显示 `visibility: private`。T01/T02 已有同账号限定条件结果；数字版本、刷新结果和 T03–T08 未验证。国内模型交叉询问按用户纠偏暂缓。390 × 844 手机浏览器视口已验收，实体 iPhone Safari 和公开链接未验证。
