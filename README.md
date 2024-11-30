# BMesh

## TL;DR

This project's focus is port of Blender's BMesh Data Structure & Operations into
a javascript library. The goal is to provide a way to create simple web based 3D
modeling tools using pieces from a known & battle tested system.

## Resources

- [Blender's Design Document of BMesh](https://wiki.blender.org/wiki/Source/Modeling/BMesh/Design)
- [BMesh Python API](https://docs.blender.org/api/current/bmesh.html)
- [Github location of Blender's BMesh](https://github.com/blender/blender/tree/48e60dcbffd86f3778ce75ab67f95461ffbe319c/source/blender/bmesh/intern)

## Running the examples

Everything runs out of the box without a build. Just serve the files with a
static web server to see examples in your browser. For example with
[Node.js](https://nodejs.org/) installed (that's what we use to manage the
project), run

```sh
npx five-server .
```

This will use the `five-server` package to statically serve the files and
automatically open a browser tab.

## Development

Install dependencies:

```sh
npm clean-install
```

### Dev mode

Dev mode watches TypeScript files for changes and converts them to JS for
running in the browser, and reloads your browser tab on changes, which is
convenient while developing:

```sh
npm run dev
```

### Build mode

To build the project without watching, run

```sh
npm run build
```

The `dist/` folder has the JavaScript output, and it is committed into the repo
so that examples run out of the box, making the repo easy to host with any
static web server without running a build.

Run the following to serve the examples to see the result of the build when not
using dev mode:

```sh
npm run serve
```
