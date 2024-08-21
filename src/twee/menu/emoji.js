// Load Twemoji script
// NOTE: Any emoji character inside a passage will be replaced with <img src="...">. If there are emojis inside of double-quotes, it WILL BREAK the surrounding code.

// BAD: <%s.rm?"⚠️":"⚠️"%>
// OK: <%s.rm?`⚠️:`⚠️`%>

{
  twemoji.base = "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/";

  $(window).on("sm.passage.shown", function parsePassageEmojis() {
    twemoji.parse(story.$passageEl[0]);
  });

  function defaultImageSrcGenerator(emoji) {
    // remove variation selectors to avoid a quirk.
    return "".concat(
      twemoji.base,
      twemoji.size,
      "/",
      twemoji.convert.toCodePoint(emoji),
      twemoji.ext
    );
  }

  // Given a passage of text, pulls out the emoji symbols in that text.
  const scrapeEmojiFromString = (text) => {
    let foundEmojis = new Set();
    twemoji.replace(text, (emoji) => {
      // generate URL
      emoji =
        emoji.indexOf("\u200D") < 0 ? emoji.replace(/\uFE0F/gu, "") : emoji;
      if (emoji) foundEmojis.add(emoji);
    });
    return foundEmojis;
  };

  const preloadedEmoji = (window.preloadedEmoji = new Set());

  const preloadEmojiFromPassage = (nameOrId) => {
    let p = story.passage(nameOrId);
    if (p == null) throw new Error("No passage named " + p);
    if (p.scrapedEmoji == true) return;
    const foundEmojis = scrapeEmojiFromString(p.source);
    for (const emoji of foundEmojis) {
      if (!(emoji in preloadedEmoji)) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = defaultImageSrcGenerator(emoji);
        link.dataset.emoji = emoji;
        $("head").append(link);
        preloadedEmoji.add(emoji);
      }
    }
    p.scrapedEmoji = true;
    return foundEmojis;
  };

  $(window).on("sm.passage.shown", function preloadEmojisFromLinks() {
    $("a[data-passage]").each(function () {
      preloadEmojiFromPassage(this.dataset.passage);
    });
  });
}
