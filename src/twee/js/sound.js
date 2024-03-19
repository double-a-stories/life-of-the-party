let howlerInitialized = false;
$(document).on("sm.story.started sm.passage.showing", () => {
  if (!howlerInitialized && window.Howl) {
    howlerInit();
    howlerInitialized = true;
    console.info("Howler.js was loaded.")
  }
});

const howlerInit = () => {

  // Mute and unmute on load.
  $(document).on("sm.passage.shown", () => {
    if (!StoryFlags.isSet("enableSound")) {
      Howler.mute(true);
    } else {
      Howler.mute(false);
    }
  });

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
        this.howl.load();
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
          this.howl.pause(this.id);
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

  const howlDefaults = {
    loop: true,
    volume: 0.1,
    autoplay: false,
    preload: false
  }
  // Chirping birds from freesound
  // Used in the "morning after" passages
  const birds = new Howl({
    ...howlDefaults,
    src: ["assets/sound/birds.mp3"],
    volume: 0.05,
  });
  passageAudio(birds, hasTags("morning"));
  // Stomach sounds from freesound
  const gurgle = new Howl({
    ...howlDefaults,
    src: ["assets/sound/gurgle.mp3"],
    volume: 1.0,
  });
  passageAudio(gurgle, hasTags("vore"));
  // Crickets and suburban outdoor noises from freesound
  const crickets = new Howl({
    ...howlDefaults,
    src: ["assets/sound/crickets.mp3"],
    volume: 0.1,
  });
  passageAudio(crickets, hasTags("outside"));
  // Ambient noise by CD_YIN_001.mp3 by kevp888
  // Used in the zen scene
  const zenMusic = new Howl({
    ...howlDefaults,
    src: ["assets/sound/kevp888 - CD_YIN_001.mp3"],
    volume: 1.0,
  });
  passageAudio(zenMusic, hasTags("zen"));
}

setup.playAchievementSound = () => {
  const pikoop = new Howl({
    src: ["assets/sound/xbox-360-achievement-sound.mp3"],
    autoplay: true,
    volume: 0.6,
  })

  pikoop.play();
}