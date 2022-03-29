const Templates = (window.Templates = window.T = {});
{
  const contentWarningInline = (...warnings) =>
    `<em>(<abbr title="Content Warning">CW</abbr>: ` +
    warnings
      .sort()
      .map((w) => `<span style="white-space:nowrap;">${w}.</span>`)
      .join(" ") +
    `)</em>`;

  const contentWarningParagraph = (...warnings) =>
    `<p class="content-warning"><b>Content warning</b>: ` +
    warnings
      .sort()
      .map((w) => `<span style="white-space:nowrap;">${w}.</span>`)
      .join(" ") +
    `</p>`;

  // Templates for Hazel Epilogue

  const socialMediaComment = ([username, comment]) =>
    `<p><b>${username}</b> ${comment}</p>`;

  const hashtag = (tag) => `<span aria-label="hashtag">#</span>${tag}`;

  const likes = (likes) =>
    `<p class="social-card__likes"><span aria-label="${+likes | 0} likes">♡ ${
      +likes | 0
    }</span></p>`;

  const hoursAgo = (hours) =>
    `${+hours | 0}<span aria-label="hours">h</span> ago`;
  const minutesAgo = (mins) =>
    `${+mins | 0}<span aria-label="minutes">m</span> ago`;

  const socialMediaCard = ({
    name,
    username,
    time,
    body,
    hashtags,
    likeCount,
    comments,
  }) =>
    `<div class="social-card">
    <p>${name} <small>${username} – ${time}</small></p>
    <div class="social-card__body">${body}</div>
    <p><small>${(hashtags || []).map(hashtag).join(" ")}</small>
    ${likes(likeCount)}
    ${
      comments
        ? `<div.social-card__comments>${(comments || [])
            .map(socialMediaComment)
            .join("\n")}</div>`
        : ``
    }
</div>`;

  Object.assign(window.Templates, {
    CWI: contentWarningInline,
    contentWarningInline,
    CWP: contentWarningParagraph,
    contentWarningParagraph,
    hoursAgo,
    hashtag,
    minutesAgo,
    socialMediaCard,
  });
}
