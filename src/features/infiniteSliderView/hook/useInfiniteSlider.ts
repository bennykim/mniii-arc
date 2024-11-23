import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCallback, useRef } from 'react';

import { buildSeamlessLoop } from '@/features/infiniteSliderView/lib/buildSeamlessLoop';
import { SPACING } from '@/features/infiniteSliderView/lib/constants';

gsap.registerPlugin(ScrollTrigger);

type ExtendedScrollTrigger = ScrollTrigger & {
  wrapping?: boolean;
};

export const useInfiniteSlider = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLUListElement>(null);
  const scrubRef = useRef<gsap.core.Tween | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const seamlessLoopRef = useRef<gsap.core.Timeline | null>(null);
  const iterationRef = useRef(0);

  const scrubTo = useCallback((totalTime: number) => {
    if (!triggerRef.current || !seamlessLoopRef.current) return;

    const progress =
      (totalTime - seamlessLoopRef.current.duration() * iterationRef.current) /
      seamlessLoopRef.current.duration();

    if (progress > 1) {
      wrapForward(triggerRef.current);
    } else if (progress < 0) {
      wrapBackward(triggerRef.current);
    } else {
      triggerRef.current.scroll(
        triggerRef.current.start +
          progress * (triggerRef.current.end - triggerRef.current.start),
      );
    }
  }, []);

  const handleNext = useCallback(() => {
    if (!scrubRef.current?.vars) return;
    scrubTo(scrubRef.current.vars.totalTime + SPACING);
  }, [scrubTo]);

  const handlePrev = useCallback(() => {
    if (!scrubRef.current?.vars) return;
    scrubTo(scrubRef.current.vars.totalTime - SPACING);
  }, [scrubTo]);

  function wrapForward(trigger: ExtendedScrollTrigger) {
    iterationRef.current++;
    trigger.wrapping = true;
    trigger.scroll(trigger.start + 1);
  }

  function wrapBackward(trigger: ExtendedScrollTrigger) {
    iterationRef.current--;
    if (iterationRef.current < 0) {
      iterationRef.current = 9;
      if (seamlessLoopRef.current) {
        seamlessLoopRef.current.totalTime(
          seamlessLoopRef.current.totalTime() +
            seamlessLoopRef.current.duration() * 10,
        );
      }
      if (scrubRef.current) {
        scrubRef.current.pause();
      }
    }
    trigger.wrapping = true;
    trigger.scroll(trigger.end - 1);
  }

  useGSAP(() => {
    if (!galleryRef.current || !cardsRef.current) return;

    const container = galleryRef.current.parentElement!;
    const cards = gsap.utils.toArray<HTMLElement>('.cards li');
    const snap = gsap.utils.snap(SPACING);
    const seamlessLoop = buildSeamlessLoop(cards, SPACING);
    seamlessLoopRef.current = seamlessLoop;

    const scrub = gsap.to(seamlessLoop, {
      totalTime: 0,
      duration: 0.5,
      ease: 'power3',
      paused: true,
    });
    scrubRef.current = scrub;

    const trigger = ScrollTrigger.create({
      scroller: container,
      trigger: galleryRef.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate(self: ExtendedScrollTrigger) {
        if (self.progress === 1 && self.direction > 0 && !self.wrapping) {
          wrapForward(self);
        } else if (
          self.progress < 1e-5 &&
          self.direction < 0 &&
          !self.wrapping
        ) {
          wrapBackward(self);
        } else {
          scrub.vars.totalTime = snap(
            (iterationRef.current + self.progress) * seamlessLoop.duration(),
          );
          scrub.invalidate().restart();
          self.wrapping = false;
        }
      },
    });
    triggerRef.current = trigger;

    return () => {
      trigger.kill();
      seamlessLoop.kill();
      scrub.kill();
    };
  }, []);

  return {
    galleryRef,
    cardsRef,
    handleNext,
    handlePrev,
  };
};
