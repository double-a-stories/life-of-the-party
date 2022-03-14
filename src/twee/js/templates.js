const Templates = (window.Templates = window.T = {});
{
  const contentWarningInline = (...warnings) =>
    `<em>(<abbr title="Content Warning">CW</abbr>` +
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

  Object.assign(window.Templates, {
    CWI: contentWarningInline,
    contentWarningInline,
    CWP: contentWarningParagraph,
    contentWarningParagraph,
  });
}
