// Mute on load.
if (!setup.isFlagSet("enableSound")) {
  Howler.volume(0.0);
}

/*
Simple sound controller using howler.js
*/
class SoundInstance {
  /**
   *
   * @param {Howl} howlObject
   */
  constructor(howlObject) {
    this.howl = howlObject;
    this.playing = false;
  }
  fadeIn(duration = 1000) {
    // If sound isn't playing yet, then fade in.
    if (this.playing) {
      return;
    }
    if (this.id == undefined) {
      this.id = this.howl.play();
    } else {
      this.howl.play(this.id);
    }
    this.howl.fade(0.0, this.howl.volume(), duration, this.id);
    this.playing = true;
    this.howl.off("fade", this.id);
  }
  fadeOut(duration = 1000) {
    if (this.howl.playing(this.id)) {
      this.howl.fade(this.howl.volume(), 0.0, duration, this.id);
      this.playing = false;
      this.howl.once("fade", () => {
        this.playing = false;
        this.howl.stop(this.id);
      }, this.id);
    }
  }
}

// Ambient bird noises for morning endings
const audioRootPath = "assets/sound/";

/**
 *
 * @param {Howl} howlObject
 * @param  {...((passage: Passage) => boolean)} predicates
 * @returns {number}
 */
const passageAudio = (howlObject, ...predicates) => {
  const soundInstance = new SoundInstance(howlObject);
  $(window).on("sm.passage.shown", (ev, { passage }) => {
    if (predicates.some(f => f(passage))) {
      soundInstance.fadeIn();
    } else {
      soundInstance.fadeOut();
    }
  })
  return soundInstance.id;
}

/**
 *
 * @param  {...any} tags
 * @returns {(passage: Passage) => boolean}
 */
const hasTags = (...tags) => (passage) => tags.every(t => passage.tags.includes(t));

const birds = new Howl({
  src: ["assets/sound/birds.mp3"],
  loop: true,
  volume: 0.6,
  muted: true,
  html5: true,
});
const gurgle = new Howl({
  src: ["assets/sound/gurgle.mp3"],
  loop: true,
  volume: 1.0,
  muted: true,
  html5: true,
});
const crickets = new Howl({
  src: ["assets/sound/crickets.mp3"],
  loop: true,
  volume: 0.1,
  muted: true,
  html5: true,
});
const zenMusic = new Howl({
  src: ["assets/sound/kevp888 - CD_YIN_001.mp3"],
  html5: true,
  volume: 1.0,
  muted: true,
  html5: true,
});
passageAudio(birds, hasTags("morning"));
passageAudio(gurgle, hasTags("vore"));
passageAudio(crickets, hasTags("outside"));
passageAudio(zenMusic, hasTags("zen"));