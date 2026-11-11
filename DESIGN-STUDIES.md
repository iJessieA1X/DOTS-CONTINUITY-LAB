# H5 demo · 五版视觉实验

这条分支专供比较和 review；`main` 的公开 H5 不变。五版使用同一套虚构聊天、跨端接力交互、测试记录和模拟指标。它们都不连接真实点点账号，也不宣称解决了真实跨端同步。

打开本地 H5 后，用顶部的版本切换器比较；URL 中的 `?design=...` 可直接定位某一版。每版都应先点击「从头看手机 → 电脑演示」，再点击「在电脑继续」。

| 版本 | 参考 skill | 视觉决定 | 桌面 | 手机 | 接力后 |
| --- | --- | --- | --- | --- | --- |
| 01 编辑手记 `editorial` | Frontend Design | 把“断开的对话”当一条编辑线索；纸张、衬线、红色缺口，信息像一份观察手记。 | [截图](review/editorial-desktop.png) | [截图](review/editorial-mobile.png) | [截图](review/editorial-handoff.png) |
| 02 产品工作台 `workbench` | Design Taste Frontend | 缩短说明区，把可操作 Demo 推近首屏；左侧模块轨道和清楚的任务面板。 | [截图](review/workbench-desktop.png) | [截图](review/workbench-mobile.png) | [截图](review/workbench-handoff.png) |
| 03 暖色批注 `notes` | Esther Design System | 暖纸、蓝黄主色、便签式接力节点，像妳对使用问题的现场批注。 | [截图](review/notes-desktop.png) | [截图](review/notes-mobile.png) | [截图](review/notes-handoff.png) |
| 04 信号路径 `signal` | UI/UX Pro Max | 深色低干扰界面；路径与状态用同一种琥珀色表达，强调交接过程。 | [截图](review/signal-desktop.png) | [截图](review/signal-mobile.png) | [截图](review/signal-handoff.png) |
| 05 安静原生 `calm` | Apple Design + Impeccable | 轻量、可触的控件与安静的设备画面；把注意力留给“继续做事”。 | [截图](review/calm-desktop.png) | [截图](review/calm-mobile.png) | [截图](review/calm-handoff.png) |

第 04 版使用 UI/UX Pro Max 的产品 Demo、可达性、响应式和反馈建议；没有沿用检索结果给出的通用 AI 紫色配色。第 05 版用 Impeccable 检查内容与视觉形式的关系、字级和对比。

第 03 版参考 [ESTHER 不二的 esther-design-system](https://github.com/esthersjw/esther-design-system)（CC BY-NC-SA 4.0）；此版页面页脚也保留署名。没有复制其模板文件或图片。

## 验证

- `npm run build -- --base=/DOTS-CONTINUITY-LAB/` 通过。
- 5 版在 1440px 桌面和 390px 手机宽度均已截图；手机均无横向滚动。
- 每版点击「在电脑继续」后，电脑侧出现同一段示例聊天和保存的目标；浏览器无运行错误。
- 图片是本地预览截图，不代表线上 Pages 已切到这条分支。
