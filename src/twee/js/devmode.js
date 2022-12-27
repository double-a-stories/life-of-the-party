$(window).on("sm.story.started", function (event, { story }) {
  const headingStyle =
    "font: bold 2rem/1 serif; font-variant-caps: small-caps;";
  const normalStyle = "font: 1rem/1 bold sans-serif;";

  console.log(
    `%cLife of the Party %c${story.version}`,
    "font: bold 2rem/1.6 serif; font-variant-caps: small-caps;",
    "font: lighter 1rem/1.6 sans-serif; text-transform: uppercase"
  );
  console.info(`> Open developer console

You decide to stick your nose where it doesn't belong, and enter the developer's room. It's a vast, abstract expanse full of confusing syntax, spaghetti code, and runtime errors. Oh dear, how did you even get in here?
    \n`);
});

if (StoryFlags.isSet("devmode") && !$(".dev-info")[0]) {
  // Create devInfo element
  const $devInfo = $(`<details class="dev-info" open></details>`);
  $devInfo.appendTo($("body"));
  // Title
  $devInfo.append($("<summary>Developer Tools</summary>"));
  // Console for showing useful data.
  const $devInfoList = $(`<dl></dl>`);
  $devInfoList.appendTo($devInfo);
  $devInfoList.append(
    `<dt>passage.name</dt><dd data-exec="passage.name"></dd>`
  );
  $devInfoList.append(
    `<dt>passage.tags</dt><dd data-exec="passage.tags"></dd>`
  );
  $devInfoList.append(
    `<dt>story.state (<a href="javascript:void(0)"  onclick="story.state = {};">reset</a>)</dt><dd data-exec="story.state"></dd>`
  );
  $devInfoList.append(
    `<dt>story.history.length</dt><dd data-exec="story.history.length"></dd>`
  );
  $devInfoList.append(
    `<dt>StoryFlags.getAll() (<a href="javascript:void(0)"  onclick="Achievements.reset(); StoryFlags.reset(); StoryFlags.set('devmode')">reset</a>)</dt><dd data-exec="StoryFlags.getAll()"></dd>`
  );
  // Commands
  $devInfo.append(`<ul class="header-nav-group">
    <li><a href="javascript:void(0)" onclick="story.show('Warp zone')">Warp zone</a></li>
    <li><a href="javascript:void(0)"  onclick="story.save();">Save game</a></li>
    <li><a href="javascript:void(0)"  onclick="window.location.reload();">Load game</a></li>
    <li><a href="javascript:void(0)"  onclick="window.location.hash = '';">Clear save data</a></li>
    </ul>`);

  $(window).on("sm.passage.shown", (ev, { passage }) => {
    $devInfoList.find("[data-exec]").each((i, el) => {
      $(el).text(JSON.stringify(eval($(el).attr("data-exec")), null, 2));
    });
  });
}
