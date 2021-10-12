if (setup.isFlagSet("devmode") && !$(".dev-info")[0]) {
    // Create devInfo element
    const $devInfo = $(`<details class="dev-info" open></details>`)
    $devInfo.appendTo($("body"));
    // Title
    $devInfo.append($("<summary>Developer Tools</summary>"));
    // Console for showing useful data.
    const $devInfoList = $(`<dl></dl>`);
    $devInfoList.appendTo($devInfo);
    $devInfoList.append(`<dt>passage.name</dt><dd data-exec="passage.name"></dd>`);
    $devInfoList.append(`<dt>passage.tags</dt><dd data-exec="passage.tags"></dd>`);
    $devInfoList.append(`<dt>story.state (<a href="javascript:void(0)"  onclick="story.state = {};">reset</a>)</dt><dd data-exec="story.state"></dd>`);
    $devInfoList.append(`<dt>story.history.length</dt><dd data-exec="story.history.length"></dd>`);
    $devInfoList.append(`<dt>setup.getFlags() (<a href="javascript:void(0)"  onclick="setup.resetAchievements(); setup.resetFlags(); setup.setFlag('devmode')">reset</a>)</dt><dd data-exec="setup.getFlags()"></dd>`);
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
              $(el).text(JSON.stringify(eval($(el).attr("data-exec")), null, 2));
          });
    })
}

