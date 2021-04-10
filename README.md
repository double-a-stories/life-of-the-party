# life-of-the-party

This is a text-based interactive story written in [Twee 3](https://github.com/iftechfoundation/twine-specs/blob/master/twee-3-specification.md). It contains content which **may be unsuitable for all except a unique adult audience**, including references to scat, sex, and death. Reader discretion is strongly advised. 

## Play

Latest stable build: https://double-a-stories.github.io/life-of-the-party/

## License

The source code underlying this project, including passage styling and Javascript, is licensed under the [MIT-0 license](/LICENSE-CODE). You may use any or all of of this code for any purpose **without attribution**.

All prose and image content of this story is licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). You are free to share and adapt the content in any medium or format **with attribution** for **non-commercial purposes**.

## Building from source

1. Install [Tweego](http://www.motoslave.net/tweego/).

1. Install story formats in the directory `~/.storyformats/`
    * [Snowman](https://github.com/videlais/snowman/tree/master/dist/snowman-2.0.3)
1. Install proofing formats (optional)
    * [poof](https://github.com/ChapelR/poof/releases) – Proof-reading tool
    * [Illume](https://www.maximumverbosity.net/twine/Illume/) – Provides passage analysis
    * [dotgraph](https://github.com/mcdemarco/dotgraph/releases/tag/v2.2.0) – Generates story graphs

1. To build:

    ```sh
    $ tweego ./src/ -o Life_of_the_Party.html
    # generates at output.html
    # -w (Watch for changes)
    # -s [passage name] (Specify start passage)
    # -f [formatid] (Specify a different format)
    ```
