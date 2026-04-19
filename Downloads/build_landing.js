const fs = require('fs');
// ─── PALETTE ───────────────────────────────────────────
// Midnight Moss    #3E4A45  — page base
// Deep Charcoal    #2B2F2D  — deeper surfaces / cards
// Earl Grey Core   #5E6361  — secondary surfaces
// Soft Porcelain   #F6F4EF  — primary text / headings
// Muted Mint Veil  #C9D8CC  — borders / rules / dividers
// Pale Sage Silk   #E3EBE4  — subdued accent fills
// Warm Stone Taupe #B8AEA3  — muted / secondary text
// Antique Champagne#CBBE9A  — CTA / monogram / highlights
// ───────────────────────────────────────────────────────

const css = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Cormorant:wght@300;400&display=swap');

*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:#070D1C;font-family:'Cormorant Garamond','Georgia',serif;color:#F6F4EF;overflow-x:hidden}

/* ── NAV ── */
nav{position:sticky;top:0;z-index:100;height:72px;display:flex;align-items:center;justify-content:space-between;padding:0 56px;background:#0A1828;backdrop-filter:blur(20px);border-bottom:1px solid rgba(141,170,162,0.4)}
.nav-mark{display:flex;align-items:center;gap:14px;cursor:pointer}
.nav-ll{width:36px;height:36px;background:transparent;border:1px solid rgba(203,190,154,0.45);display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative}
.nav-ll-inner{font-family:'Helvetica Neue','Arial',sans-serif;font-size:14px;font-weight:300;color:#CBBE9A;letter-spacing:-0.5px;line-height:1;user-select:none}
.nav-brand{display:flex;flex-direction:column;gap:2px}
.nav-brand-name{font-family:'Cormorant Garamond',serif;font-size:13px;letter-spacing:5px;color:#CBBE9A;font-weight:400;text-transform:uppercase;line-height:1}
.nav-brand-sub{font-family:'Helvetica Neue',sans-serif;font-size:7px;letter-spacing:4px;color:rgba(203,190,154,0.45);text-transform:uppercase;font-weight:300}
.nav-links{display:flex;gap:40px}
.nav-link{font-family:'Helvetica Neue',sans-serif;font-size:10px;letter-spacing:3.5px;color:rgba(203,190,154,0.5);text-transform:uppercase;cursor:pointer;transition:color 0.3s;font-weight:300}
.nav-link:hover{color:#CBBE9A}
.nav-cta{font-family:'Helvetica Neue',sans-serif;font-size:9px;letter-spacing:3px;color:#CBBE9A;border:1px solid rgba(203,190,154,0.4);padding:10px 24px;text-transform:uppercase;cursor:pointer;transition:all 0.3s;font-weight:400}
.nav-cta:hover{background:rgba(203,190,154,0.1);border-color:rgba(203,190,154,0.75)}

/* ── HERO ── */
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:100px 40px 80px;background:radial-gradient(ellipse at 50% 42%,#1C3560 0%,#0E1E3A 52%,#070D1C 100%);position:relative;overflow:hidden;border-bottom:2px solid rgba(141,170,162,0.4)}
.hero-vignette{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 40%,rgba(10,20,18,0.25) 100%);pointer-events:none}
.hero-eyebrow{font-family:'Helvetica Neue',sans-serif;font-size:9px;letter-spacing:7px;color:rgba(141,170,162,0.7);text-transform:uppercase;margin-bottom:64px;font-weight:300;position:relative}

/* ── HERO BRAND NAME ── */
.monogram-wrap{display:flex;flex-direction:column;align-items:center;margin-bottom:52px;position:relative}
.monogram-top-rule{width:1px;height:60px;background:linear-gradient(180deg,transparent,rgba(141,170,162,0.35));margin-bottom:36px}
.monogram-name{font-family:'Cormorant Garamond',serif;font-size:clamp(22px,4vw,42px);letter-spacing:0.28em;color:#F6F4EF;font-weight:400;text-transform:uppercase;line-height:1;margin-bottom:18px}

/* Rule with diamond */
.monogram-rule{display:flex;align-items:center;gap:14px;width:min(520px,80vw);margin-bottom:18px}
.monogram-rule-line{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(141,170,162,0.4),transparent)}
.monogram-rule-diamond{width:4px;height:4px;background:rgba(141,170,162,0.55);transform:rotate(45deg);flex-shrink:0}

/* Subtitle */
.monogram-sub{font-family:'Helvetica Neue',sans-serif;font-size:9px;letter-spacing:7px;color:rgba(141,170,162,0.5);text-transform:uppercase;font-weight:300;margin-bottom:36px}
.monogram-bottom-rule{width:1px;height:60px;background:linear-gradient(180deg,rgba(141,170,162,0.35),transparent)}

/* Tagline */
.hero-tagline{font-family:'Cormorant Garamond',serif;font-size:17px;font-style:italic;color:rgba(246,244,239,0.45);letter-spacing:0.5px;margin-bottom:56px;font-weight:300;line-height:1.9;max-width:380px}

/* Buttons */
.hero-btns{display:flex;gap:16px;justify-content:center;margin-bottom:64px}
.btn-primary{font-family:'Helvetica Neue',sans-serif;font-size:9px;letter-spacing:4px;color:#0A1828;background:#8DAAA2;padding:16px 48px;text-transform:uppercase;cursor:pointer;border:1px solid #8DAAA2;transition:all 0.35s;font-weight:400}
.btn-primary:hover{background:#7A9992;border-color:#7A9992}
.btn-outline{font-family:'Helvetica Neue',sans-serif;font-size:9px;letter-spacing:4px;color:rgba(141,170,162,0.65);border:1px solid rgba(141,170,162,0.35);padding:16px 48px;text-transform:uppercase;cursor:pointer;background:transparent;transition:all 0.35s;font-weight:300}
.btn-outline:hover{border-color:rgba(141,170,162,0.75);color:rgba(141,170,162,0.95);background:rgba(141,170,162,0.07)}
.hero-scroll{font-family:'Helvetica Neue',sans-serif;font-size:8px;letter-spacing:4px;color:rgba(141,170,162,0.4);text-transform:uppercase;font-weight:300}
.hero-scroll-line{width:1px;height:48px;background:linear-gradient(180deg,rgba(141,170,162,0.3),transparent);margin:12px auto 0}

/* ── PROOF BAR ── */
.proof{height:84px;display:flex;align-items:center;justify-content:center;gap:56px;background:#0A1828;border-top:1px solid rgba(141,170,162,0.2);border-bottom:2px solid rgba(141,170,162,0.4)}
.proof-stat{text-align:center}
.proof-num{font-family:'Cormorant Garamond',serif;font-size:28px;letter-spacing:2px;color:#CBBE9A;line-height:1;font-weight:400}
.proof-label{font-family:'Helvetica Neue',sans-serif;font-size:8px;letter-spacing:3px;color:rgba(184,174,163,0.6);text-transform:uppercase;margin-top:5px;font-weight:300}
.proof-div{width:1px;height:32px;background:rgba(201,216,204,0.15)}

/* ── SHARED ── */
section{position:relative}
.s-inner{max-width:1100px;margin:0 auto;padding:96px 56px}
.s-eyebrow{font-family:'Helvetica Neue',sans-serif;font-size:8px;letter-spacing:6px;color:rgba(203,190,154,0.5);text-transform:uppercase;margin-bottom:20px;font-weight:300}
.s-heading{font-family:'Cormorant Garamond',serif;font-size:40px;letter-spacing:0.5px;color:#F6F4EF;line-height:1.25;margin-bottom:0;font-weight:300}
.s-rule{width:48px;height:1px;background:linear-gradient(90deg,rgba(201,216,204,0.5),transparent);margin:20px 0 52px}
.s-rule.center{margin:20px auto 52px}

/* ── PROBLEM — MINT ── */
.problem{background:#8DAAA2;border-top:1px solid rgba(0,0,0,0.06);border-bottom:1px solid rgba(0,0,0,0.06)}
.problem-grid{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:start}
.problem .s-eyebrow{color:rgba(0,0,0,0.65)}
.problem .s-heading{color:#000000}
.problem .s-rule{background:linear-gradient(90deg,rgba(0,0,0,0.35),transparent)}
.problem-body{font-family:'Cormorant Garamond',serif;font-size:18px;line-height:2;color:rgba(0,0,0,0.78);font-weight:300}
.pain-cards{display:flex;flex-direction:column;gap:12px}
.pain-card{padding:24px 28px;border:1px solid rgba(0,0,0,0.12);background:rgba(255,255,255,0.35)}
.pain-title{font-family:'Helvetica Neue',sans-serif;font-size:8.5px;letter-spacing:3.5px;color:rgba(0,0,0,0.7);text-transform:uppercase;margin-bottom:10px;font-weight:400}
.pain-body{font-family:'Cormorant Garamond',serif;font-size:16px;color:rgba(0,0,0,0.75);line-height:1.85;font-weight:300}

/* ── HOW — BLACK ── */
.how{background:radial-gradient(ellipse at 50% 30%,#E8E8E8 0%,#CACACA 100%);border-top:2px solid rgba(141,170,162,0.45);border-bottom:2px solid rgba(141,170,162,0.45)}
.how-inner{text-align:center}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:2px}
.step{padding:48px 36px;background:rgba(255,255,255,0.52);border:1px solid rgba(141,170,162,0.28);text-align:left;backdrop-filter:blur(4px)}
.step-num{font-family:'Cormorant Garamond',serif;font-size:60px;color:#8DAAA2;letter-spacing:2px;margin-bottom:20px;line-height:1;font-weight:300}
.step-accent{width:24px;height:1px;background:rgba(141,170,162,0.65);margin-bottom:20px}
.step-title{font-family:'Cormorant Garamond',serif;font-size:21px;letter-spacing:0.3px;color:#1a1a1a;margin-bottom:14px;font-weight:400}
.step-body{font-family:'Cormorant Garamond',serif;font-size:16px;line-height:1.85;color:rgba(0,0,0,0.55);font-weight:300}

/* ── HOW grey overrides ── */
.how .s-eyebrow{color:rgba(141,170,162,1)}
.how .s-heading{color:#1a1a1a}
.how .s-rule.center{background:linear-gradient(90deg,transparent,rgba(141,170,162,0.7),transparent)}

/* ── EXAMPLES — MINT ── */
.examples{background:#8DAAA2}
.examples-inner{text-align:center}
.examples .s-eyebrow{color:rgba(0,0,0,0.7)}
.examples .s-heading{color:#000000}
.examples .s-rule.center{background:linear-gradient(90deg,transparent,rgba(0,0,0,0.35),transparent)}
.ex-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;text-align:left}
.ex-card{background:rgba(255,255,255,0.35);border:1px solid rgba(0,0,0,0.1);overflow:hidden;cursor:pointer;transition:border-color 0.4s,transform 0.4s,box-shadow 0.4s}
.ex-card:hover{border-color:rgba(0,0,0,0.3);transform:translateY(-4px);box-shadow:0 18px 48px rgba(0,0,0,0.18)}
.ex-screen{height:180px;overflow:hidden;display:block;position:relative}
.ex-screen svg{display:block;width:100%;height:180px}
.ex-screen::after{content:'';position:absolute;bottom:0;left:0;right:0;height:40px;background:linear-gradient(transparent,rgba(0,0,0,0.18));pointer-events:none;opacity:0;transition:opacity 0.3s}
.ex-card:hover .ex-screen::after{opacity:1}
.ex-meta{padding:16px 20px 20px;display:flex;align-items:flex-end;justify-content:space-between}
.ex-meta-left{flex:1}
.ex-industry{font-family:'Helvetica Neue',sans-serif;font-size:8px;letter-spacing:3px;color:rgba(0,0,0,0.55);text-transform:uppercase;margin-bottom:5px;font-weight:300}
.ex-name{font-family:'Cormorant Garamond',serif;font-size:18px;letter-spacing:0.3px;color:rgba(0,0,0,0.88);font-weight:400;font-style:italic}
.ex-view-hint{font-family:'Helvetica Neue',sans-serif;font-size:7px;letter-spacing:2.5px;color:rgba(0,0,0,0.3);text-transform:uppercase;font-weight:300;opacity:0;transform:translateX(-4px);transition:opacity 0.35s,transform 0.35s;white-space:nowrap;padding-bottom:2px}
.ex-card:hover .ex-view-hint{opacity:1;transform:translateX(0)}

/* ── LIGHTBOX ── */
.ex-lb{position:fixed;inset:0;z-index:500;background:rgba(0,0,0,0);pointer-events:none;display:flex;align-items:center;justify-content:center;transition:background 0.4s}
.ex-lb.open{background:rgba(4,4,4,0.92);pointer-events:auto;backdrop-filter:blur(8px)}
.ex-lb-wrap{position:relative;width:min(860px,92vw);opacity:0;transform:scale(0.94) translateY(12px);transition:opacity 0.4s,transform 0.4s}
.ex-lb.open .ex-lb-wrap{opacity:1;transform:scale(1) translateY(0)}
.ex-lb-close{position:absolute;top:-50px;right:0;font-family:'Helvetica Neue',sans-serif;font-size:8px;letter-spacing:3px;color:rgba(255,255,255,0.38);text-transform:uppercase;cursor:pointer;border:1px solid rgba(255,255,255,0.18);padding:9px 20px;transition:all 0.25s;background:transparent;display:flex;align-items:center;gap:10px}
.ex-lb-close:hover{color:rgba(255,255,255,0.85);border-color:rgba(255,255,255,0.45)}
.ex-lb-close-x{font-size:12px;font-weight:200;line-height:1}
.ex-lb-svg{display:block;width:100%;height:auto;border:1px solid rgba(255,255,255,0.07)}
.ex-lb-footer{margin-top:20px;display:flex;justify-content:space-between;align-items:center;padding:0 2px}
.ex-lb-industry{font-family:'Helvetica Neue',sans-serif;font-size:7px;letter-spacing:3.5px;color:rgba(255,255,255,0.28);text-transform:uppercase;font-weight:300;margin-bottom:6px}
.ex-lb-name{font-family:'Cormorant Garamond',serif;font-size:26px;color:rgba(255,255,255,0.65);font-weight:300;letter-spacing:0.5px;font-style:italic}
.ex-lb-tag{font-family:'Helvetica Neue',sans-serif;font-size:7px;letter-spacing:2.5px;color:rgba(141,170,162,0.5);text-transform:uppercase;font-weight:300;text-align:right;border:1px solid rgba(141,170,162,0.2);padding:8px 14px}

/* ── PRICING — BLACK ── */
.pricing{background:radial-gradient(ellipse at 50% 30%,#E8E8E8 0%,#C8C8C8 100%);border-top:2px solid rgba(141,170,162,0.45);border-bottom:2px solid rgba(141,170,162,0.45)}
.pricing-inner{text-align:center}
.p-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;max-width:920px;margin:0 auto;text-align:left}
.p-card{padding:46px 34px;background:rgba(255,255,255,0.55);border:1px solid rgba(141,170,162,0.22);backdrop-filter:blur(4px)}
.p-card.feat{border-color:rgba(141,170,162,0.65);background:rgba(255,255,255,0.78)}
.p-tier{font-family:'Helvetica Neue',sans-serif;font-size:8px;letter-spacing:5px;color:rgba(141,170,162,1);text-transform:uppercase;margin-bottom:20px;font-weight:300}
.p-price{font-family:'Cormorant Garamond',serif;font-size:50px;letter-spacing:1px;color:#1a1a1a;margin-bottom:6px;font-weight:300;line-height:1}
.p-price sup{font-size:22px;vertical-align:super;color:rgba(141,170,162,0.85)}
.p-price span{font-family:'Helvetica Neue',sans-serif;font-size:11px;color:rgba(0,0,0,0.38);letter-spacing:1px;font-weight:300}
.p-desc{font-family:'Cormorant Garamond',serif;font-size:16px;color:rgba(0,0,0,0.52);margin-bottom:26px;font-weight:300;line-height:1.7;font-style:italic}
.p-rule{width:100%;height:1px;background:rgba(141,170,162,0.35);margin-bottom:24px}
.p-feat{font-family:'Cormorant Garamond',serif;font-size:15px;color:rgba(0,0,0,0.6);margin-bottom:12px;padding-left:18px;position:relative;font-weight:300;line-height:1.5}
.p-feat::before{content:'';position:absolute;left:0;top:10px;width:7px;height:1px;background:rgba(141,170,162,0.8)}
.p-btn{margin-top:32px;width:100%;font-family:'Helvetica Neue',sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;padding:13px 0;text-align:center;cursor:pointer;border:1px solid rgba(141,170,162,0.35);color:rgba(0,0,0,0.48);background:transparent;transition:all 0.3s;font-weight:300}
.p-btn:hover{border-color:rgba(141,170,162,0.85);color:rgba(0,0,0,0.75)}
.p-btn.signature{background:#8DAAA2;color:#ffffff;border-color:#8DAAA2;font-weight:400}
.p-btn.signature:hover{background:#7A9992;border-color:#7A9992}

/* ── PRICING grey overrides ── */
.pricing .s-eyebrow{color:rgba(141,170,162,1)}
.pricing .s-heading{color:#1a1a1a}
.pricing .s-rule.center{background:linear-gradient(90deg,transparent,rgba(141,170,162,0.7),transparent)}

/* ── TESTI — MINT ── */
.testi{background:#8DAAA2}
.testi-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px}
.testi .s-eyebrow{color:rgba(0,0,0,0.7)}
.testi .s-heading{color:#000000}
.t-card{padding:46px 40px;background:rgba(255,255,255,0.38);border:1px solid rgba(0,0,0,0.1)}
.t-quote{font-family:'Cormorant Garamond',serif;font-size:18px;line-height:1.9;color:rgba(0,0,0,0.82);margin-bottom:28px;letter-spacing:0.15px;font-style:italic;font-weight:300}
.t-rule{width:24px;height:1px;background:rgba(0,0,0,0.4);margin-bottom:16px}
.t-name{font-family:'Helvetica Neue',sans-serif;font-size:9px;letter-spacing:3px;color:rgba(0,0,0,0.75);text-transform:uppercase;font-weight:400}
.t-biz{font-family:'Cormorant Garamond',serif;font-size:15px;color:rgba(0,0,0,0.6);letter-spacing:0.3px;margin-top:5px;font-weight:300}

/* ── CTA — BLACK ── */
.cta-final{background:radial-gradient(ellipse at 50% 60%,#1C3560 0%,#0E1E3A 55%,#070D1C 100%);text-align:center;position:relative;overflow:hidden;border-top:2px solid rgba(141,170,162,0.4)}
.cta-ambient{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:800px;height:400px;background:radial-gradient(ellipse,rgba(141,170,162,0.08) 0%,transparent 68%);pointer-events:none}
.cta-sub{font-family:'Helvetica Neue',sans-serif;font-size:8px;letter-spacing:6px;color:rgba(141,170,162,0.6);text-transform:uppercase;margin-bottom:22px;font-weight:300}
.cta-heading{font-family:'Cormorant Garamond',serif;font-size:58px;letter-spacing:2px;color:#F6F4EF;margin-bottom:16px;line-height:1.1;font-weight:300}
.cta-body{font-family:'Cormorant Garamond',serif;font-size:18px;font-style:italic;color:rgba(246,244,239,0.4);margin-bottom:44px;font-weight:300;line-height:1.9;max-width:400px;margin-left:auto;margin-right:auto}
.cta-form{display:flex;gap:0;max-width:500px;margin:0 auto 20px}
.cta-input{flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(141,170,162,0.25);border-right:none;color:#F6F4EF;font-family:'Cormorant Garamond',serif;font-size:16px;padding:16px 22px;letter-spacing:0.3px;outline:none;font-style:italic;transition:border-color 0.3s}
.cta-input:focus{border-color:rgba(141,170,162,0.55)}
.cta-input::placeholder{color:rgba(246,244,239,0.22)}
.cta-submit{background:#8DAAA2;color:#000000;font-family:'Helvetica Neue',sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;padding:16px 30px;border:none;cursor:pointer;white-space:nowrap;font-weight:400;transition:background 0.3s}
.cta-submit:hover{background:#7A9992}
.cta-fine{font-family:'Helvetica Neue',sans-serif;font-size:7px;color:rgba(246,244,239,0.22);letter-spacing:2.5px;text-transform:uppercase;font-weight:300}

/* ── FOOTER — BLACK ── */
footer{padding:40px 56px;background:#070D1C;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(141,170,162,0.2)}
.f-logo{font-family:'Cormorant Garamond',serif;font-size:14px;letter-spacing:5px;color:rgba(246,244,239,0.45);text-transform:uppercase;font-weight:300}
.f-links{display:flex;gap:30px}
.f-link{font-family:'Helvetica Neue',sans-serif;font-size:8px;letter-spacing:2.5px;color:rgba(246,244,239,0.28);text-transform:uppercase;cursor:pointer;font-weight:300;transition:color 0.3s}
.f-link:hover{color:#8DAAA2}
.f-copy{font-family:'Helvetica Neue',sans-serif;font-size:7px;color:rgba(246,244,239,0.22);letter-spacing:1px;font-weight:300}

/* ── BACK TO TOP ── */
.back-top{position:fixed;bottom:36px;right:36px;z-index:200;width:44px;height:44px;background:#000000;border:1px solid rgba(141,170,162,0.45);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;opacity:0;pointer-events:none;transition:opacity 0.4s,background 0.3s;gap:4px}
.back-top.visible{opacity:1;pointer-events:auto}
.back-top:hover{background:#111111;border-color:rgba(141,170,162,0.8)}
.back-top-arrow{width:10px;height:10px;border-top:1px solid #8DAAA2;border-right:1px solid #8DAAA2;transform:rotate(-45deg);margin-top:3px}
.back-top-label{font-family:'Helvetica Neue',sans-serif;font-size:6px;letter-spacing:2px;color:rgba(141,170,162,0.7);text-transform:uppercase;font-weight:300;line-height:1}

@media(max-width:768px){
  .problem-grid,.steps,.ex-grid,.p-grid,.testi-grid{grid-template-columns:1fr}
  .nav-links{display:none}
  .proof{gap:24px;flex-wrap:wrap;height:auto;padding:20px}
  nav,footer{padding-left:24px;padding-right:24px}
  .s-inner{padding:72px 24px}
  .monogram-name{font-size:24px}
  footer{flex-direction:column;gap:20px;text-align:center}
}`;

const scroll = (id) => `document.getElementById('${id}').scrollIntoView({behavior:'smooth'})`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>One Page Loft &#8212; Your Business Deserves To Be Seen</title>
<style>
${css}
</style>
</head>
<body>

<!-- NAV -->
<nav>
  <div class="nav-mark">
    <div class="nav-ll"><div class="nav-ll-inner">OPL</div></div>
    <div class="nav-brand">
      <div class="nav-brand-name">One Page Loft</div>
      <div class="nav-brand-sub">Your business deserves to be seen</div>
    </div>
  </div>
  <div class="nav-links">
    <span class="nav-link" onclick="${scroll('work')}">Work</span>
    <span class="nav-link" onclick="${scroll('how')}">How it works</span>
    <span class="nav-link" onclick="${scroll('pricing')}">Pricing</span>
  </div>
  <div class="nav-cta" onclick="${scroll('cta')}">Get your page</div>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-vignette"></div>
  <div class="hero-eyebrow">AI-Powered &nbsp;&middot;&nbsp; Refined Craft &nbsp;&middot;&nbsp; One Perfect Page</div>

  <div class="monogram-wrap">
    <div class="monogram-top-rule"></div>

    <div class="monogram-name">One Page Loft</div>

    <div class="monogram-rule">
      <div class="monogram-rule-line"></div>
      <div class="monogram-rule-diamond"></div>
      <div class="monogram-rule-line"></div>
    </div>

    <div class="monogram-sub">Est. 2025 &nbsp;&middot;&nbsp; One Perfect Page</div>
    <div class="monogram-bottom-rule"></div>
  </div>

  <p class="hero-tagline">Designed by AI &nbsp;&middot;&nbsp; Built for your business &nbsp;&middot;&nbsp; Live in days.</p>

  <div class="hero-btns">
    <button class="btn-primary" onclick="${scroll('cta')}">Claim your page</button>
    <button class="btn-outline" onclick="${scroll('work')}">See examples</button>
  </div>
  <div class="hero-scroll">Scroll to explore</div>
  <div class="hero-scroll-line"></div>
</section>

<!-- PROOF -->
<div class="proof">
  <div class="proof-stat"><div class="proof-num">340+</div><div class="proof-label">Pages Launched</div></div>
  <div class="proof-div"></div>
  <div class="proof-stat"><div class="proof-num">48hr</div><div class="proof-label">Average Delivery</div></div>
  <div class="proof-div"></div>
  <div class="proof-stat"><div class="proof-num">97%</div><div class="proof-label">Client Satisfaction</div></div>
  <div class="proof-div"></div>
  <div class="proof-stat"><div class="proof-num">$0</div><div class="proof-label">Website Required</div></div>
</div>

<!-- PROBLEM -->
<section class="problem" id="problem">
<div class="s-inner">
  <div class="problem-grid">
    <div>
      <div class="s-eyebrow">The reality</div>
      <h2 class="s-heading">Most businesses are invisible online.<br>Not because they aren&#8217;t great.</h2>
      <div class="s-rule"></div>
      <p class="problem-body">Because they have nowhere to send people.<br><br>A full website costs thousands. A social media profile isn&#8217;t enough. You need one place &#8212; one perfect, persuasive page &#8212; that tells your story, builds trust, and converts strangers into clients.<br><br>That&#8217;s exactly what One Page Loft builds.</p>
    </div>
    <div class="pain-cards">
      <div class="pain-card"><div class="pain-title">No online presence</div><div class="pain-body">Word of mouth only goes so far. When someone searches for you, there&#8217;s nothing to find.</div></div>
      <div class="pain-card"><div class="pain-title">Websites feel overwhelming</div><div class="pain-body">The cost, the time, the tech. Most businesses never start because the mountain feels too high.</div></div>
      <div class="pain-card"><div class="pain-title">First impressions are everything</div><div class="pain-body">You have 3 seconds to earn trust. Without a page, you don&#8217;t even get those 3 seconds.</div></div>
    </div>
  </div>
</div>
</section>

<!-- HOW -->
<section class="how" id="how">
<div class="s-inner how-inner">
  <div class="s-eyebrow" style="text-align:center">The process</div>
  <h2 class="s-heading" style="text-align:center">Three steps. One perfect page.</h2>
  <div class="s-rule center"></div>
  <div class="steps">
    <div class="step"><div class="step-num">01</div><div class="step-accent"></div><div class="step-title">Tell us your story</div><div class="step-body">A short intake form. Your business, your audience, your tone. No technical knowledge required &#8212; just your vision.</div></div>
    <div class="step"><div class="step-num">02</div><div class="step-accent"></div><div class="step-title">AI builds the draft</div><div class="step-body">Our AI engine crafts your copy, layout, and structure in hours &#8212; trained on what actually converts, not just what looks good.</div></div>
    <div class="step"><div class="step-num">03</div><div class="step-accent"></div><div class="step-title">We perfect it together</div><div class="step-body">One round of refinements. Then your page goes live &#8212; fast, elegant, and built to make an impression that lasts.</div></div>
  </div>
</div>
</section>

<!-- EXAMPLES -->
<section class="examples" id="work">
<div class="s-inner examples-inner">
  <div class="s-eyebrow" style="text-align:center">Our work</div>
  <h2 class="s-heading" style="text-align:center">Every industry. One standard.</h2>
  <div class="s-rule center"></div>
  <div class="ex-grid">

    <!-- Wellness & Coaching -->
    <div class="ex-card" onclick="openLb(0)">
      <div class="ex-screen"><svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="160" fill="#1A2820"/>
        <ellipse cx="265" cy="85" rx="75" ry="65" fill="rgba(90,160,100,0.07)"/>
        <rect width="300" height="26" fill="rgba(0,0,0,0.4)"/>
        <text x="14" y="17" font-family="'Cormorant Garamond',Georgia,serif" font-size="9" font-weight="400" fill="rgba(255,255,255,0.82)">The Vitality Method</text>
        <text x="178" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="1" fill="rgba(255,255,255,0.38)">ABOUT</text>
        <text x="210" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="1" fill="rgba(255,255,255,0.38)">PROGRAMS</text>
        <rect x="252" y="9" width="38" height="10" rx="1" fill="rgba(100,175,115,0.55)"/>
        <text x="271" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="0.5" fill="white" text-anchor="middle">BOOK NOW</text>
        <text x="18" y="38" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5.5" letter-spacing="2" fill="rgba(100,175,115,0.85)">WELLNESS · COACHING</text>
        <text x="18" y="56" font-family="'Cormorant Garamond',Georgia,serif" font-size="19" font-weight="300" font-style="italic" fill="rgba(255,255,255,0.92)">Transform Your</text>
        <text x="18" y="75" font-family="'Cormorant Garamond',Georgia,serif" font-size="19" font-weight="300" font-style="italic" fill="rgba(255,255,255,0.92)">Well-Being.</text>
        <text x="18" y="92" font-family="'Cormorant Garamond',Georgia,serif" font-size="7.5" fill="rgba(255,255,255,0.42)">Personalized programs designed for lasting change.</text>
        <text x="18" y="102" font-family="'Cormorant Garamond',Georgia,serif" font-size="7.5" fill="rgba(255,255,255,0.42)">Your journey starts with one decision.</text>
        <rect x="18" y="112" width="95" height="22" rx="2" fill="rgba(100,175,115,0.85)"/>
        <text x="65" y="126" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5.5" letter-spacing="1" fill="white" text-anchor="middle">BEGIN JOURNEY</text>
        <rect x="120" y="112" width="66" height="22" rx="2" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>
        <text x="153" y="126" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5.5" letter-spacing="1" fill="rgba(255,255,255,0.5)" text-anchor="middle">LEARN MORE</text>
      </svg></div>
      <div class="ex-meta"><div class="ex-meta-left"><div class="ex-industry">Wellness &amp; Coaching</div><div class="ex-name">The Vitality Method</div></div><div class="ex-view-hint">View &nbsp;&#8599;</div></div>
    </div>

    <!-- Legal & Professional -->
    <div class="ex-card" onclick="openLb(1)">
      <div class="ex-screen"><svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="160" fill="#131825"/>
        <rect x="238" y="0" width="62" height="160" fill="rgba(90,120,200,0.04)"/>
        <rect width="300" height="26" fill="rgba(0,0,0,0.42)"/>
        <rect x="14" y="9" width="8" height="8" fill="rgba(90,120,200,0.9)"/>
        <text x="26" y="17" font-family="'Cormorant Garamond',Georgia,serif" font-size="9" font-weight="400" letter-spacing="1" fill="rgba(255,255,255,0.78)">MARCHETTI</text>
        <text x="170" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="1" fill="rgba(255,255,255,0.35)">PRACTICE</text>
        <text x="208" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="1" fill="rgba(255,255,255,0.35)">ABOUT</text>
        <rect x="232" y="9" width="56" height="10" rx="1" fill="rgba(90,120,200,0.6)"/>
        <text x="260" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="0.5" fill="white" text-anchor="middle">SCHEDULE</text>
        <rect width="300" height="1" y="26" fill="rgba(90,120,200,0.22)"/>
        <text x="18" y="38" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5.5" letter-spacing="2" fill="rgba(90,120,200,0.75)">TRUSTED COUNSEL</text>
        <text x="18" y="56" font-family="'Cormorant Garamond',Georgia,serif" font-size="17" font-weight="300" fill="rgba(255,255,255,0.92)">Decisive Results.</text>
        <text x="18" y="74" font-family="'Cormorant Garamond',Georgia,serif" font-size="17" font-weight="300" fill="rgba(255,255,255,0.92)">Refined Advocacy.</text>
        <text x="18" y="88" font-family="'Cormorant Garamond',Georgia,serif" font-size="7.5" fill="rgba(255,255,255,0.38)">Strategic representation when it matters most.</text>
        <text x="18" y="98" font-family="'Cormorant Garamond',Georgia,serif" font-size="7.5" fill="rgba(255,255,255,0.38)">Protecting rights. Delivering outcomes.</text>
        <rect x="18" y="110" width="110" height="22" rx="1" fill="rgba(90,120,200,0.75)"/>
        <text x="73" y="124" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5.5" letter-spacing="0.8" fill="white" text-anchor="middle">FREE CONSULTATION</text>
        <rect x="136" y="110" width="68" height="22" rx="1" fill="none" stroke="rgba(90,120,200,0.38)" stroke-width="1"/>
        <text x="170" y="124" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5.5" letter-spacing="0.8" fill="rgba(255,255,255,0.45)" text-anchor="middle">OUR PRACTICE</text>
        <rect x="284" y="30" width="2" height="112" fill="rgba(90,120,200,0.12)"/>
      </svg></div>
      <div class="ex-meta"><div class="ex-meta-left"><div class="ex-industry">Legal &amp; Professional</div><div class="ex-name">Marchetti Law Group</div></div><div class="ex-view-hint">View &nbsp;&#8599;</div></div>
    </div>

    <!-- Food & Hospitality -->
    <div class="ex-card" onclick="openLb(2)">
      <div class="ex-screen"><svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="160" fill="#1E0E06"/>
        <ellipse cx="150" cy="175" rx="170" ry="90" fill="rgba(210,110,30,0.12)"/>
        <rect width="300" height="26" fill="rgba(0,0,0,0.55)"/>
        <text x="14" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="1" fill="rgba(255,255,255,0.35)">MENU</text>
        <text x="46" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="1" fill="rgba(255,255,255,0.35)">EVENTS</text>
        <text x="150" y="17" font-family="'Cormorant Garamond',Georgia,serif" font-size="10" font-style="italic" font-weight="300" fill="rgba(210,130,50,0.9)" text-anchor="middle">Ember &amp; Salt</text>
        <text x="236" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="1" fill="rgba(255,255,255,0.35)">CONTACT</text>
        <text x="265" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="1" fill="rgba(255,255,255,0.35)">RESERVE</text>
        <text x="150" y="42" font-family="'Helvetica Neue',Arial,sans-serif" font-size="6" letter-spacing="2.5" fill="rgba(210,130,50,0.75)" text-anchor="middle">CHEF-DRIVEN CUISINE</text>
        <text x="150" y="62" font-family="'Cormorant Garamond',Georgia,serif" font-size="20" font-weight="300" font-style="italic" fill="rgba(255,255,255,0.92)" text-anchor="middle">Where Flavor</text>
        <text x="150" y="82" font-family="'Cormorant Garamond',Georgia,serif" font-size="20" font-weight="300" font-style="italic" fill="rgba(255,255,255,0.92)" text-anchor="middle">Meets Craft.</text>
        <rect x="138" y="89" width="24" height="1" fill="rgba(210,130,50,0.55)"/>
        <text x="150" y="101" font-family="'Cormorant Garamond',Georgia,serif" font-size="7.5" fill="rgba(255,255,255,0.4)" text-anchor="middle">Seasonal menus · Private dining · Catered events</text>
        <rect x="95" y="112" width="110" height="24" rx="2" fill="rgba(210,120,40,0.85)"/>
        <text x="150" y="127" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5.5" letter-spacing="1" fill="white" text-anchor="middle">RESERVE YOUR TABLE</text>
      </svg></div>
      <div class="ex-meta"><div class="ex-meta-left"><div class="ex-industry">Food &amp; Hospitality</div><div class="ex-name">Ember &amp; Salt Kitchen</div></div><div class="ex-view-hint">View &nbsp;&#8599;</div></div>
    </div>

    <!-- Real Estate -->
    <div class="ex-card" onclick="openLb(3)">
      <div class="ex-screen"><svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="160" fill="#0E1812"/>
        <rect width="300" height="26" fill="rgba(0,0,0,0.42)"/>
        <rect x="14" y="10" width="5" height="6" fill="rgba(185,155,75,1)"/>
        <rect x="21" y="12" width="5" height="4" fill="rgba(185,155,75,0.5)"/>
        <text x="32" y="17" font-family="'Cormorant Garamond',Georgia,serif" font-size="9" font-weight="400" letter-spacing="2" fill="rgba(255,255,255,0.82)">HARLOW</text>
        <text x="166" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="1" fill="rgba(255,255,255,0.35)">BUY</text>
        <text x="186" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="1" fill="rgba(255,255,255,0.35)">SELL</text>
        <text x="206" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="1" fill="rgba(255,255,255,0.35)">RENTALS</text>
        <rect x="242" y="9" width="46" height="10" rx="1" fill="rgba(185,155,75,0.62)"/>
        <text x="265" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="0.5" fill="black" text-anchor="middle">BOOK TOUR</text>
        <text x="18" y="38" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5.5" letter-spacing="2" fill="rgba(185,155,75,0.75)">LUXURY REAL ESTATE</text>
        <text x="18" y="56" font-family="'Cormorant Garamond',Georgia,serif" font-size="17" font-weight="300" fill="rgba(255,255,255,0.92)">Find Your Perfect</text>
        <text x="18" y="74" font-family="'Cormorant Garamond',Georgia,serif" font-size="17" font-weight="300" fill="rgba(255,255,255,0.92)">Home.</text>
        <text x="18" y="88" font-family="'Cormorant Garamond',Georgia,serif" font-size="7.5" fill="rgba(255,255,255,0.38)">Curated properties for discerning buyers.</text>
        <rect x="18" y="98" width="88" height="20" rx="1" fill="rgba(185,155,75,0.78)"/>
        <text x="62" y="111" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5.5" letter-spacing="0.8" fill="black" text-anchor="middle">VIEW LISTINGS</text>
        <rect x="114" y="98" width="68" height="20" rx="1" fill="none" stroke="rgba(185,155,75,0.38)" stroke-width="1"/>
        <text x="148" y="111" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5.5" letter-spacing="0.8" fill="rgba(255,255,255,0.45)" text-anchor="middle">BOOK A TOUR</text>
        <rect x="210" y="30" width="80" height="96" rx="2" fill="rgba(255,255,255,0.04)" stroke="rgba(185,155,75,0.2)" stroke-width="1"/>
        <rect x="216" y="36" width="68" height="46" rx="1" fill="rgba(185,155,75,0.06)"/>
        <path d="M216,68 L250,48 L284,68" stroke="rgba(185,155,75,0.28)" stroke-width="1.2" fill="none"/>
        <rect x="228" y="68" width="16" height="14" fill="rgba(185,155,75,0.12)"/>
        <rect x="250" y="70" width="18" height="12" fill="rgba(185,155,75,0.08)"/>
        <text x="250" y="96" font-family="'Cormorant Garamond',Georgia,serif" font-size="7" fill="rgba(255,255,255,0.55)" text-anchor="middle">4 bd · 3 ba</text>
        <text x="250" y="106" font-family="'Cormorant Garamond',Georgia,serif" font-size="8" fill="rgba(185,155,75,0.7)" text-anchor="middle">$1.2M</text>
        <text x="250" y="118" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="0.5" fill="rgba(255,255,255,0.3)" text-anchor="middle">CHAPEL HILL, NC</text>
      </svg></div>
      <div class="ex-meta"><div class="ex-meta-left"><div class="ex-industry">Real Estate</div><div class="ex-name">Harlow Properties</div></div><div class="ex-view-hint">View &nbsp;&#8599;</div></div>
    </div>

    <!-- Creative & Design -->
    <div class="ex-card" onclick="openLb(4)">
      <div class="ex-screen"><svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="160" fill="#140E22"/>
        <circle cx="252" cy="52" r="55" fill="rgba(155,90,230,0.08)"/>
        <circle cx="252" cy="52" r="34" fill="rgba(155,90,230,0.07)"/>
        <rect width="300" height="26" fill="rgba(0,0,0,0.3)"/>
        <circle cx="18" cy="13" r="6" fill="rgba(155,90,230,0.88)"/>
        <text x="30" y="17" font-family="'Helvetica Neue',Arial,sans-serif" font-size="8" font-weight="300" letter-spacing="2" fill="rgba(255,255,255,0.82)">VERANO</text>
        <text x="172" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="1" fill="rgba(255,255,255,0.35)">WORK</text>
        <text x="198" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="1" fill="rgba(255,255,255,0.35)">STUDIO</text>
        <text x="228" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="1" fill="rgba(255,255,255,0.35)">CONTACT</text>
        <text x="266" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="1" fill="rgba(155,90,230,0.85)">HIRE US</text>
        <text x="18" y="38" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5.5" letter-spacing="2" fill="rgba(155,90,230,0.82)">CREATIVE STUDIO</text>
        <text x="18" y="58" font-family="'Cormorant Garamond',Georgia,serif" font-size="22" font-weight="400" fill="rgba(255,255,255,0.94)">Design That</text>
        <text x="18" y="78" font-family="'Cormorant Garamond',Georgia,serif" font-size="22" font-weight="400" font-style="italic" fill="rgba(155,90,230,0.75)">Speaks.</text>
        <text x="18" y="93" font-family="'Cormorant Garamond',Georgia,serif" font-size="7.5" fill="rgba(255,255,255,0.38)">Brand identity · Web design · Creative direction</text>
        <rect x="18" y="104" width="88" height="24" rx="12" fill="rgba(155,90,230,0.8)"/>
        <text x="62" y="119" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5.5" letter-spacing="0.8" fill="white" text-anchor="middle">VIEW PORTFOLIO</text>
        <rect x="114" y="104" width="82" height="24" rx="12" fill="none" stroke="rgba(155,90,230,0.42)" stroke-width="1"/>
        <text x="155" y="119" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5.5" letter-spacing="0.8" fill="rgba(155,90,230,0.65)" text-anchor="middle">START A PROJECT</text>
        <rect x="252" y="88" width="11" height="11" rx="2" fill="rgba(155,90,230,0.22)"/>
        <rect x="268" y="88" width="11" height="11" rx="2" fill="rgba(155,90,230,0.14)"/>
        <rect x="252" y="104" width="11" height="11" rx="2" fill="rgba(155,90,230,0.14)"/>
        <rect x="268" y="104" width="11" height="11" rx="2" fill="rgba(155,90,230,0.25)"/>
      </svg></div>
      <div class="ex-meta"><div class="ex-meta-left"><div class="ex-industry">Creative &amp; Design</div><div class="ex-name">Studio Verano</div></div><div class="ex-view-hint">View &nbsp;&#8599;</div></div>
    </div>

    <!-- Finance & Consulting -->
    <div class="ex-card" onclick="openLb(5)">
      <div class="ex-screen"><svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="160" fill="#12100A"/>
        <ellipse cx="150" cy="-15" rx="210" ry="80" fill="rgba(195,165,75,0.06)"/>
        <rect width="300" height="26" fill="rgba(0,0,0,0.48)"/>
        <rect x="14" y="9" width="10" height="8" rx="1" fill="rgba(195,165,75,0.85)"/>
        <text x="28" y="17" font-family="'Cormorant Garamond',Georgia,serif" font-size="9" font-weight="400" letter-spacing="3" fill="rgba(255,255,255,0.82)">AURUM</text>
        <text x="172" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="1" fill="rgba(255,255,255,0.32)">SERVICES</text>
        <text x="210" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="1" fill="rgba(255,255,255,0.32)">TEAM</text>
        <rect x="234" y="9" width="56" height="10" rx="1" fill="rgba(195,165,75,0.6)"/>
        <text x="262" y="16" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" letter-spacing="0.5" fill="black" text-anchor="middle">BOOK A CALL</text>
        <rect width="300" height="1" y="26" fill="rgba(195,165,75,0.35)"/>
        <text x="18" y="38" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5.5" letter-spacing="2" fill="rgba(195,165,75,0.7)">WEALTH MANAGEMENT</text>
        <text x="18" y="57" font-family="'Cormorant Garamond',Georgia,serif" font-size="18" font-weight="300" fill="rgba(255,255,255,0.92)">Wealth. Wisdom.</text>
        <text x="18" y="76" font-family="'Cormorant Garamond',Georgia,serif" font-size="18" font-weight="300" fill="rgba(195,165,75,0.65)">Legacy.</text>
        <rect x="18" y="84" width="28" height="1" fill="rgba(195,165,75,0.42)"/>
        <text x="18" y="96" font-family="'Cormorant Garamond',Georgia,serif" font-size="7.5" fill="rgba(255,255,255,0.38)">Strategic guidance for lasting financial prosperity.</text>
        <text x="18" y="106" font-family="'Cormorant Garamond',Georgia,serif" font-size="7.5" fill="rgba(255,255,255,0.38)">Built on trust. Driven by results.</text>
        <rect x="18" y="118" width="105" height="22" rx="1" fill="rgba(195,165,75,0.8)"/>
        <text x="70" y="132" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5.5" letter-spacing="0.8" fill="black" text-anchor="middle">DISCOVERY CALL</text>
        <rect x="131" y="118" width="72" height="22" rx="1" fill="none" stroke="rgba(195,165,75,0.32)" stroke-width="1"/>
        <text x="167" y="132" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5.5" letter-spacing="0.8" fill="rgba(195,165,75,0.55)" text-anchor="middle">OUR APPROACH</text>
      </svg></div>
      <div class="ex-meta"><div class="ex-meta-left"><div class="ex-industry">Finance &amp; Consulting</div><div class="ex-name">Aurum Advisory</div></div><div class="ex-view-hint">View &nbsp;&#8599;</div></div>
    </div>

  </div>
</div>
</section>

<!-- PRICING -->
<section class="pricing" id="pricing">
<div class="s-inner pricing-inner">
  <div class="s-eyebrow" style="text-align:center">Transparent pricing</div>
  <h2 class="s-heading" style="text-align:center">Refined craft. Accessible cost.</h2>
  <div class="s-rule center"></div>
  <div class="p-grid">
    <div class="p-card"><div class="p-tier">Essential</div><div class="p-price"><sup>$</sup>297<span> once</span></div><div class="p-desc">Your business, seen. One page, live fast.</div><div class="p-rule"></div><div class="p-feat">AI-crafted copy &amp; layout</div><div class="p-feat">Mobile-optimized design</div><div class="p-feat">Contact form or CTA button</div><div class="p-feat">Delivered in 48 hours</div><div class="p-feat">1 revision round</div><button class="p-btn">Get started</button></div>
    <div class="p-card feat"><div class="p-tier">Signature</div><div class="p-price"><sup>$</sup>597<span> once</span></div><div class="p-desc">The full One Page Loft experience. Built to convert.</div><div class="p-rule"></div><div class="p-feat">Everything in Essential</div><div class="p-feat">Brand photography direction</div><div class="p-feat">SEO-optimized metadata</div><div class="p-feat">Analytics integration</div><div class="p-feat">3 revision rounds</div><div class="p-feat">Domain setup assistance</div><button class="p-btn signature">Most popular</button></div>
    <div class="p-card"><div class="p-tier">Prestige</div><div class="p-price"><sup>$</sup>997<span> once</span></div><div class="p-desc">White-glove. Premium. Unforgettable.</div><div class="p-rule"></div><div class="p-feat">Everything in Signature</div><div class="p-feat">Bespoke AI illustration</div><div class="p-feat">Video or animation integration</div><div class="p-feat">Priority 24-hour delivery</div><div class="p-feat">Unlimited revisions &#8212; 30 days</div><div class="p-feat">Quarterly refresh included</div><button class="p-btn">Go prestige</button></div>
  </div>
</div>
</section>

<!-- TESTI -->
<section class="testi">
<div class="s-inner">
  <div style="text-align:center"><div class="s-eyebrow">What they said</div><h2 class="s-heading">Words from the seen.</h2><div class="s-rule center"></div></div>
  <div class="testi-grid">
    <div class="t-card"><div class="t-quote">&#8220;I had been putting off getting online for three years. One Page Loft had my page live in two days. My phone hasn&#8217;t stopped since.&#8221;</div><div class="t-rule"></div><div class="t-name">Maria T.</div><div class="t-biz">Private Chef &middot; Miami, FL</div></div>
    <div class="t-card"><div class="t-quote">&#8220;I thought I needed a whole website. I didn&#8217;t. This one page has done more for my practice than anything I&#8217;ve tried.&#8221;</div><div class="t-rule"></div><div class="t-name">James R.</div><div class="t-biz">Financial Advisor &middot; Austin, TX</div></div>
    <div class="t-card"><div class="t-quote">&#8220;The quality looked like it cost $10,000. It cost $597. I genuinely couldn&#8217;t believe it when I saw the final page.&#8221;</div><div class="t-rule"></div><div class="t-name">Priya K.</div><div class="t-biz">Yoga Studio Owner &middot; Brooklyn, NY</div></div>
    <div class="t-card"><div class="t-quote">&#8220;Sent the link to a potential client before our meeting. They came in already sold. That page did the selling for me.&#8221;</div><div class="t-rule"></div><div class="t-name">David M.</div><div class="t-biz">Business Consultant &middot; Chicago, IL</div></div>
  </div>
</div>
</section>

<!-- CTA -->
<section class="cta-final" id="cta">
<div class="s-inner" style="text-align:center">
  <div class="cta-ambient"></div>
  <div class="cta-sub">Ready to be seen?</div>
  <h2 class="cta-heading">Your page is waiting.</h2>
  <p class="cta-body">Enter your email and we&#8217;ll send you everything you need to get started. No commitment. No credit card.</p>
  <div class="cta-form"><input class="cta-input" type="email" placeholder="your@email.com"/><button class="cta-submit">Claim my page</button></div>
  <div class="cta-fine">No website needed &nbsp;&middot;&nbsp; Delivered in 48 hours &nbsp;&middot;&nbsp; Satisfaction guaranteed</div>
</div>
</section>

<!-- LIGHTBOX -->
<div class="ex-lb" id="exLb">
  <div class="ex-lb-wrap" id="exLbWrap">
    <div class="ex-lb-close" onclick="closeLb()"><span>Close</span><span class="ex-lb-close-x">&#215;</span></div>
    <div id="exLbSvg"></div>
    <div class="ex-lb-footer">
      <div><div class="ex-lb-industry" id="exLbIndustry"></div><div class="ex-lb-name" id="exLbName"></div></div>
      <div class="ex-lb-tag">One Page Loft</div>
    </div>
  </div>
</div>

<!-- BACK TO TOP -->
<div class="back-top" id="backTop" onclick="window.scrollTo({top:0,behavior:'smooth'})">
  <div class="back-top-arrow"></div>
  <div class="back-top-label">Top</div>
</div>

<!-- FOOTER -->
<footer>
  <div class="f-logo">One Page Loft</div>
  <div class="f-links"><span class="f-link">Privacy</span><span class="f-link">Terms</span><span class="f-link">Contact</span></div>
  <div class="f-copy">&copy; 2025 One Page Loft &nbsp;&middot;&nbsp; All rights reserved</div>
</footer>

<script>
const bt = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  bt.classList.toggle('visible', window.scrollY > window.innerHeight * 0.6);
});

const lbMeta = [
  { industry: 'Wellness &amp; Coaching', name: 'The Vitality Method' },
  { industry: 'Legal &amp; Professional', name: 'Marchetti Law Group' },
  { industry: 'Food &amp; Hospitality', name: 'Ember &amp; Salt Kitchen' },
  { industry: 'Real Estate', name: 'Harlow Properties' },
  { industry: 'Creative &amp; Design', name: 'Studio Verano' },
  { industry: 'Finance &amp; Consulting', name: 'Aurum Advisory' }
];

function openLb(idx) {
  const svgs = document.querySelectorAll('.ex-screen svg');
  const svgClone = svgs[idx].cloneNode(true);
  svgClone.classList.add('ex-lb-svg');
  svgClone.removeAttribute('height');
  svgClone.style.height = 'auto';
  const container = document.getElementById('exLbSvg');
  container.innerHTML = '';
  container.appendChild(svgClone);
  document.getElementById('exLbIndustry').innerHTML = lbMeta[idx].industry;
  document.getElementById('exLbName').textContent = lbMeta[idx].name;
  document.getElementById('exLb').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLb() {
  document.getElementById('exLb').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('exLb').addEventListener('click', function(e) {
  if (e.target === this) closeLb();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeLb();
});
</script>
</body>
</html>`;

fs.writeFileSync('C:/Users/chris/Downloads/landings_at_the_loft.html', html);
console.log('Done. Size:', html.length, 'bytes');
