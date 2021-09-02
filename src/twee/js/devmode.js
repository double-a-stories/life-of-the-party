window.enableDevMode = () => {
    setup.setFlag("devmode");
    story.save();
    window.location.reload();
  }
  window.disableDevMode = () => {
      setup.unsetFlag("devmode");
      console.info("Dev mode disabled. Reload page.")
  }

if (setup.isFlagSet("devmode") && !$(".dev-info")[0]) {
    console.warn(`Developer mode enabled!
    
This feature is almost exclusively useful for me, the person who wrote this game, but I suppose it might sate your curiosity. By enabling this feature, you understand that you are putting yourself at risk of spoilers. Please don't enable this until you've fully enjoyed a normal playthrough of the game.

To undo this, type \`disableDevMode();\``);

    // Create devInfo element
    const $devInfo = $(`<div class="dev-info"></div>`)
    $devInfo.appendTo($("body"));
    // Title
    $devInfo.append($("<h2>Developer Tools</h2>"));
    // Console for showing useful data.
    const $devInfoList = $(`<dl></dl>`);
    $devInfoList.appendTo($devInfo);
    $devInfoList.append(`<dt>passage.name</dt><dd data-exec="passage.name"></dd>`);
    $devInfoList.append(`<dt>passage.tags</dt><dd data-exec="passage.tags"></dd>`);
    $devInfoList.append(`<dt>story.state (<a href="javascript:void(0)"  onclick="story.state = {};">reset</a>)</dt><dd data-exec="story.state"></dd>`);
    $devInfoList.append(`<dt>story.history.length</dt><dd data-exec="story.history.length"></dd>`);
    $devInfoList.append(`<dt>setup.getFlags()</dt><dd data-exec="setup.getFlags()"></dd>`);
    // Commands
    $devInfo.append(`<ul class="header-nav-group">
    <li><a href="javascript:void(0)" onclick="story.show('Warp zone')">Warp zone</a></li>
    <li><a href="javascript:void(0)"  onclick="story.save();">Save game</a></li>
    <li><a href="javascript:void(0)"  onclick="window.location.reload();">Load game</a></li>
    <li><a href="javascript:void(0)"  onclick="window.location.hash = '';">Clear save data</a></li>
    </ul>`);
    
    $(window).on("sm.passage.shown", (ev, {passage}) => {
        $devInfoList.find("[data-exec]")
          .each((i, el) => {
              $(el).text(JSON.stringify(eval($(el).attr("data-exec"))));
          });
    })
}