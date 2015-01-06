# Skrl

  Scroll content by wheel & touches

## Instalation

  Browser:

```html
<script src="https://cdn.rawgit.com/andrepolischuk/skrl/1.0.0/skrl.min.js"></script>
```

  Component(1):

```sh
$ component install andrepolischuk/skrl
```

  Npm:

```sh
$ npm install skrl
```

## Use

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
