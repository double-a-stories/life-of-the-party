# stories-about-bunnies

Fiction written in Twee3. Don't nose around too much, okay?

## Building

1. Download the latest [Tweego](http://www.motoslave.net/tweego/) binary for your OS

     * On macOS, you might need to fiddle with gatekeeper.

2. Place the tweego directory into this folder.

   ```git
   = ./
   = - a-warm-place-to-stay/
   = - life-of-the-party/
   = - README.md
   + - tweego/
   +   - storyformats/
   +   - tweego (binary)
   ```

3. To build:

    ```sh
    $ tweego/tweego [story-folder] -o [output].html
    # generates at output.html
    # -w (Watch for changes)
    # -s [passage name] (Specify start passage)
    # -f [formatid] (Specify different format)
    ```

## Proofing

1. Download desired proofing formats
   * [poof](https://github.com/ChapelR/poof/releases) – Proof-reading tool
   * [Illume](https://www.maximumverbosity.net/twine/Illume/) – Provides passage analysis
   * [dotgraph](https://github.com/mcdemarco/dotgraph/releases/tag/v2.2.0) – Generates story graphs
2. Place in tweego/storyformats/

    ```git
    = tweego/
    =   - storyformats/
    =     - snowman-2/
    +     - illume/
    +       - format.js
    +     - poof/
    +       - format.js
    +     - dotgraph/
    +       - format.js
    ```

3. Use the `tweego -f [formatid]` flag to compile with one of these formats.
