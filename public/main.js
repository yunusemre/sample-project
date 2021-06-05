// @ts-check

import { APIWrapper, API_EVENT_TYPE } from "./api.js";
import { addMessage, animateGift, isPossiblyAnimatingGift, isAnimatingGiftUI } from "./dom_updates.js";

const api = new APIWrapper(null, false, true);

const eventTime = 500;
let messages = [];
let animatedGifts = [];

api.setEventHandler((events) => {
  events.forEach(evt => {
    evt.type == API_EVENT_TYPE.ANIMATED_GIFT ?
      (animatedGifts = [...animatedGifts, evt]) : (messages = [...messages, evt]);
  });
})

const Queues = setInterval(() => {
  const isAnimating = isAnimatingGiftUI();
  const giftLen = animatedGifts.length;
  const messagesLen = messages.length;

  if (messagesLen > 0) {
    const event = messages[Math.floor(Math.random() * messagesLen)];
    const time = olderThan20Seconds(event);
    !time && addMessage(event)
  }

  if (giftLen > 0 && !isAnimating) {
    const event = animatedGifts[Math.floor(Math.random() * giftLen)];
    animateGift(event);
    addMessage(event);
  }
}, eventTime);

const olderThan20Seconds = (event) => {
  const diff = (Date.now() - new Date(event.timestamp).getTime()) / 1000;
  return diff > 20;
}

// NOTE: UI helper methods from `dom_updates` are already imported above.
