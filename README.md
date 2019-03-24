# README

This was a fun little project to demonstrate some interesting features in Javascript, including immutable data, full undo and redo, and making all possible user actions testable via unit tests (outside of the browser).

![15-gem-demo](15-gem-demo.gif)

It's a basic implementation of the [15 Gem Game](https://en.wikipedia.org/wiki/15_puzzle).

You can drag tiles into different positions on the board.

A few interesting things about it:

1. It uses [PIXI.js](http://www.pixijs.com/) to render the tile board in canvas.
2. It uses [Redux](https://redux.js.org/) as a state container.
3. It features full undo and redo - use CTRL-Z (undo) and CTRL-SHIFT-Z (redo) will retrace your moves. Undo and redo is achieved by using immutable data through [Immer.js](https://hackernoon.com/introducing-immer-immutability-the-easy-way-9d73d8f71cb3)
4. Rendering optimization performance is achieved by means of putting a componentShouldUpdate() on each tile, using the immutable state stored in the redux store to use a reference comparison to determine whether or not the tile should be rerendered. So each call of requestAnimation frame will only redraw the components that have state changed. This is similar to how performance optimizations are achieved in [React](https://reactjs.org/). 
5. The performance optimization can be disabled by unchecking the "Fast render" option. When "fast render" is unchecked, every tile will be rerendered every frame, which will drop fps, especially when rendering a lot of tiles in a larger board.
6. The application state is completely separated from the view rendering logic, which means we can easily write extensive tests of the redux actions called on the state without adding a renderer. You can run all of the tests using [Jasmine](https://jasmine.github.io/).

## Quick up and running instructions

1. Install Docker if you don't already have it
2. Go to the ```nginx``` directory
3. Run: 
```
docker build -t="hopscotch/15-gem-demo" .
```
4. Run: 
```
docker run -p 80:80 hopscotch/15-gem-demo
```

5. Go to http://localhost in a browser

## Development instructions

1. Install Docker and docker-compose

```
docker-compose up
```

You need to be running a recent(ish) version of node. This was tested using Node v10.15.1 LTS

In the nginx/html directory run:

```
npm install 
```

And then build the package (from the nginx/html directory):

```
parcel build index.html
```

Run tests (from the nginx/html directory):

```
jasmine
```

## Running commands inside the container 

You can also run the aforementioned npm, parcel, and jasmine commands inside the container by calling

```
docker exec -it <container_name> bash
``` 