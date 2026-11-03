# 跨端连续性 Benchmark（首轮）

核查日期：2026-11-03。这里比较**官方明确描述的能力**，不是同条件实测；版本、账号、地区与订阅限制可能影响个人体验。完整矩阵需在后续补齐多模态附件、实时更新、离线与控制能力。

| 产品与对应场景 | History / 会话可用性 | Context / 任务背景 | Execution / 任务接力 | 已核对来源 |
| --- | --- | --- | --- | --- |
| ChatGPT，同账号移动端与 Web | 官方说明聊天历史在同账号设备间同步 | 该来源未验证完整 Agent Context 恢复 | 该来源未验证执行状态恢复 | [OpenAI 帮助页](https://help.openai.com/en/articles/8142208-chatgpt-ios-and-android-app-faq) |
| DeepSeek App 与 Web | 官方发布文档列出跨平台聊天记录同步 | 该来源未验证完整 Agent Context 恢复 | 该来源未验证执行状态恢复 | [DeepSeek 官方发布文档](https://api-docs.deepseek.com/news/news250115/) |
| Claude Cowork，符合条件的云端任务 | 官方说明 session 与文件随账号跨桌面、Web、移动端可用 | 可在另一设备打开同一云端 session；具体 context 完整度尚未实测 | 官方列出跨端继续 session；2026-10-06 前的本地任务仍留在原设备，本地文件和浏览器能力有桌面端在线条件 | [Anthropic 帮助页](https://support.claude.com/en/articles/15520349-use-claude-cowork-on-web-desktop-and-mobile) |
| Gemini Apps，个人账号 | 登录且开启 Keep Activity 时可查找与管理近期聊天 | 该来源未验证跨端 Context 完整度 | 该来源未验证执行状态恢复 | [Google 帮助页](https://support.google.com/gemini/answer/13666746?hl=en-EN) |
| 小红书内置点点 ↔ PC Web | 用户同账号 T01/T02 新会话双向未见，数字版本与刷新结果未知 | 未验证 | 未验证 | [测试结果](test-results.md)、[测试协议](test-protocol.md) |

**当前可用的设计启发：** History 是最容易向用户解释的基础能力；Agent 任务接力比普通聊天列表同步更深，需区分会话、上下文和执行状态。Gemini 的设置条件提醒我们把「同账号」和「历史保存开关」列入测试前置条件。这些是从来源作出的产品推论，不代表点点的已知实现。

**待补：** 点点真实双端行为、更多国内产品的原始来源、同口径附件恢复和离线测试。未经核验的格子保持「未验证」，不填推测值。
