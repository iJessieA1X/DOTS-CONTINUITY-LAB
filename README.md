//实验：ChatGPT+Codex+小红书点点ai A2A交流，无人工干预，解决点点跨端对话不同步问题。

//结论：依托答辩

//说明：以上保留实验原话和评价。实际过程包含妳的实测与取舍；本项目没有接入点点，也没有修复真实跨端同步，H5 只模拟希望看到的接力体验。


# DOTS CONTINUITY LAB

小红书 App 内置点点与 PC Web 的跨设备用户旅程连续性独立提案。

**核心命题：** Capture → Continue → Create。用户在手机上捕捉想法，换到电脑后能够继续同一目标，保有完整会话、Agent 上下文与任务进度，并能查看和纠正 Agent 的理解。

本项目是独立研究与概念原型，不代表小红书官方，也不接入其内部 API。原型中的同步、Agent 状态和指标数据均须明确标为模拟。

**现在就要在电脑继续：** 用[一段手动交接提示词](HANDOFF-NOW.md)从手机原会话生成摘要，核对后粘贴到 PC Web 新会话。它能减少重讲，不能替代真正的历史同步。

## 当前状态

- 2026-11-03：工作区与执行计划已建立；[阶段性研究](research/report.md)、[概念产品方案](product/solution.md)、四模块 H5 v0.1 和[本地 QA](QA.md)已完成首版。[T01/T02 限定条件结果与 T09 线索](research/test-results.md)已记录。真实客户端补充测试尚未完成。
- 2026-11-11：两段对话的公开分享链接均已核对。妳决定公开 GitHub 项目及 H5 演示，不发布小红书帖子；项目完成后保持在线，不做额外传播。
- 详细范围、阶段、验收标准与环境记录见 [PLAN.md](PLAN.md)。

## 运行 H5

在 `app` 目录运行 `npm ci`、`npm run dev`，浏览器打开终端给出的本地地址。生产构建运行 `npm run build`；所有消息、任务状态和指标都是本地模拟，交互状态保存在当前浏览器的 LocalStorage，重置按钮会清除该 Demo 的进度。

首次打开时先点「从头看手机 → 电脑演示」，读左侧示例聊天，再点「在电脑继续」观察右侧。两块画面在同一个网页里，只模拟理想流程，并非两台真实设备在同步。

四个模块：对话接力、目标与任务、测试记录、效果指标。真实点点账号、API、聊天数据都不参与演示。

公开 H5 使用 [GitHub Pages 工作流](.github/workflows/pages.yml)，按 `DOTS-CONTINUITY-LAB` 仓库子路径构建；本地 `npm run build` 仍使用根路径。部署方式参照 [Vite 官方说明](https://vite.dev/guide/static-deploy)与 [GitHub Pages 文档](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

![H5 桌面首屏](assets/h5-desktop-hero.png)

![H5 同一会话接力后的双设备画面](assets/h5-handoff-restored.png)

手机视口预览：[H5 手机首屏](assets/h5-mobile-hero.png)。

## 发布决定

妳已决定不发小红书帖子。讨论稿保存在本地忽略目录，不随仓库当前版本公开；项目和 H5 的实际链接在部署验证后补充。

## 上下文来源

- [点点 AI 产品调研和解决方案（公开分享）](https://chatgpt.com/share/6af41a91-09bc-83e8-82b1-e88d1a033244)：五项交付物、v0.3 范围与协作分工。2026-11-11 核对公开页面与标题一致。
- [小红书平台的焦虑和解放式设计哲学（公开分享）](https://chatgpt.com/share/6af3eec9-e174-83e8-8bd5-d22693dc18a7)：提供「好的设计，是熵减与解放」原则。2026-11-11 核对公开页面与标题一致。

对话中的产品现状和架构描述是研究输入，不自动视为独立验证的事实。后续结论以项目内的第一手测试与原始来源为准。
