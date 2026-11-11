# 本地复现与验收记录

更新：2026-11-11。H5 是独立概念模拟，以下验证只覆盖本项目代码与浏览器行为，不覆盖点点真实服务。

## 从源码复现

```powershell
cd D:\AIdev\30_Projects\DOTS-CONTINUITY-LAB\app
npm ci
npm run build
npm run dev
```

2026-11-03 本机按 `package-lock.json` 执行 `npm ci` 成功，安装 69 个包、审计 70 个包，报告 0 个漏洞；随后 `npm run build` 成功，TypeScript 与 Vite 均通过，生成 29 个模块。`npm run dev` 在 `http://127.0.0.1:5173/` 启动。锁文件和源码均在项目中；`node_modules/`、`dist/`、`*.tsbuildinfo` 被忽略。

## 浏览器验收

| 体验 | 结果 | 覆盖范围 |
| --- | --- | --- |
| Conversation Handoff | 通过：手机示例消息 → 电脑恢复历史、虚构引用和目标 → 电脑追问得到标明「预设 Demo 回复」的反馈；重置可回初始状态 | 桌面浏览器与 390 × 844 手机视口 |
| Agent Continuity | 通过：编辑约束后，电脑接力卡片显示新约束；关闭 Context 后，卡片明确提示未恢复，电脑追问的预设回复要求先确认目标与约束；任务状态按钮改变状态 | 桌面交互；手机视口布局检查 |
| Sync Diagnostic | 通过：刷新条件改变排查建议；起点/终点相同时提示选择不同设备；复制按钮显示成功 | 桌面交互；手机视口布局检查 |
| Metrics Dashboard | 通过：两个虚构场景切换后六项数值更新，界面明确标记 Demo Data；上下文恢复率以可评估接力为分母（示例 A 1/3 = 33%，B 9/10 = 90%），恢复耗时显示中位数（A 11.0、B 2.0 分钟） | 桌面交互；手机视口布局检查 |
| 状态持久化 | 通过：完成接力并继续追问后刷新，恢复同一演示状态 | 桌面浏览器 LocalStorage |
| 响应式布局 | 通过：默认桌面与 390 × 844 视口下，首屏、模块导航及四模块内容可读，手机端接力按钮可操作 | 浏览器模拟视口；未做实体 iPhone Safari 验收 |

审查工具 React Doctor 0.9.22 扫描 3 个文件得 92/100，唯一提示是 `src/App.tsx` 主函数控制流复杂度；这是维护性提示，未观察到对应功能故障。项目当前没有单元测试框架；上述交互以真实浏览器操作验证。

2026-11-03 修正 Context 展示与回复逻辑后，再次运行 `npm run build` 通过（29 个模块）。本地浏览器验证了编辑约束 → 电脑卡片更新、关闭 Context → 电脑追问不再声称保留约束，随后重置演示。

同日修正指标口径后再次构建通过（29 个模块），浏览器切换示例 A/B 核对了恢复率与中位数，再恢复默认展示。

2026-11-03 GitHub Pages 工作流模板使用 `npm run build -- --base=/DOTS-CONTINUITY-LAB/`；本地执行该命令成功（29 个模块），生成的 `dist/index.html` 资产路径均以 `/DOTS-CONTINUITY-LAB/` 开头。2026-11-11 启用 `.github/workflows/pages.yml`，首次运行因 Pages 尚未配置而在 Configure Pages 步骤失败；启用 Pages 后重跑成功，公开地址为 [H5 演示](https://ijessiea1x.github.io/DOTS-CONTINUITY-LAB/)，Chrome 已核对首页正常显示。

2026-11-11 用户指出看不懂 Demo 后，首页改为明确说明「虚构聊天、左边手机、右边电脑、点按钮恢复」，并强调没有修复真实同步。Chrome 中验证「从头看手机 → 电脑演示」重置到手机初始状态，再点「在电脑继续」可在右侧看到同一段消息、目标和约束；`npm run build -- --base=/DOTS-CONTINUITY-LAB/` 再次通过（29 个模块）。公开页面已打开核对首屏；未重复执行在线交互，功能结果以相同构建的本地验证为准。

## 当前限制

- 不接入小红书或点点 API；两端画面共享当前浏览器的本地状态，仅是目标体验的模拟。
- 演示中的会话、笔记引用和指标均为虚构，不用于证明点点或竞品的真实能力与效果。
- 浏览器 LocalStorage 只覆盖该浏览器；清除站点数据会重置进度。未验证跨真实设备同步。
- 真正的 T01/T02 测试结果及未记录条件见 [test-results.md](research/test-results.md)；H5 验收不能替代真实客户端测试。

演示截图：[桌面首屏](assets/h5-desktop-hero.png)、[接力结果](assets/h5-handoff-restored.png)、[手机首屏](assets/h5-mobile-hero.png)。
