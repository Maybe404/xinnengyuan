// 演示数据 —— 真实公开资料口径 + 明确标注的模拟业务数据（混合数据）
// All simulated business data is explicitly labeled. Public-policy citations are real-sourced.

// ============ 类型 ============

export type DataProp = "真实公开" | "真实内部" | "模拟"
export type VerifyState = "待核验" | "已核验" | "存在冲突" | "已失效"
export type AdviceTier = "优先跟进" | "条件进入" | "持续观察" | "暂缓推进"
export type DimLevel = "高" | "中" | "低" | "资料不足"

// ============ 专题（P01） ============

export interface TopicRecord {
  id: string
  name: string
  question: string
  scope: string[]
  period: string
  deadline: string
  stage: string
  owner: string
  capabilityVersion: string
  criteriaVersion: string
  currentVersion: string | null
  materialIds: "all" | string[]
  stationKeys: "all" | string[]
  regionKeys: "all" | string[]
}

export const TOPIC: TopicRecord = {
  id: "T-2026-003",
  name: "新能源场站配储布局研究 · 苏浙粤",
  question:
    "比较江苏、浙江、广东三省新能源场站配套储能机会，识别优先研究区域与重点论证场站，明确配置方向与成立条件，支持下一步配储论证安排。",
  scope: ["江苏", "浙江", "广东"],
  period: "2026-04-01 ~ 2026-12-31",
  deadline: "2026-12-31",
  stage: "区域比较 + 场站论证",
  owner: "演示账号 · 张远（战略研究）",
  capabilityVersion: "CAP-2026-09",
  criteriaVersion: "STD-v2",
  currentVersion: "v1.4（已确认 09-12）",
  materialIds: "all",
  stationKeys: "all",
  regionKeys: "all",
}

export const TOPIC_RUDONG: TopicRecord = {
  id: "T-2026-004",
  name: "如东光伏基地增配储能论证",
  question:
    "围绕南通如东 300MW 光伏基地存量增配，核验招标口径、限发依据与结算前提，给出配置方案方向及成立条件，支持进入配储方案论证。",
  scope: ["江苏"],
  period: "2026-07-01 ~ 2026-12-31",
  deadline: "2026-12-31",
  stage: "配储方案论证",
  owner: "演示账号 · 张远（战略研究）",
  capabilityVersion: "CAP-2026-09",
  criteriaVersion: "STD-v2",
  currentVersion: null,
  materialIds: ["M-001", "M-006", "M-010", "M-013", "M-017"],
  stationKeys: ["rd"],
  regionKeys: ["js"],
}

export const PRESET_TOPICS: TopicRecord[] = [TOPIC, TOPIC_RUDONG]

export const TOPIC_STATS = [
  { label: "已导入资料", value: 0, sub: "", target: "materials" },
  { label: "证据记录", value: 0, sub: "", target: "materials" },
  { label: "在跟踪场站", value: 0, sub: "", target: "compare" },
  { label: "声量 N / 证据 V", value: "—", sub: "", target: "compare" },
]

// ============ 情报资料（P02） ============

export type MatType =
  | "政策"
  | "电价与市场规则"
  | "招投标"
  | "项目公告"
  | "行业与技术数据"
  | "客户访谈"
  | "实地调研"
  | "内部项目资料"

export interface MaterialFact {
  text: string
  state: VerifyState
  result?: string
}

export interface Material {
  id: string
  title: string
  type: MatType
  prop: DataProp
  source: string
  url?: string
  published: string // 发布时间，未知则 "未知"
  region: string
  object: string
  excerpt: string
  loc: string
  facts: MaterialFact[]
}

export const MATERIALS: Material[] = [
  {
    id: "M-001",
    title: "江苏省发改委关于完善分时电价机制的通知（征求意见稿）",
    type: "政策",
    prop: "真实公开",
    source: "江苏省发改委官网",
    url: "https://fzggw.jiangsu.gov.cn/",
    published: "2026-09-18",
    region: "江苏",
    object: "全省工商业及场站",
    excerpt:
      "「工商业用户及新能源场站配套储能峰谷价差进一步拉大，尖峰电价上浮不低于 20%，低谷电价下浮不低于 55%……」（§4 价格机制）",
    loc: "第 4 节 · 第 2 段",
    facts: [
      { text: "江苏拟调整分时电价，尖峰上浮 ≥20%、低谷下浮 ≥55%", state: "待核验" },
      { text: "该政策为征求意见稿，尚未生效", state: "已核验", result: "支持事实" },
    ],
  },
  {
    id: "M-002",
    title: "广东电力现货市场衔接方案（2026 修订版）",
    type: "电价与市场规则",
    prop: "真实公开",
    source: "广东电力交易中心",
    url: "https://www.gd.csg.cn/",
    published: "2026-08-22",
    region: "广东",
    object: "省内市场主体",
    excerpt: "「新能源场站配建储能可作为独立主体参与现货报量报价，调度权限按并网调度协议执行……」（§3.2）",
    loc: "第 3 章第 2 节",
    facts: [
      { text: "广东场站配储可参与现货市场", state: "已核验", result: "支持事实" },
      { text: "结算口径为节点电价，与江苏目录电价不可直接比较", state: "已核验", result: "适用范围不同" },
    ],
  },
  {
    id: "M-003",
    title: "浙江省 2026 年新能源消纳与配储要求汇编",
    type: "政策",
    prop: "真实公开",
    source: "浙江省能源局",
    url: "https://fzggw.zj.gov.cn/",
    published: "2026-07-30",
    region: "浙江",
    object: "新建风电光伏场站",
    excerpt: "「新建陆上风电、集中式光伏项目按不低于装机 10%、时长 2 小时配置储能……存量场站鼓励增配……」（§2）",
    loc: "第 2 节",
    facts: [
      { text: "浙江新建场站配储要求 10%×2h", state: "已核验", result: "支持事实" },
      { text: "存量场站增配无强制比例，为鼓励性政策", state: "已核验", result: "支持事实" },
    ],
  },
  {
    id: "M-004",
    title: "盐城响水 400MW 风电场配储项目并网公示",
    type: "项目公告",
    prop: "真实公开",
    source: "江苏省电力公司公示平台",
    published: "2026-09-15",
    region: "江苏",
    object: "响水风电场",
    excerpt: "「响水风电场配套储能二期（80MW/160MWh）于 09-12 完成并网调试……」",
    loc: "公示正文第 1 段",
    facts: [{ text: "响水风电场配储二期已并网", state: "已核验", result: "支持事实" }],
  },
  {
    id: "M-005",
    title: "山东某 200MWh 独立储能三期延期公告（对照样本）",
    type: "项目公告",
    prop: "真实公开",
    source: "山东省公共资源交易中心",
    published: "2026-09-13",
    region: "山东（对照）",
    object: "济南独立储能",
    excerpt: "「因业主融资安排调整，本项目并网时间第三次顺延……」",
    loc: "公告正文",
    facts: [{ text: "签约项目可能长期不落地，项目阶段须以证据为准", state: "已核验", result: "支持事实" }],
  },
  {
    id: "M-006",
    title: "南通如东光伏基地增配储能招标公告",
    type: "招投标",
    prop: "真实公开",
    source: "国网商城",
    published: "2026-09-08",
    region: "江苏",
    object: "如东光伏基地",
    excerpt: "「如东 300MW 光伏基地存量增配储能 45MW/90MWh，采用租赁容量模式……」",
    loc: "招标公告 §1",
    facts: [{ text: "如东基地存在存量增配招标（45MW/90MWh）", state: "已核验", result: "支持事实" }],
  },
  {
    id: "M-007",
    title: "台州某风电场业主访谈纪要",
    type: "客户访谈",
    prop: "模拟",
    source: "内部访谈 · 记录者：李工",
    published: "2026-09-02",
    region: "浙江",
    object: "台州某风电场（模拟）",
    excerpt: "「业主确认明年有增配预算，倾向 2 小时系统，关注限发时段的削峰能力……」",
    loc: "纪要第 3 页 · 段落 5",
    facts: [{ text: "台州场站业主有增配意愿（模拟情景）", state: "待核验" }],
  },
  {
    id: "M-008",
    title: "阳江海上风电配储调度运行约束说明",
    type: "电价与市场规则",
    prop: "真实公开",
    source: "广东电网调度中心",
    published: "2026-08-05",
    region: "广东",
    object: "阳江海上风电",
    excerpt: "「海上风电配建储能充电须在出力受限时段执行，调度指令优先级高于自主套利……」（§5 运行约束）",
    loc: "第 5 节",
    facts: [
      { text: "广东海风配储充电窗口受调度约束", state: "已核验", result: "支持事实" },
      { text: "自主套利空间受调度指令压缩（幅度待测算）", state: "待核验" },
    ],
  },
  {
    id: "M-009",
    title: "行业平台电价数据 0.65 元/kWh（与官方附表冲突）",
    type: "行业与技术数据",
    prop: "真实公开",
    source: "某行业数据平台",
    published: "2026-09-10",
    region: "江苏",
    object: "江苏工商业电价",
    excerpt: "「江苏大工业峰谷价差 0.65 元/kWh」——与省发改委附表 0.61 元/kWh 口径不一致（疑含输配电价）。",
    loc: "平台数据页",
    facts: [{ text: "行业平台 0.65 与官方 0.61 口径冲突", state: "存在冲突" }],
  },
  {
    id: "M-010",
    title: "江苏省发改委电价附表（冲突对照方）",
    type: "电价与市场规则",
    prop: "真实公开",
    source: "江苏省发改委官网",
    url: "https://fzggw.jiangsu.gov.cn/",
    published: "2026-01-15",
    region: "江苏",
    object: "江苏大工业电价",
    excerpt: "「大工业（两部制）峰谷价差 0.61 元/kWh，不含输配电价……」",
    loc: "附表 2",
    facts: [{ text: "官方口径价差 0.61 元/kWh（不含输配电价）", state: "已核验", result: "支持事实" }],
  },
  {
    id: "M-011",
    title: "华东储能系统集成招标统计（09 月）",
    type: "行业与技术数据",
    prop: "真实公开",
    source: "自动归集统计",
    published: "2026-09-16",
    region: "华东",
    object: "系统集成商",
    excerpt: "华东区域储能系统集成公开招标 32 起，环比 +18%，其中场站配储占比 61%。",
    loc: "统计表",
    facts: [{ text: "华东场站配储招标活跃度上升", state: "已核验", result: "支持事实" }],
  },
  {
    id: "M-012",
    title: "盐城响水风电场实地调研影像与记录",
    type: "实地调研",
    prop: "模拟",
    source: "内部调研 · 王工、陈工",
    published: "2026-08-28",
    region: "江苏",
    object: "响水风电场",
    excerpt: "「升压站东侧有空余场地约 4000㎡，业主电气负责人确认具备扩建条件（模拟情景）……」",
    loc: "调研记录 第 2 节",
    facts: [{ text: "响水场站具备扩建场地条件（模拟情景）", state: "待核验" }],
  },
  {
    id: "M-013",
    title: "公司锂电储能产品线技术台账 v3",
    type: "内部项目资料",
    prop: "真实内部",
    source: "产品部台账",
    published: "2026-08-20",
    region: "—",
    object: "公司能力",
    excerpt: "「现有工商业与大储机型覆盖 0.5C–0.25C，单体容量 280Ah 电芯平台……」",
    loc: "台账 §1",
    facts: [{ text: "公司具备 2h 与 4h 大储系统产品能力", state: "已核验", result: "支持事实" }],
  },
  {
    id: "M-014",
    title: "浙江海上风电配储补偿机制研究简报",
    type: "行业与技术数据",
    prop: "真实公开",
    source: "行业研究机构公开简报",
    published: "2026-06-18",
    region: "浙江",
    object: "浙江海风场站",
    excerpt: "「浙江对海风配储执行容量补偿，补偿标准随现货推进退坡……」",
    loc: "简报第 4 页",
    facts: [{ text: "浙江海风配储存在容量补偿且在退坡", state: "待核验" }],
  },
  {
    id: "M-015",
    title: "竞争对手 X 华东降价 8% 公告",
    type: "行业与技术数据",
    prop: "真实公开",
    source: "两家中立媒体 + 渠道纪要印证",
    published: "2026-09-05",
    region: "华东",
    object: "竞争格局",
    excerpt: "「X 公司宣布其大储系统华东区域交付价格下调 8%，涉及场站配储项目……」",
    loc: "公告转载（原始出处已登记）",
    facts: [{ text: "竞争方 X 华东降价 8%（双源印证）", state: "已核验", result: "支持事实" }],
  },
  {
    id: "M-016",
    title: "广东阳江某海风场站出力受限数据（模拟）",
    type: "内部项目资料",
    prop: "模拟",
    source: "场站运行数据（模拟）",
    published: "2026-08-30",
    region: "广东",
    object: "阳江某海风场站（模拟）",
    excerpt: "「Q3 出力受限时段占发电时段 17%，主要集中在午间光伏大发时段……」",
    loc: "数据表 附 A",
    facts: [{ text: "阳江场站午间存在显著限发（模拟情景）", state: "待核验" }],
  },
  {
    id: "M-017",
    title: "如东基地 2026 年限电情况汇报",
    type: "项目公告",
    prop: "真实公开",
    source: "场站月度运行汇报",
    published: "2026-09-01",
    region: "江苏",
    object: "如东光伏基地",
    excerpt: "「1-8 月累计限发约 3.2%，7-8 月午间时段限发比例升至 6.8%……」",
    loc: "汇报 §3",
    facts: [{ text: "如东基地午间限发比例上升", state: "已核验", result: "支持事实" }],
  },
  {
    id: "M-018",
    title: "广东现货市场 2026 年价格波动分析",
    type: "电价与市场规则",
    prop: "真实公开",
    source: "电力交易中心月报",
    published: "2026-09-03",
    region: "广东",
    object: "现货价格",
    excerpt: "「现货均价波动区间同比扩大 40%，午间低谷出现负电价时段……」",
    loc: "月报第 2 章",
    facts: [{ text: "广东现货波动大，午间负电价出现频次增加", state: "已核验", result: "支持事实" }],
  },
]

export const MAT_TABS: { key: string; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "政策", label: "政策" },
  { key: "电价与市场规则", label: "电价与规则" },
  { key: "招投标", label: "招投标" },
  { key: "项目公告", label: "项目公告" },
  { key: "行业与技术数据", label: "行业数据" },
  { key: "客户访谈", label: "访谈" },
  { key: "实地调研", label: "调研" },
  { key: "内部项目资料", label: "内部资料" },
]

// ============ 区域比较（P03） 七维 ============

export const SEVEN_DIMS = [
  "场站配置需求",
  "政策与市场条件",
  "并网调度约束",
  "项目进展",
  "竞争压力",
  "实施条件",
  "企业匹配",
] as const

export type SevenDim = (typeof SEVEN_DIMS)[number]

export interface RegionProfile {
  key: string
  name: string
  tier: AdviceTier
  tierNote: string
  dims: Record<SevenDim, DimLevel>
  dimBasis: Partial<Record<SevenDim, string>>
  necessary: { name: string; state: "已核验满足" | "待核验" | "未知" }[]
  weigh: { name: string; note: string }[]
  n: number // 声量：窗口内登记记录（按原始事件去重）
  v: { support: number; refute: number; scopeDiff: number }
  u: number // 待核验
  supplyDemand: { demand: string; supply: string }
  stations: string[] // station keys
}

export const REGIONS_7: RegionProfile[] = [
  {
    key: "js",
    name: "江苏",
    tier: "优先跟进",
    tierNote: "必要条件 4/4 通过，权衡条件对照后确认排序第一",
    dims: {
      场站配置需求: "高",
      政策与市场条件: "中",
      并网调度约束: "中",
      项目进展: "高",
      竞争压力: "中",
      实施条件: "中",
      企业匹配: "高",
    },
    dimBasis: {
      场站配置需求: "如东、响水等场站存在已核验的限发与增配证据（M-006、M-017）",
      政策与市场条件: "分时电价新政征求意见中，生效前按现行 0.61 元/kWh 口径（M-001、M-010）",
      并网调度约束: "配储充电窗口相对宽松，无海风类强制调度条款",
      项目进展: "响水二期已并网、如东增配已招标，阶段证据充分（M-004、M-006）",
      竞争压力: "X 降价 8% 压缩价格空间（M-015）",
      实施条件: "本地集成商合作已谈定，运维缺口为待补足项",
      企业匹配: "渠道、产品能力匹配度高（CAP-2026-09）",
    },
    necessary: [
      { name: "场站配储准入资格", state: "已核验满足" },
      { name: "电价结算口径明确", state: "已核验满足" },
      { name: "公司资质与产品线覆盖", state: "已核验满足" },
      { name: "资金额度（单省上限）", state: "已核验满足" },
    ],
    weigh: [
      { name: "存量场站资源密度", note: "江苏在跟踪场站 3 个，居三省之首" },
      { name: "政策稳定度", note: "目录电价为主，规则连续性较好" },
      { name: "竞争烈度", note: "集成商密集但尚未固化" },
    ],
    n: 12,
    v: { support: 8, refute: 0, scopeDiff: 1 },
    u: 3,
    supplyDemand: {
      demand: "需求侧：3 个在跟踪场站，2 个有已核验增配/新建证据",
      supply: "供给/竞争侧：同类配储项目 4 个在建或已并网，集成商 5+ 家（统计范围：已登记资料）",
    },
    stations: ["xs", "rd", "yw"],
  },
  {
    key: "zj",
    name: "浙江",
    tier: "条件进入",
    tierNote: "必要条件 3/4，容量补偿退坡节奏为待核实项",
    dims: {
      场站配置需求: "中",
      政策与市场条件: "中",
      并网调度约束: "低",
      项目进展: "中",
      竞争压力: "中",
      实施条件: "中",
      企业匹配: "中",
    },
    dimBasis: {
      场站配置需求: "新建场站 10%×2h 强制配储；存量增配为鼓励性（M-003），需求证据待核验",
      政策与市场条件: "容量补偿在退坡，收益模型需按节点重算（M-014）",
      并网调度约束: "海风占比较高，调度约束相对宽松但需逐站确认",
      项目进展: "台州场站增配意愿目前仅有模拟访谈支撑（M-007）",
      竞争压力: "本省集成商中等密度",
      实施条件: "杭州可设运维点，备案流程约 45 天",
      企业匹配: "渠道积累弱于江苏",
    },
    necessary: [
      { name: "场站配储准入资格", state: "已核验满足" },
      { name: "容量补偿适用性（目标场站）", state: "待核验" },
      { name: "公司资质与产品线覆盖", state: "已核验满足" },
      { name: "资金额度（单省上限）", state: "已核验满足" },
    ],
    weigh: [
      { name: "海风资源占比", note: "舟山、台州海风带场站密度高" },
      { name: "政策稳定度", note: "补偿退坡节奏是主要不确定项" },
      { name: "竞争烈度", note: "低于江苏" },
    ],
    n: 9,
    v: { support: 3, refute: 0, scopeDiff: 1 },
    u: 4,
    supplyDemand: {
      demand: "需求侧：2 个在跟踪场站，需求证据以强制配储条款推演为主",
      supply: "供给/竞争侧：同类配储项目 2 个，集成商 3 家（资料覆盖不全，格局待核验）",
    },
    stations: ["tz", "zs"],
  },
  {
    key: "gd",
    name: "广东",
    tier: "持续观察",
    tierNote: "必要条件 2/4，现货衔接规则与调度约束两项未知，未进入排序",
    dims: {
      场站配置需求: "中",
      政策与市场条件: "资料不足",
      并网调度约束: "高",
      项目进展: "低",
      竞争压力: "中",
      实施条件: "资料不足",
      企业匹配: "低",
    },
    dimBasis: {
      场站配置需求: "阳江海风限发证据目前为模拟数据（M-016），不计入真实统计",
      政策与市场条件: "现货报量报价规则可适用，但收益模型输入不足（M-002、M-018）",
      并网调度约束: "海风配储充电受调度指令约束，自主套利空间压缩（M-008）",
      项目进展: "在跟踪场站均处早期，无阶段证据",
      竞争压力: "本地竞争者密集，暂无完整统计",
      实施条件: "接入批复周期长，本地关系空白",
      企业匹配: "无省级渠道积累",
    },
    necessary: [
      { name: "现货市场主体资格（配储）", state: "未知" },
      { name: "调度约束对收益的影响测算", state: "待核验" },
      { name: "公司资质与产品线覆盖", state: "已核验满足" },
      { name: "资金额度（单省上限）", state: "已核验满足" },
    ],
    weigh: [
      { name: "现货改革红利", note: "波动扩大可能提升配储价值，但规则未定型" },
      { name: "海风资源", note: "阳江、汕尾海风带长期空间大" },
    ],
    n: 8,
    v: { support: 2, refute: 1, scopeDiff: 0 },
    u: 2,
    supplyDemand: {
      demand: "需求侧：1 个在跟踪场站，真实需求证据不足（模拟数据不计入）",
      supply: "供给/竞争侧：同类项目登记 1 个，市场边界待核验，不推导供需缺口",
    },
    stations: ["yj"],
  },
]

// 维度定性 → 雷达数值（仅可视化映射，不构成综合分）
export const LEVEL_NUM: Record<DimLevel, number | null> = {
  高: 3,
  中: 2,
  低: 1,
  资料不足: null,
}

// ============ 场站与配储项目（P04，从比较页下钻） ============

export interface StorageProject {
  name: string
  kind: "新建" | "存量增配" | "改造"
  stage: string
  stageDate: string
  mw: number | null
  mwh: number | null
  hours: number | null // 名义时长 = 容量÷功率（人工给定须核对）
  tech: string
  evidence: { stage: string; state: VerifyState; src: string }[]
}

export interface Station {
  key: string
  name: string
  region: string
  owner: string
  type: "风电" | "光伏" | "海上风电"
  capacityMW: number
  prop: DataProp
  run: { curtailment: string; grid: string; dispatch: string }
  value: { source: string; settle: string; gap: string }
  projects: StorageProject[]
}

export const STATIONS: Station[] = [
  {
    key: "xs",
    name: "响水风电场（盐城）",
    region: "江苏",
    owner: "省属能源集团",
    type: "风电",
    capacityMW: 400,
    prop: "真实公开",
    run: { curtailment: "1-8 月限发约 2.1%（M-004 关联汇报）", grid: "220kV 升压站，有空余间隔", dispatch: "配储自主调度为主" },
    value: { source: "峰谷套利 + 容量租赁", settle: "目录电价结算", gap: "扩建场地条件为模拟情景（M-012）" },
    projects: [
      {
        name: "响水配储二期",
        kind: "存量增配",
        stage: "已并网",
        stageDate: "2026-09-12",
        mw: 80,
        mwh: 160,
        hours: 2,
        tech: "锂电 0.5C",
        evidence: [
          { stage: "签约属实", state: "已核验", src: "M-004" },
          { stage: "审批备案", state: "已核验", src: "M-004" },
          { stage: "建设核验", state: "已核验", src: "实地记录" },
          { stage: "并网投产", state: "已核验", src: "M-004 公示" },
        ],
      },
    ],
  },
  {
    key: "rd",
    name: "如东光伏基地（南通）",
    region: "江苏",
    owner: "新能源开发公司",
    type: "光伏",
    capacityMW: 300,
    prop: "真实公开",
    run: { curtailment: "7-8 月午间限发 6.8% 且上升（M-017）", grid: "110kV 接入", dispatch: "午间受限时段可充电" },
    value: { source: "限发时段削峰 + 套利", settle: "目录电价结算", gap: "租赁模式收益归属待测算" },
    projects: [
      {
        name: "如东增配储能（租赁模式）",
        kind: "存量增配",
        stage: "招标中",
        stageDate: "2026-09-08 挂网",
        mw: 45,
        mwh: 90,
        hours: 2,
        tech: "锂电 0.5C（基准情景）",
        evidence: [
          { stage: "签约属实", state: "待核验", src: "招标尚未定标" },
          { stage: "审批备案", state: "待核验", src: "—" },
          { stage: "建设核验", state: "待核验", src: "—" },
          { stage: "并网投产", state: "待核验", src: "—" },
        ],
      },
    ],
  },
  {
    key: "yw",
    name: "盐城沿海风电聚合群（跟踪）",
    region: "江苏",
    owner: "多家业主",
    type: "风电",
    capacityMW: 620,
    prop: "真实公开",
    run: { curtailment: "限发比例 2-3%", grid: "集群并网", dispatch: "统一调度" },
    value: { source: "容量租赁为主", settle: "目录电价", gap: "业主分散，逐家谈判成本高" },
    projects: [
      {
        name: "聚合配储方案（论证中）",
        kind: "新建",
        stage: "论证阶段",
        stageDate: "—",
        mw: null,
        mwh: null,
        hours: null,
        tech: "待定（数据不足，不强制输出数值）",
        evidence: [
          { stage: "签约属实", state: "待核验", src: "—" },
          { stage: "审批备案", state: "待核验", src: "—" },
          { stage: "建设核验", state: "待核验", src: "—" },
          { stage: "并网投产", state: "待核验", src: "—" },
        ],
      },
    ],
  },
  {
    key: "tz",
    name: "台州某风电场（模拟）",
    region: "浙江",
    owner: "民营电力集团（模拟）",
    type: "海上风电",
    capacityMW: 250,
    prop: "模拟",
    run: { curtailment: "业主访谈确认存在限发（模拟，M-007）", grid: "220kV 登陆接入", dispatch: "海风调度约束需逐站确认" },
    value: { source: "容量补偿 + 削峰", settle: "补偿标准退坡中，按节点重算", gap: "内部资料全部为模拟，结论为情景研判" },
    projects: [
      {
        name: "台州增配储能（意向）",
        kind: "存量增配",
        stage: "意向阶段",
        stageDate: "—",
        mw: null,
        mwh: null,
        hours: null,
        tech: "倾向 2h 锂电（业主口径，模拟）",
        evidence: [
          { stage: "签约属实", state: "待核验", src: "M-007（模拟）" },
          { stage: "审批备案", state: "待核验", src: "—" },
          { stage: "建设核验", state: "待核验", src: "—" },
          { stage: "并网投产", state: "待核验", src: "—" },
        ],
      },
    ],
  },
  {
    key: "zs",
    name: "舟山海上风电基地（跟踪）",
    region: "浙江",
    owner: "央企海风平台",
    type: "海上风电",
    capacityMW: 800,
    prop: "真实公开",
    run: { curtailment: "限发数据未取得（口径待确认）", grid: "500kV 集中送出", dispatch: "调度约束文件待导入" },
    value: { source: "补偿机制 + 现货（衔接中）", settle: "按浙江规则，节点待核", gap: "资料缺口：调度约束、限发数据" },
    projects: [],
  },
  {
    key: "yj",
    name: "阳江某海上风电场（模拟）",
    region: "广东",
    owner: "海风开发公司（模拟）",
    type: "海上风电",
    capacityMW: 500,
    prop: "模拟",
    run: { curtailment: "Q3 受限时段占 17%（模拟，M-016）", grid: "500kV 送出", dispatch: "充电须在受限时段，指令优先（M-008）" },
    value: { source: "现货套利 + 削峰", settle: "节点电价，波动大（M-018）", gap: "收益模型输入不足，待测算" },
    projects: [
      {
        name: "阳江配储论证（模拟情景）",
        kind: "新建",
        stage: "论证阶段",
        stageDate: "—",
        mw: null,
        mwh: null,
        hours: null,
        tech: "基准锂电 + 液流长时情景对比（数据不足待定）",
        evidence: [
          { stage: "签约属实", state: "待核验", src: "M-016（模拟）" },
          { stage: "审批备案", state: "待核验", src: "—" },
          { stage: "建设核验", state: "待核验", src: "—" },
          { stage: "并网投产", state: "待核验", src: "—" },
        ],
      },
    ],
  },
]

// ============ 企业能力档案（P07） ============

export interface CapField {
  group: string
  name: string
  value: string
  unit?: string
  region: string
  prop: DataProp
  source: string
  updated: string
}

export const CAP_FIELDS: CapField[] = [
  { group: "场站资源", name: "在跟踪场站（苏浙粤）", value: "6", unit: "个", region: "苏浙粤", prop: "真实内部", source: "BD 台账", updated: "2026-09-10" },
  { group: "场站资源", name: "业主合作关系（江苏）", value: "省属集团已建立接触", region: "江苏", prop: "真实内部", source: "政府事务纪要", updated: "2026-09-02" },
  { group: "场站资源", name: "业主合作关系（浙江/广东）", value: "未建立", region: "浙江、广东", prop: "真实内部", source: "BD 确认", updated: "2026-08-30" },
  { group: "技术", name: "大储产品线", value: "0.5C–0.25C 全覆盖（2h/4h）", region: "全国", prop: "真实内部", source: "产品台账 v3（M-013）", updated: "2026-08-20" },
  { group: "技术", name: "长时技术路线储备", value: "液流合作意向（未经工程验证）", region: "全国", prop: "模拟", source: "技术部假设", updated: "2026-07-15" },
  { group: "投资建设", name: "单省投资额度上限", value: "8000", unit: "万元", region: "单省", prop: "真实内部", source: "财务口径 2026-Q3", updated: "2026-09-01" },
  { group: "投资建设", name: "单项目垫资上限", value: "3000", unit: "万元", region: "全国", prop: "真实内部", source: "财务口径 2026-Q3", updated: "2026-09-01" },
  { group: "运维", name: "本地运维团队（江苏）", value: "无 → 成立条件", region: "江苏", prop: "真实内部", source: "运维部确认", updated: "2026-09-02" },
  { group: "运维", name: "杭州运维点可行性", value: "已评估可行（假设）", region: "浙江", prop: "模拟", source: "运维部测算", updated: "2026-08-25" },
  { group: "关键约束", name: "不参与纯租赁无运营权项目", value: "适用全部项目", region: "全国", prop: "真实内部", source: "投资委员会议定", updated: "2026-06-10" },
]

// ============ 深度研究（P05） ============

export const RESEARCH = {
  target: "专题整体 · 三省比较 + 如东场站深挖",
  tiers: [
    { tier: "优先跟进", region: "江苏", note: "必要条件 4/4 通过，权衡条件确认排序第一（确认人：张远 09-11）" },
    { tier: "条件进入", region: "浙江", note: "容量补偿适用性待核实后进入论证；补足前不视为通过排序门槛" },
    { tier: "持续观察", region: "广东", note: "观察现货规则定型与调度约束测算，季度检查计划已设" },
  ] as { tier: AdviceTier; region: string; note: string }[],
  config: {
    station: "如东光伏基地",
    power: "40–50 MW（建议区间，输入假设见依据）",
    hours: "2 h（与招标口径一致）；4 h 情景单列，不与基准相加",
    tech: "基准：磷酸铁锂 0.5C。对比情景：液流 4h（适用长时约束场景，工程验证缺失，保留为待核验分析项）",
    service: "系统集成 + 建期托管运维；不含长期资产持有",
    economy: "价值项：限发削峰（已核验）、峰谷套利（已核验口径）；容量租赁收益为假设项，单列不计入基准。衰减、运维成本为待测算项",
    pending: ["液流路线工程验证", "租赁模式收益归属", "现货价格序列（浙江）"],
  },
}

// 结论三层（事实/推断/假设）随版本变化 —— v1.5 由动态更新触发
export function researchConclusion(confirmed: boolean, pending: boolean) {
  if (confirmed) {
    return {
      fact: "江苏大工业峰谷价差现行 0.61 元/kWh（M-010 官方附表）；新政征求意见稿拟进一步拉大价差（M-001，未生效）。",
      inference:
        "建议加快江苏场站配储论证推进：必要条件全部通过、需求证据充分（如东、响水），新政若生效将进一步改善收益模型——推理链见成立条件与更新链路。",
      hypothesis:
        "省级储能补贴延续至 2027（待验证：省财政厅年度预算公示）；租赁模式收益归属（待测算）。",
    }
  }
  if (pending) {
    return {
      fact: "江苏大工业峰谷价差现行 0.61 元/kWh（M-010）；新政征求意见稿拟拉大至约 0.72 元/kWh（M-001，未生效，待确认后计入）。",
      inference:
        "建议优先布局江苏场站配储：必要条件全部通过、需求证据充分；新政若确认生效，建议档位拟由「优先跟进」强化推进节奏——待人工复核。",
      hypothesis: "省级储能补贴延续至 2027（待验证）；租赁模式收益归属（待测算）。",
    }
  }
  return {
    fact: "江苏大工业峰谷价差现行 0.61 元/kWh（M-010 官方附表）；竞争方 X 华东降价 8%（M-015，双源印证）。",
    inference:
      "建议优先跟进江苏场站配储：必要条件全部通过、需求证据充分（如东增配招标、响水二期并网）、渠道与产品能力匹配；缺口为运维本地化，已列为成立条件。",
    hypothesis: "分时电价新政生效节奏（征求意见中）；省级补贴延续至 2027（待验证）。",
  }
}

export const CONDITIONS_R = [
  "① 运维本地化：3 个月内组建盐城/南通运维点，否则降级为设备交付 + 第三方运维模式",
  "② 价格线：竞争方再降价超 5% 时重算收益模型并复核建议档位",
  "③ 政策线：分时电价新政终稿发布后 5 个工作日内完成收益重算与版本复核",
  "④ 租赁线：如东租赁模式收益归属明确前，该项目价值按削峰+套利基准计",
]

export const ACTIONS = [
  { text: "核验 M-001 新政原文与生效条件", owner: "张远", due: "09-22", state: "处理中" },
  { text: "导入舟山调度约束文件（缺口）", owner: "李工", due: "09-25", state: "待处理" },
  { text: "解决电价口径冲突（M-009 vs M-010）", owner: "王工", due: "09-20", state: "处理中" },
  { text: "运维本地化方案评审", owner: "运维部", due: "10-15", state: "待处理" },
  { text: "响水扩建场地条件实地复核（模拟资料替换）", owner: "陈工", due: "10-08", state: "待处理" },
]

// ============ 动态跟踪（P06） ============

export interface EventStep {
  who: "sys" | "ai" | "human"
  title: string
  desc: string
}

export const EVENT_STEPS_7: EventStep[] = [
  {
    who: "sys",
    title: "新资料导入：江苏分时电价新政征求意见稿（M-001，真实公开）",
    desc: "导入触发「分析新增资料」——仅分析本专题已导入内容，不命名为全网监测",
  },
  {
    who: "ai",
    title: "依赖反查：定位引用电价口径的结论与配置方向",
    desc: "受影响结论 2 条：江苏建议档位、如东收益模型前提；能力依赖无变化",
  },
  {
    who: "ai",
    title: "影响分析：收益前提变化，但新政未生效",
    desc: "新政为征求意见稿 → 基准口径维持 0.61，新政情景单列；不直接改写已确认版本",
  },
  {
    who: "ai",
    title: "生成待确认研究版本 v1.5（草稿）",
    desc: "与 v1.4 差异：江苏档位注释更新 + 新政情景单列；旧版保留，标记「依据有变化需复核」",
  },
  {
    who: "human",
    title: "业务负责人复核，v1.5 提交待确认",
    desc: "复核依据：M-001 原文 §4 + M-010 官方口径；确认前 v1.4 仍为当前正式版本",
  },
  {
    who: "human",
    title: "版本确认：v1.5 升为当前正式版本",
    desc: "确认 = 接受本版研究表达，非全部事实已核实；v1.4 转为只读历史，待核验事项继续展示",
  },
]

export const HISTORY_EVENTS = [
  {
    time: "09-13 10:20",
    title: "项目公告：山东对照样本三次延期（M-005）",
    impact: "方法校准",
    tone: "amber" as const,
    desc: "重申「签约≠投产」核验规则，对照样本不计入三省统计；已确认版本不改动。",
  },
  {
    time: "09-05 09:03",
    title: "竞争变化：X 公司华东降价 8%（M-015）",
    impact: "影响 2 项结论",
    tone: "violet" as const,
    desc: "江苏竞争维度与价格空间条件更新，v1.4 已纳入；浙江竞争统计待补充资料。",
  },
  {
    time: "08-28 16:45",
    title: "实地调研归档：响水场地条件（M-012，模拟）",
    impact: "模拟情景入库",
    tone: "sky" as const,
    desc: "模拟属性传播至关联证据与结论；相关结论标记「情景研判」，不计入真实统计。",
  },
  {
    time: "08-22 11:10",
    title: "资料导入：广东现货衔接方案（M-002）",
    impact: "口径差异提示",
    tone: "secondary" as const,
    desc: "广东节点电价与江苏目录电价不可直接比较，跨省比较已标注不可比原因。",
  },
]

export const VERSION_HISTORY = [
  { ver: "v1.5", state: "待确认", date: "09-18", note: "新政情景单列 + 档位注释更新（当前演示确认中）" },
  { ver: "v1.4", state: "已确认", date: "09-12", note: "三省档位确认；如东配置方向基准（当前正式版本）" },
  { ver: "v1.3", state: "历史", date: "09-05", note: "纳入 X 降价影响" },
  { ver: "v1.2", state: "历史", date: "08-28", note: "响水模拟调研入库，情景研判标记" },
  { ver: "v1.1", state: "历史", date: "08-22", note: "广东口径差异处理规则" },
  { ver: "v1.0", state: "历史", date: "08-15", note: "初始草稿" },
]

// ============ 通用 ============

export const STATION_STATUS: Record<string, { label: string; note: string }> = {
  xs: { label: "已并网跟踪", note: "二期已投运，本专题不作新建排序对象" },
  rd: { label: "优先论证", note: "省内单独生成：招标中 + 限发证据已核验" },
  yw: { label: "证据不足并列", note: "配置参数未知，不虚构排序名次" },
  tz: { label: "情景跟进", note: "仅有模拟访谈，结论为情景研判" },
  zs: { label: "资料缺口", note: "调度约束与限发数据未导入" },
  yj: { label: "持续观察", note: "模拟场站，不计入真实机会排序" },
}

export interface SourceRow {
  org: string
  url: string
  topic: string
  owner: string
  freq: string
  lastOk: string
  next: string
  status: "正常" | "检查失败" | "无变化"
  lastResult: string
}

export const SOURCES: SourceRow[] = [
  {
    org: "江苏省发改委",
    url: "https://fzggw.jiangsu.gov.cn/",
    topic: "电价与配储政策",
    owner: "张远",
    freq: "每周",
    lastOk: "2026-09-18",
    next: "2026-09-25",
    status: "正常",
    lastResult: "新增资料 M-001",
  },
  {
    org: "浙江省能源局",
    url: "https://fzggw.zj.gov.cn/",
    topic: "新建场站配储要求",
    owner: "李工",
    freq: "每周",
    lastOk: "2026-09-11",
    next: "2026-09-18",
    status: "无变化",
    lastResult: "无新增文件",
  },
  {
    org: "广东电力交易中心",
    url: "https://www.gd.csg.cn/",
    topic: "现货衔接规则",
    owner: "王工",
    freq: "每周",
    lastOk: "2026-09-10",
    next: "2026-09-17",
    status: "检查失败",
    lastResult: "入口超时，未更新最后成功检查时间",
  },
  {
    org: "江苏省电力公司公示平台",
    url: "https://www.js.sgcc.com.cn/",
    topic: "并网与项目公示",
    owner: "张远",
    freq: "每周",
    lastOk: "2026-09-15",
    next: "2026-09-22",
    status: "正常",
    lastResult: "新增资料 M-004",
  },
]

export function factKey(materialId: string, factIndex: number) {
  return `${materialId}#${factIndex}`
}

export function filterMaterials(all: Material[], topic: TopicRecord) {
  if (topic.materialIds === "all") return all
  const allow = new Set(topic.materialIds)
  return all.filter((m) => allow.has(m.id))
}

export function filterStations(topic: TopicRecord) {
  if (topic.stationKeys === "all") return STATIONS
  const allow = new Set(topic.stationKeys)
  return STATIONS.filter((s) => allow.has(s.key))
}

export function filterRegions(topic: TopicRecord) {
  if (topic.regionKeys === "all") return REGIONS_7
  const allow = new Set(topic.regionKeys)
  return REGIONS_7.filter((r) => allow.has(r.key))
}

export function materialStats(list: Material[]) {
  let verified = 0
  let pending = 0
  let conflict = 0
  let vSupport = 0
  let facts = 0
  for (const m of list) {
    for (const f of m.facts) {
      facts++
      if (f.state === "已核验") {
        verified++
        if (f.result === "支持事实" && m.prop !== "模拟") vSupport++
      } else if (f.state === "待核验") pending++
      else if (f.state === "存在冲突") conflict++
    }
  }
  const realPublic = list.filter((m) => m.prop === "真实公开").length
  const n = list.filter((m) => m.prop !== "模拟").length
  return { facts, verified, pending, conflict, realPublic, n, vSupport }
}

export const PROP_BADGE: Record<DataProp, "default" | "amber" | "violet"> = {
  真实公开: "default",
  真实内部: "amber",
  模拟: "violet",
}

export const VERIFY_BADGE: Record<VerifyState, "default" | "amber" | "violet" | "secondary"> = {
  已核验: "default",
  待核验: "amber",
  存在冲突: "violet",
  已失效: "secondary",
}

export const TIER_BADGE: Record<AdviceTier, "default" | "sky" | "amber" | "secondary"> = {
  优先跟进: "default",
  条件进入: "sky",
  持续观察: "amber",
  暂缓推进: "secondary",
}
