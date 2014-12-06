# Scroller

  Scroll content by wheel & touches

## Instalation

  Via script tag in page sources:

```html
<script src="//cdn.rawgit.com/andrepolischuk/scroller/0.2.0/scroller.min.js"></script>
```

```js
var scroll = scroller(id[, params, callback]);
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

### scroller.el

  Scroller area

### scroller.go(offset)

  Scroll to defined offset (px)
