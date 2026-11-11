import { useEffect, useRef, useState } from 'react';

type ModuleId = 'handoff' | 'continuity' | 'diagnostic' | 'metrics';
type Device = 'mobile' | 'desktop';
type Message = { id: number; role: 'user' | 'assistant'; text: string; origin: Device; note?: string };
type Layer = 'history' | 'context' | 'execution';
type RunStatus = 'paused' | 'running' | 'waiting' | 'completed' | 'failed';
type Observation = 'missing' | 'found' | 'partial';
type Diagnostic = {
  source: Device;
  destination: Device;
  sameAccount: boolean;
  conversation: 'new' | 'old';
  refreshed: boolean;
  contextPresent: boolean;
  observed: Observation;
};
type LabState = {
  activeModule: ModuleId;
  handoffStep: 0 | 1 | 2 | 3;
  messages: Message[];
  contextGoal: string;
  contextConstraint: string;
  runStatus: RunStatus;
  layers: Record<Layer, boolean>;
  diagnostic: Diagnostic;
  metricScenario: 'current' | 'proposed';
};

const STORAGE_KEY = 'dots-continuity-lab-v1';
const baseMessages: Message[] = [
  { id: 1, role: 'user', origin: 'mobile', text: '刷到几篇杭州城市漫游笔记，想做一份周末路线，晚上回电脑再比较。' },
  { id: 2, role: 'assistant', origin: 'mobile', text: '收到。我先保留你的目标：周末城市漫游、轻量步行、晚上再做路线对比。', note: '示例笔记引用 · 湖滨 / 运河 / 西溪' },
  { id: 3, role: 'user', origin: 'mobile', text: '别排得太满，最好有可以坐下来写稿的地方。' },
  { id: 4, role: 'assistant', origin: 'mobile', text: '已记下「留白 + 写稿空间」。切换设备后，你可以直接从三条路线的取舍继续。' },
];
const initialState: LabState = {
  activeModule: 'handoff',
  handoffStep: 0,
  messages: baseMessages,
  contextGoal: '整理杭州周末城市漫游路线，回电脑后完成对比与写稿。',
  contextConstraint: '步行轻量；不要排满；保留坐下写稿的时间。',
  runStatus: 'waiting',
  layers: { history: true, context: true, execution: true },
  diagnostic: { source: 'mobile', destination: 'desktop', sameAccount: true, conversation: 'new', refreshed: false, contextPresent: false, observed: 'missing' },
  metricScenario: 'proposed',
};

const modules: { id: ModuleId; number: string; title: string; label: string }[] = [
  { id: 'handoff', number: '01', title: '对话接力', label: '先看手机 → 电脑' },
  { id: 'continuity', number: '02', title: '目标与任务', label: '后续构想' },
  { id: 'diagnostic', number: '03', title: '测试记录', label: '手动排查' },
  { id: 'metrics', number: '04', title: '效果指标', label: '虚构示例' },
];
function loadState(): LabState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const saved = JSON.parse(raw) as Partial<LabState>;
    return {
      ...initialState,
      ...saved,
      messages: Array.isArray(saved.messages) ? saved.messages : baseMessages,
      layers: { ...initialState.layers, ...saved.layers },
      diagnostic: { ...initialState.diagnostic, ...saved.diagnostic },
    };
  } catch {
    return initialState;
  }
}

function deviceLabel(device: Device) { return device === 'mobile' ? '手机' : '电脑'; }

function diagnosticResult(input: Diagnostic) {
  if (input.source === input.destination) {
    return { layer: '测试路径', title: '请选择两种不同设备', explanation: '当前起点和终点相同，这次输入无法检验跨设备接力。', next: '选择手机内置点点与 PC Web 两个不同端，再记录观察结果。' };
  }
  if (!input.sameAccount) {
    return { layer: '账号身份', title: '先确认两端身份一致', explanation: '不同账号下看不到同一会话，无法用这次测试判断同步能力。', next: '用同一账号重新执行双向新会话测试。' };
  }
  if (input.observed === 'found' && !input.contextPresent) {
    return { layer: 'Agent Context', title: '历史可见，上下文承接待查', explanation: '目标会话已经出现，但继续提问时仍可能需要重复解释目标。', next: '用相同追问检验关键约束与笔记引用是否被保留。' };
  }
  if (input.observed === 'found') {
    return { layer: '本次路径可用', title: '本次测试观察到接力', explanation: '当前条件下，会话与上下文都可继续；这不能覆盖其他账号、旧会话或离线情形。', next: '再测反方向、旧会话与重新登录后的恢复。' };
  }
  if (input.observed === 'partial') {
    return { layer: '数据完整性', title: '会话只恢复了一部分', explanation: '列表出现不等于完整接力。消息顺序、笔记引用或附件可能仍有缺口。', next: '记录缺失的消息与引用，再比较刷新前后。' };
  }
  if (!input.refreshed) {
    return { layer: '待区分：通知 / 历史读取', title: '先刷新并记录变化', explanation: '目标端未出现会话；刷新前的结果还不能区分实时通知与历史读取问题。', next: '刷新目标端；再检查旧会话与反方向新会话。' };
  }
  return { layer: '待区分：功能覆盖 / 身份 / 会话服务', title: '刷新后仍未找到会话', explanation: '这是该账号与测试路径下的观察结果，不能由界面现象确定后台根因。', next: '核对登录方式、比较新旧会话及反方向，再寻找官方说明。' };
}

const sampleMetrics = {
  current: { attempts: 12, handoffs: 3, contextRestored: 1, resumeMinutes: [13, 9, 11], repeated: 8, agencyPositive: 4, surveyed: 12, adopted: 4, eligible: 20 },
  proposed: { attempts: 12, handoffs: 10, contextRestored: 9, resumeMinutes: [2, 3, 2, 1, 2, 2, 3, 2, 1, 2], repeated: 2, agencyPositive: 10, surveyed: 12, adopted: 14, eligible: 20 },
};

function percent(numerator: number, denominator: number) { return `${Math.round((numerator / denominator) * 100)}%`; }
function median(values: number[]) {
  if (values.length === 0) return '无数据';
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return `${(sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2).toFixed(1)} 分钟`;
}

function App() {
  const [lab, setLab] = useState<LabState>(loadState);
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const desktopRef = useRef<HTMLDivElement>(null);
  const handoffRequested = useRef(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(lab)); }, [lab]);
  useEffect(() => {
    if (lab.handoffStep !== 1) return;
    const timer = window.setTimeout(() => setLab(current => ({ ...current, handoffStep: 2 })), 800);
    return () => window.clearTimeout(timer);
  }, [lab.handoffStep]);
  useEffect(() => {
    if (lab.handoffStep !== 2 || !handoffRequested.current) return;
    handoffRequested.current = false;
    if (!window.matchMedia('(max-width: 800px)').matches) return;
    desktopRef.current?.focus({ preventScroll: true });
    desktopRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }, [lab.handoffStep]);

  const patch = (changes: Partial<LabState>) => setLab(current => ({ ...current, ...changes }));
  const activeDevice: Device = lab.handoffStep >= 2 ? 'desktop' : 'mobile';
  const stepText = lab.handoffStep === 0 ? '手机已捕捉' : lab.handoffStep === 1 ? '正在模拟接力…' : lab.handoffStep === 2 ? '模拟接力完成' : '电脑继续创作中';

  function beginHandoff() {
    handoffRequested.current = true;
    patch({ handoffStep: 1 });
  }

  function handoffAction() {
    return lab.handoffStep === 0
      ? <button className="action-button" type="button" onClick={beginHandoff}>在电脑继续 <span>→</span></button>
      : lab.handoffStep === 1
        ? <button className="action-button" type="button" disabled>正在恢复…</button>
        : <button className="action-button" type="button" onClick={() => patch({ handoffStep: 0 })}>回到手机 <span>↗</span></button>;
  }

  function sendDemoMessage() {
    const message = draft.trim();
    if (!message || lab.handoffStep === 1) return;
    const nextId = Math.max(...lab.messages.map(item => item.id)) + 1;
    const reply = activeDevice === 'mobile'
      ? '已加入这段示例会话。切到电脑后，你会看到同一条消息；这是一条预设的 Demo 回复。'
      : !lab.layers.history
        ? '历史消息尚未恢复，我无法确认先前讨论过什么。请先恢复消息或补充背景；这是一条预设的 Demo 回复。'
        : !lab.layers.context
          ? '历史已恢复，但目标和约束未自动接上。请先确认要继续做什么；这是一条预设的 Demo 回复。'
          : !lab.contextGoal.trim() || !lab.contextConstraint.trim()
            ? '当前目标或约束尚未填写完整。请先确认后再继续；这是一条预设的 Demo 回复。'
            : '我会按上方当前目标与已确认约束继续比较路线。你可以先修改它们；这是一条预设的 Demo 回复。';
    setLab(current => ({
      ...current,
      handoffStep: activeDevice === 'desktop' ? 3 : current.handoffStep,
      messages: [...current.messages, { id: nextId, role: 'user', origin: activeDevice, text: message }, { id: nextId + 1, role: 'assistant', origin: activeDevice, text: reply }],
    }));
    setDraft('');
  }

  function resetDemo() {
    handoffRequested.current = false;
    setLab(initialState);
    setDraft('');
    setCopied(false);
  }

  async function copyDiagnostic() {
    const result = diagnosticResult(lab.diagnostic);
    const d = lab.diagnostic;
    const report = `DOTS CONTINUITY LAB · 测试记录（独立概念工具）\n路径：${deviceLabel(d.source)} → ${deviceLabel(d.destination)}\n账号一致：${d.sameAccount ? '是' : '否'}；会话：${d.conversation === 'new' ? '新' : '旧'}；已刷新：${d.refreshed ? '是' : '否'}\n观察：${d.observed === 'found' ? '完整出现' : d.observed === 'partial' ? '部分出现' : '未出现'}；上下文保留：${d.contextPresent ? '是' : '否/未知'}\n初步层级：${result.layer}\n建议：${result.next}\n注：此结果由手动输入生成，不是点点官方诊断。`;
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch { setCopied(false); }
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="DOTS CONTINUITY LAB 首页"><span className="brand-dots">●●</span> DOTS<span className="brand-light">/</span>CONTINUITY LAB</a>
        <span className="topbar-meta">独立概念提案 <span aria-hidden="true">✳</span> v0.1 Demo</span>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> ONE GOAL. TWO SCREENS.</p>
            <h1 id="hero-title">点点对话，<br /><em>换到电脑</em><br />能接着聊吗<span className="period">？</span></h1>
            <p className="hero-intro">这是一个用虚构聊天做的本地演示：<strong>先在手机留下想法，再到电脑继续整理。</strong>点「在电脑继续」，电脑区域就会显示同一段对话和目标。它不连接真实点点账号，也没有修复真实的跨端同步。</p>
            <div className="hero-actions">
              <button className="primary-link" type="button" onClick={() => { resetDemo(); document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth' }); }}>从头看手机 → 电脑演示 <span aria-hidden="true">↗</span></button>
              <span className="hero-caption">只用示例内容 · 不收集真实聊天</span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-art-heading">CAPTURE <span>→</span> CONTINUE <span>→</span> CREATE</div>
            <div className="hero-orbit orbit-one"><span>01</span><strong>想法</strong></div>
            <div className="hero-orbit orbit-two"><span>02</span><strong>同一段<br />对话</strong></div>
            <div className="hero-orbit orbit-three"><span>03</span><strong>继续<br />完成</strong></div>
            <div className="hero-bridge"><span className="bridge-dot" /></div>
            <p className="hero-art-note">CONCEPT DEMO · 本地模拟<br />画面展示希望实现的体验，不代表点点现有功能。</p>
          </div>
        </section>

        <section className="lab-section" id="lab" aria-labelledby="lab-title">
          <div className="section-heading"><div><p className="eyebrow">30 秒看懂 / 先试 01</p><h2 id="lab-title">点一下，看看对话<br />怎样从手机接到电脑。</h2></div><p className="section-aside">先看第 01 个演示：点击「在电脑继续」，观察电脑区域发生什么。其余模块是延伸想法，可以稍后再看。全部内容均为本地模拟。</p></div>
          <nav className="module-nav" aria-label="实验模块">
            {modules.map(item => <button key={item.id} className={`module-tab ${lab.activeModule === item.id ? 'active' : ''}`} type="button" aria-current={lab.activeModule === item.id ? 'page' : undefined} onClick={() => patch({ activeModule: item.id })}><span className="tab-number">{item.number}</span><span><strong>{item.title}</strong><small>{item.label}</small></span></button>)}
          </nav>

          {lab.activeModule === 'handoff' && <section className="module-panel" aria-labelledby="handoff-title">
            <div className="panel-head"><div><p className="eyebrow">01 / 先看这个</p><h3 id="handoff-title">手机里的聊天，电脑接着聊。</h3><p>手机区域是一段虚构聊天。点「在电脑继续」后，电脑区域会出现同一段消息、目标和约束；你还可以继续输入一句。</p></div><span className="status-pill" aria-live="polite"><span className={`status-dot ${lab.handoffStep === 1 ? 'pulse' : ''}`} />{stepText}</span></div>
            <p className="simulation-note">本地模拟 · 虚构会话 · 未连接真实点点</p>
            <div className="journey-track" aria-label="接力进度"><div className={lab.handoffStep >= 0 ? 'current' : ''}><span>1</span> 手机捕捉</div><i /><div className={lab.handoffStep >= 2 ? 'current' : ''}><span>2</span> 电脑恢复</div><i /><div className={lab.handoffStep >= 3 ? 'current' : ''}><span>3</span> 继续创作</div></div>
            <div className="devices">
              <div className={`device phone ${activeDevice === 'mobile' ? 'device-active' : ''}`}><div className="device-top"><div><span className="device-icon">▣</span><strong>手机 / 随手记</strong></div><span>源设备</span></div><div className="conversation"><div className="chat-date">周末路线 · 示例会话 #D-204</div>{lab.messages.filter(item => item.origin === 'mobile' || lab.handoffStep >= 2).map(item => <MessageBubble key={item.id} message={item} />)}</div><div className="device-bottom">{activeDevice === 'mobile' ? <Composer value={draft} setValue={setDraft} onSend={sendDemoMessage} label="手机端示例消息" /> : <span>这段会话已随你进入电脑。</span>}</div></div>
              <div className="mobile-handoff-control"><span>把这张小纸条带到电脑 →</span>{handoffAction()}</div>
              <div className={`device desktop ${activeDevice === 'desktop' ? 'device-active' : ''}`} ref={desktopRef} tabIndex={-1}><div className="device-top"><div><span className="device-icon">▤</span><strong>电脑 / 深度整理</strong></div><span>目标设备</span></div>{lab.handoffStep < 2 ? <div className="desktop-empty"><span className="empty-symbol">↗</span><strong>等你把想法带过来。</strong><p>点击「在电脑继续」，体验同一任务的跨端接力。</p></div> : <><div className="desktop-context"><span>本地模拟 · 虚构会话</span>{lab.layers.context ? <><p><strong>目标</strong>{lab.contextGoal || '尚未填写'}</p><p><strong>约束</strong>{lab.contextConstraint || '尚未填写'}</p></> : <p>上下文层已关闭。目标与约束不会自动恢复。</p>}</div><div className="conversation"><div className="chat-date">同一虚构会话 #D-204 · {lab.layers.history ? '历史已恢复' : '历史层已关闭'}</div>{lab.layers.history ? lab.messages.map(item => <MessageBubble key={item.id} message={item} />) : <div className="missing-layer">会话列表可见，但历史消息没有恢复。试试开启 History 层。</div>}</div><div className="device-bottom"><Composer value={draft} setValue={setDraft} onSend={sendDemoMessage} label="电脑端示例消息" /></div></>}</div>
            </div>
            <div className="handoff-actions"><div className="bridge-caption"><span className="bridge-icon">↗</span><p><strong>点按钮后看电脑区域。</strong><br />这里模拟理想的接力效果，不会同步真实聊天。</p></div><div className="button-row">{handoffAction()}<button className="quiet-button" type="button" onClick={resetDemo}>重置演示</button></div></div>
          </section>}

          {lab.activeModule === 'continuity' && <section className="module-panel" aria-labelledby="continuity-title"><div className="panel-head"><div><p className="eyebrow">02 / 三层状态</p><h3 id="continuity-title">连续性，不止是聊天记录。</h3><p>逐层关闭，看看用户究竟失去什么。修改上下文后再回到接力模块，它会保留。</p></div><span className="status-pill">LOCAL STATE SAVED</span></div><div className="layer-grid">{(['history', 'context', 'execution'] as Layer[]).map((layer, index) => <button key={layer} className={`layer-card ${lab.layers[layer] ? 'is-on' : 'is-off'}`} type="button" role="switch" aria-checked={lab.layers[layer]} onClick={() => setLab(current => ({ ...current, layers: { ...current.layers, [layer]: !current.layers[layer] } }))}><span className="layer-index">0{index + 1} / {layer.toUpperCase()}</span><span className="layer-switch"><i /></span><strong>{layer === 'history' ? '看见完整过去' : layer === 'context' ? '理解正在做什么' : '接住未完成的事'}</strong><small>{layer === 'history' ? '会话、消息、引用和顺序。' : layer === 'context' ? '目标、约束、来源和待办。' : '任务状态、工具结果与安全检查点。'}</small></button>)}</div><div className="continuity-details"><div className="context-editor"><p className="eyebrow">CONTEXT / 可编辑的理解</p><label htmlFor="context-goal">当前目标</label><textarea id="context-goal" value={lab.contextGoal} onChange={event => patch({ contextGoal: event.target.value })} rows={3} /><label htmlFor="context-constraint">已确认约束</label><textarea id="context-constraint" value={lab.contextConstraint} onChange={event => patch({ contextConstraint: event.target.value })} rows={3} /><p className="field-note">改动只保存在这台浏览器，不会发送给任何服务。</p></div><div className="execution-card"><p className="eyebrow">EXECUTION / 示例任务</p><div className="run-header"><strong>整理三条路线</strong><span className={`run-badge ${lab.runStatus}`}>{lab.runStatus === 'paused' ? '已暂停' : lab.runStatus === 'running' ? '进行中' : lab.runStatus === 'waiting' ? '等你选择' : lab.runStatus === 'completed' ? '已完成' : '失败'}</span></div><ol className="task-list"><li className="done">收集公开笔记 <span>已完成</span></li><li className="done">提取地点与交通 <span>已完成</span></li><li className={lab.runStatus === 'completed' ? 'done' : ''}>比较路线并写稿 <span>{lab.runStatus === 'completed' ? '已完成' : '待继续'}</span></li></ol><p className="checkpoint">Checkpoint · 已保存任务目标和前两步结果。恢复不会重复执行已完成的模拟步骤。</p><div className="run-actions"><button type="button" onClick={() => patch({ runStatus: 'running' })}>运行</button><button type="button" onClick={() => patch({ runStatus: 'paused' })}>暂停</button><button type="button" onClick={() => patch({ runStatus: 'completed' })}>完成</button><button type="button" onClick={() => patch({ runStatus: 'failed' })}>模拟失败</button></div></div></div><div className="impact-strip"><strong>当前接力能力</strong><p>{!lab.layers.history ? '没有历史：用户需要重新讲述对话。' : !lab.layers.context ? '只有历史：Agent 还需重新理解目标。' : !lab.layers.execution ? '保留目标，但未完成任务的状态没有接上。' : '历史、上下文与任务状态都能被接住。'}</p><button className="text-link" type="button" onClick={() => patch({ activeModule: 'handoff' })}>回到接力演示 ↗</button></div></section>}

          {lab.activeModule === 'diagnostic' && <section className="module-panel" aria-labelledby="diagnostic-title"><div className="panel-head"><div><p className="eyebrow">03 / 观察 ≠ 根因</p><h3 id="diagnostic-title">把“不同步”说具体。</h3><p>输入妳亲眼看到的结果，工具会给出下一步排查方向，不替官方判断故障。</p></div><span className="status-pill">MANUAL INPUT</span></div><div className="diagnostic-layout"><form className="diagnostic-form" onSubmit={event => event.preventDefault()}><div className="form-grid"><label>从哪里开始<select value={lab.diagnostic.source} onChange={event => setLab(current => ({ ...current, diagnostic: { ...current.diagnostic, source: event.target.value as Device } }))}><option value="mobile">小红书 App 内置点点</option><option value="desktop">点点 PC Web</option></select></label><label>去哪里继续<select value={lab.diagnostic.destination} onChange={event => setLab(current => ({ ...current, diagnostic: { ...current.diagnostic, destination: event.target.value as Device } }))}><option value="desktop">点点 PC Web</option><option value="mobile">小红书 App 内置点点</option></select></label><label>会话类型<select value={lab.diagnostic.conversation} onChange={event => setLab(current => ({ ...current, diagnostic: { ...current.diagnostic, conversation: event.target.value as 'new' | 'old' } }))}><option value="new">新建测试会话</option><option value="old">已有历史会话</option></select></label><label>目标端观察<select value={lab.diagnostic.observed} onChange={event => setLab(current => ({ ...current, diagnostic: { ...current.diagnostic, observed: event.target.value as Observation } }))}><option value="missing">没有出现</option><option value="partial">只出现部分内容</option><option value="found">完整出现</option></select></label></div><div className="check-grid"><label><input type="checkbox" checked={lab.diagnostic.sameAccount} onChange={event => setLab(current => ({ ...current, diagnostic: { ...current.diagnostic, sameAccount: event.target.checked } }))} />两端是同一账号</label><label><input type="checkbox" checked={lab.diagnostic.refreshed} onChange={event => setLab(current => ({ ...current, diagnostic: { ...current.diagnostic, refreshed: event.target.checked } }))} />目标端刷新后已复查</label><label><input type="checkbox" checked={lab.diagnostic.contextPresent} onChange={event => setLab(current => ({ ...current, diagnostic: { ...current.diagnostic, contextPresent: event.target.checked } }))} />继续提问时保留关键上下文</label></div></form><div className="diagnostic-result" aria-live="polite"><p className="eyebrow">INITIAL READOUT / 基于手动输入</p><span className="result-layer">{diagnosticResult(lab.diagnostic).layer}</span><h4>{diagnosticResult(lab.diagnostic).title}</h4><p>{diagnosticResult(lab.diagnostic).explanation}</p><div className="next-step"><strong>下一步验证</strong><span>{diagnosticResult(lab.diagnostic).next}</span></div><button className="action-button" type="button" onClick={copyDiagnostic}>{copied ? '报告已复制 ✓' : '复制测试记录 ↗'}</button><small>此工具不会读取点点账号、聊天或浏览器数据。</small></div></div></section>}

          {lab.activeModule === 'metrics' && <section className="module-panel" aria-labelledby="metrics-title"><div className="panel-head"><div><p className="eyebrow">04 / DUAL-VALUE METRICS</p><h3 id="metrics-title">好的接力，省下多少重新开始？</h3><p>切换两个虚构场景，看业务采用与人的价值怎样一起变化。以下全部是 Demo Data。</p></div><span className="demo-stamp">SIMULATED<br />DATA ONLY</span></div><div className="scenario-switch" role="group" aria-label="模拟场景"><button type="button" className={lab.metricScenario === 'current' ? 'selected' : ''} onClick={() => patch({ metricScenario: 'current' })}>示例 A · 体验断裂</button><button type="button" className={lab.metricScenario === 'proposed' ? 'selected' : ''} onClick={() => patch({ metricScenario: 'proposed' })}>示例 B · 完整接力</button></div><MetricsView scenario={lab.metricScenario} /></section>}
        </section>

        <section className="closing"><p className="eyebrow">THE PRODUCT QUESTION</p><h2>技术最终应该<br />把什么还给人？</h2><p>不必反复解释自己的目标，也不必把控制权交出去。让复杂性有秩序，让注意力有去处。</p><span>CAPTURE ANYWHERE. CONTINUE ANYWHERE. CREATE WITHOUT STARTING OVER.</span></section>
      </main>
      <footer className="footer"><span>DOTS CONTINUITY LAB © 2026</span><span>独立概念提案 · 与小红书官方无关 · 全部交互在本地模拟</span><a href="https://github.com/esthersjw/esther-design-system" target="_blank" rel="noreferrer">设计参考：ESTHER 不二 · CC BY-NC-SA 4.0 ↗</a><a href="#top">回到顶部 ↑</a></footer>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  return <div className={`message ${message.role === 'user' ? 'message-user' : 'message-assistant'}`}><span>{message.role === 'user' ? '你' : '示例 Agent'}</span><p>{message.text}</p>{message.note && <div className="note-ref">◈ {message.note} <small>虚构引用</small></div>}</div>;
}

function Composer({ value, setValue, onSend, label }: { value: string; setValue: (value: string) => void; onSend: () => void; label: string }) {
  return <div className="composer"><label className="sr-only" htmlFor={label}>{label}</label><input id={label} value={value} onChange={event => setValue(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') onSend(); }} placeholder="继续问一句（预设回复）" /><button type="button" onClick={onSend} disabled={!value.trim()} aria-label={`发送${label}`}>↑</button></div>;
}

function MetricsView({ scenario }: { scenario: 'current' | 'proposed' }) {
  const data = sampleMetrics[scenario];
  const cards = [
    { label: '跨端接力成功率', value: percent(data.handoffs, data.attempts), formula: `${data.handoffs} 次成功继续 / ${data.attempts} 次尝试`, kind: 'human' },
    { label: '上下文恢复率', value: percent(data.contextRestored, data.handoffs), formula: `${data.contextRestored} 次恢复关键背景 / ${data.handoffs} 次可评估接力`, kind: 'human' },
    { label: '恢复工作耗时', value: median(data.resumeMinutes), formula: `${data.resumeMinutes.length} 次成功接力的中位数`, kind: 'human' },
    { label: '重复输入率', value: percent(data.repeated, data.attempts), formula: `${data.repeated} 次需要重述 / ${data.attempts} 次尝试`, kind: 'human' },
    { label: '用户控制感', value: percent(data.agencyPositive, data.surveyed), formula: `${data.agencyPositive} 人主观认可 / ${data.surveyed} 人问卷`, kind: 'human' },
    { label: '跨端功能采用率', value: percent(data.adopted, data.eligible), formula: `${data.adopted} 人采用 / ${data.eligible} 人符合条件`, kind: 'business' },
  ];
  return <><div className="metric-grid">{cards.map(card => <div className="metric-card" key={card.label}><span className="metric-kind">{card.kind === 'human' ? 'HUMAN VALUE' : 'BUSINESS VALUE'}</span><strong>{card.value}</strong><h4>{card.label}</h4><p>{card.formula}</p></div>)}</div><div className="metric-foot"><strong>读数方法</strong><p>成功率的分子是恢复目标会话并完成一次有效继续的次数。控制感来自示例问卷，不能用点击次数代替。采用率展示业务价值；重复输入与恢复耗时检验用户是否真正省力。</p><span>这是虚构的对照数据，不代表点点或任何竞品的真实运营结果。</span></div></>;
}

export default App;
