# Selectum

[![selectum on NPM](https://img.shields.io/npm/v/selectum.svg)](https://www.npmjs.com/package/selectum)
[![selectum on Bower](https://img.shields.io/bower/v/selectum.svg)](http://bower.io/search/?q=selectum)

> Custom native HTML5 select, using data attributes and vanilla JS events which can update url search params via history API and show subsets of other custom selects. Can have reset button to pick any value or reset dependent selects. Has an ability to set default palceholder text. Click can be handled via plugin or set with special data attribute.

> This is fully jQuery or other libraries independent plugin, can be fully configured with ```[data-attributes]``` or via JS constructor function.

> It uses:
1. classList API
2. History API tomanipualte URL
3. polyfill for ```Element.prototype.closest```
4. initEvent (initCustomEvent for IE)
5. css classes for down and up arrows
6. on/off callbacks
7. location.search to selelct initial values

> Settings:
*

> IE10+

[Demo](http://slantz.github.io/selectum/)

### Simple HTML5 Dropdown:
> This is single select which updates history pushState, configured via data-attributes and has no dependent selects.

```html
<div data-selectum="color" data-selectum-placeholder="Pick a color" data-selectum-update-url>
    <div class="plugin">
        <h6 class="plugin__head">Color Picker</h6>
        <div class="plgin__select">
            <span class="plugin__select__current i-arrow-bottom_after js-raw" data-selectum-clickable data-selectum-current></span>
            <ul class="plugin__select__list" data-selectum-list>
                <li data-selectum-reset>Any</li>
                <li data-selectum-id="r" data-selectum-val="red">red</li>
                <li data-selectum-id="y" data-selectum-val="yellow">yellow</li>
                <li data-selectum-id="g" data-selectum-val="green">green</li>
                <li data-selectum-id="b" data-selectum-val="blue">blue</li>
            </ul>
        </div>
    </div>
</div>
```
