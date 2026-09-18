// 演示数据 —— 全部为模拟资料，正式交付时替换为真实信源
// Data for the demo. All records are SIMULATED and must be labeled as such.

export type ConfLevel = 1 | 2 | 3 | 4 // 1待交叉 2双源印证 3三源印证 4存在冲突

export interface FeedItem {
  id: string
  title: string
  meta: string
  channel: "政策" | "招投标" | "项目公告" | "内部资料" | "冲突识别"
  conf: ConfLevel
  hot?: boolean
  note: string
  cross: string
}

export const FEEDS: FeedItem[] = [
  {
    id: "f1",
    title: "江苏：新版分时电价政策公开征求意见",
    meta: "江苏省发改委 · 2 小时前",
    channel: "政策",
    conf: 1,
    hot: true,
    note: "峰谷价差预计扩大至 0.7 元/kWh 以上，直接改善工商业储能套利模型。已在「变化与更新」生成复核任务。",
    cross: "尚无独立信源交叉印证，已列入待研清单，标记高优先级。",
  },
  {
    id: "f2",
    title: "山东 200MWh 独立储能项目第三次延期公示",
    meta: "山东省公共资源交易中心 · 5 小时前",
    channel: "项目公告",
    conf: 2,
    note: "该项目为山东机会判断的支撑证据之一，连续延期触发自动降级复核，核验状态由「推进中」降为「存疑」。",
    cross: "公告原文 + 省交易平台历史记录双源印证。",
  },
  {
    id: "f3",
    title: "园区业主访谈纪要归档：确认年内储能采购预算",
    meta: "客户访谈 · 昨天",
    channel: "内部资料",
    conf: 3,
    note: "内部信号与江苏招投标数据交叉印证，江苏「需求真实度」评分上调。信源等级：内部一手。",
    cross: "访谈纪要 + 招投标公告 + 渠道交流记录，三源印证。",
  },
  {
    id: "f4",
    title: "华东储能系统集成招标 32 起，环比 +18%",
    meta: "自动归集 · 昨天",
    channel: "招投标",
    conf: 2,
    note: "外部热度信号。经与落地率历史数据比对，华东招投标→并网转化率约 41%，热度判定为「中高真实」。",
    cross: "交易平台数据 + 行业平台统计，双源印证。",
  },
  {
    id: "f5",
    title: "竞争对手 X 宣布工商业储能整机降价 8%",
    meta: "行业资讯 · 2 天前",
    channel: "招投标",
    conf: 2,
    note: "两家媒体 + 一份渠道交流纪要印证，竞争维度评分已更新，江苏进入条件中价格空间收窄。",
    cross: "媒体公告 + 渠道交流纪要（内部），双源印证。",
  },
  {
    id: "f6",
    title: "西北某示范项目并网投运（实拍影像归档）",
    meta: "项目公告 + 实地调研 · 3 天前",
    channel: "项目公告",
    conf: 3,
    note: "公告与实地调研双信源核验通过，是少数「热度 = 真实」的西北样本，已录入案例库。",
    cross: "并网公示 + 实地影像（内部），三源印证。",
  },
  {
    id: "f7",
    title: "两条电价数据打架：行业平台 0.65 vs 官方附表 0.61 元/kWh",
    meta: "自动比对 · 3 天前",
    channel: "冲突识别",
    conf: 4,
    note: "两条资料并列保留、标明冲突点（是否含输配电价）；裁决前该数据不作为收益模型输入。",
    cross: "冲突未裁决。研究员核对官方原文后可裁决并附理由。",
  },
]

export const CONF_META: Record<ConfLevel, { label: string; badge: "amber" | "sky" | "default" | "violet" }> = {
  1: { label: "待交叉", badge: "amber" },
  2: { label: "双源印证", badge: "sky" },
  3: { label: "三源印证", badge: "default" },
  4: { label: "存在冲突", badge: "violet" },
}

// ---- KPI ----
export interface Kpi {
  key: string
  label: string
  value: number
  suffix?: string
  foot: string
  footTone: "up" | "amber" | "muted"
  target?: string
  spark: number[]
}

export const KPIS: Kpi[] = [
  {
    key: "proj",
    label: "在跟踪项目",
    value: 126,
    foot: "18 条进展存疑待核验",
    footTone: "amber",
    target: "verify",
    spark: [64, 72, 78, 90, 96, 104, 112, 118, 126],
  },
  {
    key: "region",
    label: "重点区域",
    value: 5,
    foot: "江苏机会分本周上调",
    footTone: "up",
    target: "compare",
    spark: [3.2, 3.4, 3.4, 4.1, 4.1, 4.4, 4.6, 4.8, 5],
  },
  {
    key: "policy",
    label: "本月新政策",
    value: 9,
    foot: "2 条对布局判断有影响",
    footTone: "amber",
    spark: [2, 3, 3, 5, 5, 6, 7, 8, 9],
  },
  {
    key: "update",
    label: "结论更新 · 30 天",
    value: 4,
    foot: "均有留痕依据，可逐条溯源",
    footTone: "muted",
    target: "updates",
    spark: [0, 1, 1, 2, 2, 2, 3, 3, 4],
  },
]

// ---- 热度真伪 ----
export const HYPE = [
  { name: "工商业储能 · 华东", hype: 62, verified: 46 },
  { name: "独立储能 · 山东", hype: 88, verified: 21 },
  { name: "风光配储 · 西北", hype: 54, verified: 17 },
  { name: "虚拟电厂 · 全国", hype: 71, verified: 9 },
]

// ---- 内外信源结构 ----
export const SOURCE_MIX = [
  { name: "政策 / 招投标（外部）", value: 46, fill: "var(--chart-1)" },
  { name: "项目公告（外部）", value: 22, fill: "var(--chart-4)" },
  { name: "访谈 / 调研（内部）", value: 21, fill: "var(--chart-3)" },
  { name: "内部项目资料", value: 11, fill: "var(--chart-5)" },
]

// ---- 项目核验 ----
export type ProjStatus = "ok" | "risk" | "new"

export interface Project {
  name: string
  region: string
  scale: string
  chain: [boolean, boolean, boolean, boolean]
  lastAction: string
  status: ProjStatus
  statusLabel: string
}

export const CHAIN_STAGES = ["签约属实", "审批备案", "建设核验", "并网投产"] as const

export const PROJECTS: Project[] = [
  { name: "盐城工业园区储能二期", region: "江苏 · 工商业", scale: "45MWh", chain: [true, true, true, true], lastAction: "并网公示 09-15", status: "ok", statusLabel: "已核验" },
  { name: "济南独立储能电站", region: "山东 · 独立储能", scale: "200MWh", chain: [true, true, false, false], lastAction: "公示第三次延期", status: "risk", statusLabel: "存疑" },
  { name: "苏州某制造企业用户侧储能", region: "江苏 · 工商业", scale: "12MWh", chain: [true, true, true, false], lastAction: "业主融资确认中", status: "new", statusLabel: "推进中" },
  { name: "张家口风光配储项目", region: "河北 · 风光配储", scale: "120MWh", chain: [true, true, true, true], lastAction: "实地调研影像归档", status: "ok", statusLabel: "已核验" },
  { name: "合肥产业园储能集采", region: "安徽 · 工商业", scale: "30MWh", chain: [true, false, false, false], lastAction: "仅见签约新闻", status: "risk", statusLabel: "存疑" },
  { name: "常州虚拟电厂聚合项目", region: "江苏 · VPP", scale: "8MWh", chain: [true, true, true, false], lastAction: "试点方案公示", status: "new", statusLabel: "推进中" },
]

// ---- 区域对比 ----
export interface Region {
  key: string
  name: string
  score: number
  dims: [number, number, number, number, number]
  verdictTag: "default" | "sky" | "amber" | "secondary"
  verdictLabel: string
  entry: string[]
  verdict: string
}

export const DIM_NAMES = ["需求真实度", "落地转化率", "政策稳定度", "渠道匹配度", "盈利空间"]

export const REGIONS: Region[] = [
  {
    key: "js",
    name: "江苏",
    score: 8.2,
    dims: [82, 64, 78, 88, 71],
    verdictTag: "default",
    verdictLabel: "推荐优先布局",
    entry: ["渠道：需本地集成商合作（已谈 2 家）", "价格：整机降价 8% 后空间收窄", "资质：需备案 + 电网接入批复", "运维：需本地化运维团队（缺口）"],
    verdict: "需求经招投标 × 业主访谈双通道核验为真；竞争加剧但尚未固化；最大缺口是运维本地化，属可补齐项。",
  },
  {
    key: "zj",
    name: "浙江",
    score: 7.4,
    dims: [76, 68, 70, 74, 66],
    verdictTag: "sky",
    verdictLabel: "第二优先",
    entry: ["政策：峰谷价差全国最优", "价格：竞争烈度中等", "资质：备案流程约 45 天", "运维：杭州可设点"],
    verdict: "价差政策最优，需求真实度高，但公司渠道积累弱于江苏，建议随江苏项目组网跟进。",
  },
  {
    key: "gd",
    name: "广东",
    score: 6.9,
    dims: [70, 72, 58, 64, 72],
    verdictTag: "secondary",
    verdictLabel: "跟踪仓",
    entry: ["政策：现货市场衔接中", "价格：价差波动大", "资质：接入批复周期长", "渠道：本地竞争者密集"],
    verdict: "电力现货改革带来想象空间，但规则未定型，季度复核即可。",
  },
  {
    key: "sd",
    name: "山东",
    score: 6.5,
    dims: [74, 52, 58, 66, 60],
    verdictTag: "secondary",
    verdictLabel: "观察仓",
    entry: ["政策：容量补偿政策存变数", "价格：独立储能收益承压", "资质：示范项目门槛高", "渠道：电网侧关系需重建"],
    verdict: "政策热度高但项目落地率仅 24%，建议政策明朗前不重仓。",
  },
  {
    key: "nx",
    name: "宁夏",
    score: 5.1,
    dims: [48, 44, 52, 70, 38],
    verdictTag: "amber",
    verdictLabel: "暂缓",
    entry: ["政策：强配储执行趋严", "价格：收益依赖租赁费", "资质：需省级竞配", "运维：远程运维降本"],
    verdict: "需求依赖强配政策，真实付费意愿弱，仅跟踪不布局。",
  },
]

// ---- 企业能力 ----
export interface Cap {
  name: string
  score: number
  note: string
  source: string
}

export const CAPS: Cap[] = [
  { name: "渠道能力", score: 78, note: "已谈定 2 家本地集成商，基本匹配", source: "BD 周报 09-12" },
  { name: "产品适配", score: 85, note: "工商业机型齐全，无需新开", source: "产品线台账 v3" },
  { name: "资金实力", score: 62, note: "单项目垫资上限 3000 万，需分期", source: "财务口径 2026-Q3" },
  { name: "运维网络", score: 35, note: "无本地运维团队 → 成立条件", source: "运维部确认 09-02" },
  { name: "政企关系", score: 58, note: "省能源局有接触，市级空白", source: "政府事务纪要" },
]

export const CONDITIONS = [
  "① 运维本地化：3 个月内组建苏州运维点（否则降级为渠道合作模式）",
  "② 价格线：对手再降价超 5% 时重算收益模型",
  "③ 政策线：江苏分时电价终稿落定后 5 个工作日内完成复核",
]

// ---- 变化更新 ----
export interface UpdateStep {
  who: "sys" | "ai" | "human"
  title: string
  desc: string
}

export const EVENT_STEPS: UpdateStep[] = [
  {
    who: "sys",
    title: "事件接入：江苏发改委发布新版分时电价政策（征求意见稿）",
    desc: "外部信源自动归集 · 自动打标：影响盈利空间维度",
  },
  {
    who: "ai",
    title: "研究复核任务生成 #R-0918-03",
    desc: "关联决策案 v1.4 中的「江苏工商业储能」结论，触发条件：政策线 ③",
  },
  {
    who: "ai",
    title: "收益模型重算：峰谷价差 0.61 → 0.72 元/kWh",
    desc: "工商业储能 IRR 由 8.4% 上修至 10.9%，引用模型：内部测算台账",
  },
  {
    who: "ai",
    title: "江苏机会分 8.2 → 8.6，「盈利空间」 71 → 79",
    desc: "需人工确认后生效 · 依据：政策原文 §4 + 电价历史数据",
  },
  {
    who: "ai",
    title: "生成待确认版本：决策案 v1.5（草稿）",
    desc: "与 v1.4 并列对比：布局建议由「优先布局」强化为「加快落地」；旧版保留并标注待复核",
  },
  {
    who: "human",
    title: "业务负责人复核通过，v1.5 升为已确认版本",
    desc: "确认 = 接受本版研究表达（非全部事实已核实）；确认人与时间留痕，v1.4 进入历史记录",
  },
]

export const HISTORY = [
  {
    time: "09-12 14:20",
    title: "山东某 200MWh 项目核验降级",
    impact: "影响 2 项结论",
    tone: "amber" as const,
    desc: "招标公示期三次延期、业主方融资未落地 → 状态由「推进中」降为「存疑」，山东机会分 −0.3，决策案自动提示复核。",
  },
  {
    time: "09-05 09:03",
    title: "竞争对手 X 宣布华东降价 8%",
    impact: "影响竞争维度",
    tone: "violet" as const,
    desc: "江苏、浙江竞争分下调，进入条件中「价格空间」由充足收窄为一般，已在决策案 v1.3 留痕。",
  },
  {
    time: "08-28 16:45",
    title: "客户访谈新增 3 份（内部资料）",
    impact: "印证需求信号",
    tone: "sky" as const,
    desc: "华东某园区业主确认年内储能采购预算，与招投标信号交叉印证，江苏需求真实度上调。",
  },
]

// 机会分走势（演示用小图，P5 触发事件后追加 8.6 数据点）
export const SCORE_TREND_BASE = [
  { date: "07-01", score: 7.1 },
  { date: "07-15", score: 7.3 },
  { date: "08-01", score: 7.6 },
  { date: "08-15", score: 7.9 },
  { date: "09-01", score: 8.2 },
  { date: "09-15", score: 8.2 },
]
