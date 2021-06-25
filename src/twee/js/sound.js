/*
Simple sound controller using howler.js
*/
class SoundInstance {
  constructor(howlObject) {
    this.howl = howlObject;
    howlObject.mute(true);
    this.id = howlObject.play();
    howlObject.pause(this.id);
    howlObject.mute(false);
  }
  fadeIn(duration = 1000) {
    if (!this.howl.playing(this.id)) {
      this.howl.play(this.id);
      this.howl.loop(true, this.id);
      this.howl.fade(0.0, this.howl.volume(), duration, this.id);
    }
  }
  fadeOut(duration = 1000) {
    if (this.howl.playing(this.id)) {
      this.howl.fade(this.howl.volume(), 0.0, duration, this.id);
      this.howl.once("fade", () => this.howl.stop(this.id), this.id);
    }
  }
}

// Ambient bird noises for morning endings
const audioRootPath = "assets/sound/";

const passageAudio = (howlObject, tags) => {
  const soundInstance = new SoundInstance(howlObject);
  $(window).on("sm.passage.shown", (ev, { passage }) => {
    if (tags.every(t => passage.tags.includes(t))) {
      soundInstance.fadeIn();
    } else {
      soundInstance.fadeOut();
    }
  })
  return soundInstance.id;
}

const birds = new Howl({
  src: ["assets/sound/birds.mp3"],
  loop: true,
  volume: 0.6,
});
const gurgle = new Howl({
  src: ["assets/sound/gurgle.mp3"],
  loop: true,
  volume: 1.0
});
const crickets = new Howl({
  src: ["assets/sound/crickets.mp3"],
  loop: true,
  volume: 0.1,
});
const epilogueMusic = new Howl({
  src: ["assets/sound/kevp888 - CD_YIN_001.mp3"],
  html5: true,
  volume: 1.0
});
passageAudio(birds, ["morning"]);
passageAudio(gurgle, ["vore"]);
passageAudio(crickets, ["epilogue"]);

passageAudio(epilogueMusic, ["epilogue", "stars"]);