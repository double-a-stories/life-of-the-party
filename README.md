# double-a-stories / life-of-the-party

This repository hosts source code for *Life of the Party*, a NSFW interactive story written in [Twee 3](https://github.com/iftechfoundation/twine-specs/blob/master/twee-3-specification.md).

⚠️ **CONTENT WARNING:** This story is for **adults only**, and reader discretion is strongly advised. It contains **strong fetish content**, including but not limited to: *Soft vore. Dubious consent. Unwilling digestion. Sex. Violence. Sexual violence. Masturbation. Sadism. Blood. Post-vore scat disposal. Death.*
## About the story (18+)

* [ABOUT.MD](ABOUT.md)
## License

All prose and image content in *Life of the Party* is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). You are free to share and adapt this content in any medium or format **with attribution** for **non-commercial purposes** under **the same license**.

All non-textual source code underlying this project (excluding the prose content described above), including configuration files and scripts, is licensed under the [MIT-0 license](/LICENSE-CODE). You may use any or all of this code for any purpose **without attribution**.

## Building from source

1. Install [Tweego](http://www.motoslave.net/tweego/) and [NodeJS](https://nodejs.org/).
  * The `tweego` and `node` binaries must be in your system's PATH.
  * If you built Tweego from scratch, you'll need to manually install the [snowman-2](https://github.com/videlais/snowman/tree/master/dist/snowman-2.0.3) format into `storyformats/` story format, if you don't already have it.
4. Install story formats into `./storyformats` (optional)
    * [snowman-2](https://github.com/videlais/snowman/tree/master/dist/snowman-2.0.3)
    * [poof](https://github.com/ChapelR/poof/releases) – Proof-reading tool
    * [illume](https://www.maximumverbosity.net/twine/Illume/) – Provides passage analysis
    * [dotgraph](https://github.com/mcdemarco/dotgraph/releases/tag/v2.2.0) – Generates story graphs
5. `npm run develop` - Launch live server for development
6. `npm run twee-build` - Generates game at ./dist/index.html
