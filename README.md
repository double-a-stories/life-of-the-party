# A Warm Place to Stay

A furry vore adventure, written in Twee 3.

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
    $ tweego ./src/ -o A_Warm_Place_to_Stay.html
    # generates at output.html
    # -w (Watch for changes)
    # -s [passage name] (Specify start passage)
    # -f [formatid] (Specify a different format)
    ```
