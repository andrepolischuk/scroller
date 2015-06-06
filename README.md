# skrl

  > Scroll content by wheel & touches

## Install

```sh
npm install --save skrl
```

```sh
component install andrepolischuk/skrl
```

## Usage

```js
var scroll = skrl(id[, params, callback]);
```

### id

  ID of scroller DOM element

### params.reverse

  Reverse scrolling enable

### params.interval

  Scrolling interval (px)

### callback

  Scrolling callback (get curent offset attribute)

## API

### skrl.el

  Scroller area

### skrl.go(offset)

  Scroll to defined offset (px)

## License

  MIT
