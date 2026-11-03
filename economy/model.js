/* 经济沙盘的教学模型：一个按季度推演的小型开放经济。
   方向与量级对，系数是为了讲清机制挑的，不能拿来预测。
   浏览器里挂在 window.EconModel，node 里 module.exports。 */
(function (g) {
  "use strict";

  const DEFAULTS = {
    rateMode: "auto", // auto：央行按规则调息；manual：手动定死
    rate: 3,          // 手动利率（%）
    hawk: 1.5,        // 央行对通胀的反应力度（>1 才压得住通胀）
    dG: 0,            // 政府支出变化（占 GDP 的百分点）
    dGdur: 0,         // 支出变化持续几个季度（0 = 一直持续）
    dT: 0,            // 税收变化（占 GDP 的百分点）
    mon: 0,           // 赤字里由央行印钞填补的比例（0–1）
    oil: 0,           // 油价变化（%）
    ext: 0,           // 外需变化（%）
    flight: 0,        // 资本外逃 / 风险溢价（百分点）
    crash: 0,         // 资产价格崩跌幅度（%）
    fx: "float",      // float 浮动；peg 钉住美元；union 共同货币（如欧元）
    debtCur: "own",   // own 本币借债；foreign 外币借债
    b0: 60,           // 初始政府债务（占 GDP %）
    pdebt: "mid",     // 私人负债水平：low / mid / high
    reserves: 6       // 外汇储备（可支付几个月进口），钉住汇率时才用得到
  };

  const N = 40, SHOCK = 4;                 // 推演 10 年，第 2 年开头施加变化
  const GSTAR = 2, RSTAR = 1, TGT = 2;     // 潜在增速、中性实际利率、通胀目标
  const IF = 3, PIF = 2;                   // 外国名义利率、外国通胀
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function simulate(input) {
    const p = Object.assign({}, DEFAULTS, input || {});
    const canPrint = p.debtCur === "own" && p.fx !== "union";
    const mon = canPrint ? clamp(p.mon, 0, 1) : 0;
    const pdK = { low: 0, mid: 0.5, high: 1.3 }[p.pdebt] ?? 0.5;

    let y = 0, pi = TGT, pe = TGT, i = RSTAR + TGT, q = 0, E = 100, b = p.b0, R = p.reserves;
    let ieff = i, d = 0, asset = 0, bs = 0, broken = false, yHist = [];
    const pd0 = ((GSTAR + TGT) - (RSTAR + TGT)) * p.b0 / 100; // 让债务率在基线下基本持平
    d = pd0 + ieff * b / 100;

    const out = { q: [], growth: [], unemp: [], infl: [], rate: [], fx: [], nx: [], debt: [], res: [], deficit: [], gap: [],
                  events: [], params: p, canPrint, N, SHOCK };

    for (let t = 0; t < N; t++) {
      const on = t >= SHOCK;
      const dG = on && (!p.dGdur || t < SHOCK + p.dGdur) ? p.dG : 0, dT = on ? p.dT : 0, ext = on ? p.ext : 0;
      const flight = on ? p.flight * Math.pow(0.93, t - SHOCK) : 0;   // 恐慌会慢慢退潮
      const m = on ? mon : 0;
      if (t === SHOCK) asset = -p.crash * 0.28;

      // 风险溢价：资本外逃 + 债务太重时市场要的补偿。不能自己印钱的国家，债务门槛低得多
      const debtRisk = canPrint ? Math.max(0, (b - 160) * 0.03)
                                : Math.min(12, Math.max(0, (b - 90) * 0.035) + Math.max(0, (d - 4) * 0.2));
      const rho = clamp(flight + debtRisk, 0, 20);

      // 政策利率
      const pegged = (p.fx === "peg" && !broken);
      let iTarget;
      if (p.fx === "union") iTarget = IF;                              // 利率由共同央行定，管不了本国
      else if (pegged) iTarget = IF + 0.5 * rho;                       // 钉住汇率：利率只能跟着外国走，再加一点去护盘
      else if (m > 0.3) iTarget = RSTAR + TGT + 0.2 * (pi - TGT);      // 央行替财政印钱，等于放弃控通胀
      else iTarget = RSTAR + TGT + p.hawk * (pi - TGT) + 0.5 * y;      // 反应力度 >1，实际利率才会随通胀上升
      iTarget = clamp(iTarget, 0, 90);
      const zlb = iTarget <= 0.01 && !pegged && p.fx !== "union";
      if (p.rateMode === "manual" && on && !pegged && p.fx !== "union") i = p.rate;
      else i = (pegged || p.fx === "union") ? iTarget : 0.55 * i + 0.45 * iTarget;
      i = Math.max(0, i);

      // 汇率：q 是实际汇率（+ 为本币更值钱），E 是名义汇率指数（起点 100）
      const qPrev = q, ePrev = E;
      const qTarget = clamp(3 * (clamp(i - pe, -10, 20) - (IF - PIF)) - 3 * rho - (on ? 0.03 * p.oil : 0), -45, 40);
      if (p.fx === "float" || broken) {
        q = q + 0.4 * (qTarget - q);
        E = Math.max(1e-15, E * Math.exp(((q - qPrev) - (pi - PIF) / 4) / 100));
      } else {
        // 名义汇率钉死：本国通胀高于外国，本币就在「实际上」越来越贵
        q = q + (pi - PIF) / 4;
        if (pegged) {
          const pressure = clamp(qTarget - q, -40, 40);
          R = R + pressure * 0.2 + nxPrev() * 0.1;
          if (R <= 0 && t >= SHOCK) {
            broken = true; R = 0;
            const jump = Math.min(-15, qTarget - q - 20);
            q = q + jump;
            E = E * Math.exp(jump / 100);
            out.events.push({ t, k: "peg", text: "外汇储备耗尽，钉住汇率被迫放弃，本币一次性大幅贬值" });
          }
        }
      }
      const dq = q - qPrev;
      const dEpct = (E / ePrev - 1) * 100;

      // 外币债务的资产负债表效应：本币一贬值，外债按本币算就变重
      if (p.debtCur === "foreign" && dEpct < 0) bs += dEpct * 0.35;
      bs *= 0.9;

      // 总需求：财政、外部、利率、资产价格、债务通缩、恶性通胀的破坏
      const fiscal = 1.0 * dG - 0.6 * dT;
      const extern = -0.07 * q + 0.3 * ext;
      const oilY = on ? -0.015 * p.oil : 0;
      const rD = i + 0.5 * rho - pe;
      const rateEff = clamp(rD - RSTAR, -6, 20);
      const debtDefl = pdK * Math.max(0, -pi) * 1.1;
      const hyperHit = -Math.min(30, Math.max(0, pi - 40) * 0.03);
      const yT = fiscal + extern + oilY + asset + bs - 1.0 * rateEff - debtDefl + hyperHit;
      const yPrev = y;
      y = clamp(0.7 * y + 0.3 * yT, -25, 15);
      asset *= 0.975;

      // 通胀：预期 + 需求压力 + 成本冲击 + 汇率传导 + 印钞
      const cost = (on && t < SHOCK + 4) ? p.oil * 0.022 : 0;
      const pass = -0.25 * dq * 4 * (pi > 30 ? 0 : 1);
      const M = 20 * Math.exp(-Math.max(0, pe) / 140);                 // 通胀越高，大家越不愿持有现金
      const mu = m > 0 ? 100 * m * Math.max(0, d) / M : 0;             // 印钞带来的货币增速（年化 %）
      const piPrev = pi;
      // 价格向下有黏性：工资很难降，所以衰退里物价是慢慢磨下去的
      const slope = (y < 0 && pe < 1) ? 0.1 : 0.3;
      pi = pe + slope * y + cost + pass + (m > 0 ? 0.5 * Math.max(0, mu + GSTAR - pe) : 0);
      pi = clamp(pi, -6, 1e6);
      const alpha = pi < 0 ? 0.15 : 0.25 + Math.min(0.6, Math.max(0, pi) / 200);
      pe = pe + alpha * (pi - pe);
      if (p.hawk >= 1 && m === 0) pe += 0.04 * (TGT - pe);              // 央行可信，预期被锚在目标附近
      pe = clamp(pe, -10, 1e6);

      // 财政：基本赤字 + 利息；通胀太高时税收追不上物价（坦齐效应）
      const tanzi = Math.min(12, Math.max(0, pi - 20) * 0.03);
      const pdf = pd0 + dG - dT - 0.4 * y + tanzi;
      ieff = 0.88 * ieff + 0.12 * (i + rho);
      d = pdf + ieff * b / 100;
      const gNom = clamp(GSTAR + (y - yPrev) * 4 + pi, -60, 1e6);
      b = b / Math.pow(1 + gNom / 100, 0.25) + (1 - m) * d / 4;
      b = clamp(b, 0, 600);

      const nx = -0.07 * q + 0.25 * ext - 0.22 * y - (on ? 0.012 * p.oil : 0);
      yHist.push(y);
      const growth = GSTAR + y - (t >= 4 ? yHist[t - 4] : 0);

      out.q.push(t);
      out.gap.push(y);
      out.growth.push(growth);
      out.unemp.push(clamp(5 - 0.5 * y, 1, 40));
      out.infl.push(pi);
      out.rate.push(i);
      out.fx.push(E);
      out.nx.push(nx);
      out.debt.push(b);
      out.res.push(p.fx === "peg" ? Math.max(0, R) : null);
      out.deficit.push(d);
      if (zlb && on && !out.events.some(e => e.k === "zlb")) out.events.push({ t, k: "zlb", text: "利率降到零，央行再也降不下去了" });
      if (pi > 100 && !out.events.some(e => e.k === "hyper")) out.events.push({ t, k: "hyper", text: "年通胀破 100%，进入恶性通胀区" });
      if (pi < 0 && piPrev >= 0 && on && !out.events.some(e => e.k === "defl")) out.events.push({ t, k: "defl", text: "物价开始下跌，进入通缩" });
    }
    function nxPrev() { const a = out.nx; return a.length ? a[a.length - 1] : 0; }
    return out;
  }

  const api = { simulate, DEFAULTS, N, SHOCK };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else g.EconModel = api;
})(typeof window !== "undefined" ? window : this);
