/* line 1 */ import gsap from "gsap";
/* line 2 */ import { ScrollTrigger } from "gsap/ScrollTrigger";

/* line 4 */ gsap.registerPlugin(ScrollTrigger);

/* line 6 */ export function initCounters(root) {
/* line 7 */   if (!root) return;

/* line 9 */   const counters = root.querySelectorAll(".counter");

/* line 11 */  counters.forEach((el) => {
/* line 12 */    const target = Number(el.dataset.target || 0);

/* line 14 */    gsap.fromTo(
/* line 15 */      el,
/* line 16 */      { innerText: 0 },
/* line 17 */      {
/* line 18 */        innerText: target,
/* line 19 */        duration: 2,
/* line 20 */        ease: "power3.out",
/* line 21 */        snap: { innerText: 1 },
/* line 22 */        scrollTrigger: {
/* line 23 */          trigger: el,
/* line 24 */          start: "top 80%",
/* line 25 */          once: true,
/* line 26 */        },
/* line 27 */        onUpdate() {
/* line 28 */          el.innerText = Math.floor(el.innerText).toLocaleString("en-IN");
/* line 29 */        },
/* line 30 */      }
/* line 31 */    );
/* line 32 */  });
/* line 33 */ }
