# Skrl

  Scroll content by wheel & touches

## Instalation

  Via script tag in page sources:

```html
<script src="//cdn.rawgit.com/andrepolischuk/skrl/0.2.0/skrl.min.js"></script>
```

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
