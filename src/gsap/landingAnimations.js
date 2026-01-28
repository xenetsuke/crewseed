/* line 1 */ import gsap from "gsap";
/* line 2 */ import { ScrollTrigger } from "gsap/ScrollTrigger";

/* line 4 */ gsap.registerPlugin(ScrollTrigger);

/* line 6 */ export function initLandingAnimations(root) {
/* line 7 */   if (!root) return;
/* line 8 */   const q = gsap.utils.selector(root);

  /* ================= HERO ================= */

  /* line 12 */ gsap.from(q('[data-gsap="hero-title"]'), {
/* line 13 */   y: 120,
/* line 14 */   opacity: 0,
/* line 15 */   duration: 1.2,
/* line 16 */   ease: "power4.out",
/* line 17 */ });

/* line 19 */ gsap.from(q('[data-gsap="hero-sub"]'), {
/* line 20 */   y: 60,
/* line 21 */   opacity: 0,
/* line 22 */   duration: 1,
/* line 23 */   delay: 0.3,
/* line 24 */   ease: "power3.out",
/* line 25 */ });

  /* ================= FLOATING CARDS ================= */

/* line 29 */ gsap.from(q('[data-gsap="card"]'), {
/* line 30 */   scrollTrigger: {
/* line 31 */     trigger: q('[data-gsap="card"]'),
/* line 32 */     start: "top 85%",
/* line 33 */   },
/* line 34 */   y: 80,
/* line 35 */   opacity: 0,
/* line 36 */   stagger: 0.15,
/* line 37 */   duration: 1,
/* line 38 */   ease: "power3.out",
/* line 39 */ });

  /* ================= SECTIONS ================= */

/* line 43 */ q('[data-gsap="section"]').forEach((section) => {
/* line 44 */   gsap.from(section, {
/* line 45 */     scrollTrigger: {
/* line 46 */       trigger: section,
/* line 47 */       start: "top 80%",
/* line 48 */     },
/* line 49 */     y: 120,
/* line 50 */     opacity: 0,
/* line 51 */     duration: 1.1,
/* line 52 */     ease: "power4.out",
/* line 53 */   });
/* line 54 */ });

  /* ================= TIMELINE CARDS ================= */

/* line 58 */ gsap.from(q('[data-gsap="step"]'), {
/* line 59 */   scrollTrigger: {
/* line 60 */     trigger: q('[data-gsap="timeline"]'),
/* line 61 */     start: "top 75%",
/* line 62 */   },
/* line 63 */   y: 60,
/* line 64 */   opacity: 0,
/* line 65 */   stagger: 0.12,
/* line 66 */   ease: "power3.out",
/* line 67 */ });

/* line 69 */ ScrollTrigger.refresh();
/* line 70 */ }
