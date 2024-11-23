import { gsap } from 'gsap';

export const buildSeamlessLoop = (items: HTMLElement[], spacing: number) => {
  const overlap = Math.ceil(1 / spacing);
  const startTime = items.length * spacing + 0.5;
  const loopTime = (items.length + overlap) * spacing + 1;
  const rawSequence = gsap.timeline({ paused: true });
  const seamlessLoop = gsap.timeline({
    paused: true,
    repeat: -1,
    onRepeat() {
      if (this._time === this._dur) {
        this._tTime += this._dur - 0.01;
      }
    },
  });

  const l = items.length + overlap * 2;

  // Initial state
  gsap.set(items, { xPercent: 400, opacity: 0, scale: 0 });

  // Create animations
  for (let i = 0; i < l; i++) {
    const index = i % items.length;
    const item = items[index];
    const time = i * spacing;

    rawSequence
      .fromTo(
        item,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          zIndex: 100,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: 'power1.in',
          immediateRender: false,
        },
        time,
      )
      .fromTo(
        item,
        { xPercent: 400 },
        { xPercent: -400, duration: 1, ease: 'none', immediateRender: false },
        time,
      );

    if (i <= items.length) {
      seamlessLoop.add(`label${i}`, time);
    }
  }

  rawSequence.time(startTime);
  seamlessLoop
    .to(rawSequence, {
      time: loopTime,
      duration: loopTime - startTime,
      ease: 'none',
    })
    .fromTo(
      rawSequence,
      { time: overlap * spacing + 1 },
      {
        time: startTime,
        duration: startTime - (overlap * spacing + 1),
        immediateRender: false,
        ease: 'none',
      },
    );

  return seamlessLoop;
};
