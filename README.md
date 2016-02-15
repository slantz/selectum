# Selectum

[Demo](https://slantz.github.io/selectum/)

[![selectum on NPM](https://img.shields.io/npm/v/selectum.svg)](https://www.npmjs.com/package/selectum)
[![selectum on Bower](https://img.shields.io/bower/v/selectum.svg)](http://bower.io/search/?q=selectum)
[![npm downloads](https://img.shields.io/npm/dm/selectum.svg)](https://www.npmjs.com/package/selectum)

> Custom native HTML5 select, using data attributes and vanilla JS events which can update url search params via history API and show subsets of other custom selects. Can have reset button to pick any value or reset dependent selects. Has an ability to set default palceholder text. Click can be handled via plugin or set with special data attribute.

> Great for Server or Client side rendering!!!

> This is fully jQuery or other libraries independent plugin, can be fully configured with ```[data-attributes]``` or via JS constructor function.

> It's always annoying and irretating when minified labrary renders it's markup and you have to debug it, if your HTML structure totally differs. One of the main advantages of this plugin is that it doesn't render any precompiled layout, you can attach this plugin to any HTML structure and configure it via data attributes or proper css classes. It acts as a separate module or web component.

##### It uses:
1. classList API
2. History API tomanipualte URL
3. polyfill for ```Element.prototype.closest```
4. initEvent (initCustomEvent for IE)
5. css classes for down and up arrows
6. on/off callbacks
7. location.search to selelct initial values

##### Settings:
- Attributes:
  - [data-selectum]
  - [data-selectum-render]
  - [data-selectum-exist]
  - [data-selectum-head]
  - [data-selectum-hiddable]
  - [data-selectum-clickable]
  - [data-selectum-current]
  - [data-selectum-reset]
  - [data-selectum-list]
  - [data-selectum-id]
  - [data-selectum-val]
  - [data-selectum-picker]
  - [data-selectum-picked]
  - [data-selectum-emit]
  - [data-selectum-emit-reset]
  - [data-selectum-listen]
  - [data-selectum-listen-reset]
  - [data-selectum-placeholder]
  - [data-selectum-update-url]
  - [data-selectum-url-fetch]
- JS:
```javascript
  new Selectum(el, {
    picker: true,
    picked: false,
    render: false,
    exist: false,
    title: 'Vegetables Selector',
    emit: 'selectCode',
    emitReset: 'resetAll',
    listen: 'seelctNumber',
    listenReset: 'resetCode',
    defaultText: 'Set code',
    updateUrl: true,
    urlFetch: true,
    hiddable: 'fruit'
  });
```
##### Methods:
  - on
  - off
  - render

##### Events:
  - click
  - reset
  - init:url

###### Usage:
```javascript
var select = new Selectum(document.querySelector('[data-selectum]'));

select.on('click', function(selectedVal){
    // triggered when some option was selected
});

select.on('reset', function(selectedVal){
    // triggered when reset button was clicked
});

select.on('init:url', function(selectedVal){
    // triggered when value was set from URL on initiation
});

select.off('click');
```

> IE10+


### Simple HTML5 Dropdown:
> This is single select which updates history pushState, configured via data-attributes and has no dependent selects.

```html
<div data-selectum="color" data-selectum-placeholder="Pick a color">
    <div class="plugin">
        <h6 class="selectum__head">Color Picker</h6>
        <div class="selectum__select">
            <span class="selectum__select__current i-arrow-bottom_after js-raw" data-selectum-clickable data-selectum-current></span>
            <ul class="selectum__select__list" data-selectum-list>
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

### Url updating select:
> In despite of the previous one this select can update url using History API and *can be updated* from URL parameter with the *lang* name. E.g. after selecting English as a language the URL will become smth like `location.origin/?lang=en`. The page won't be reloaded as pushState method is invoked.'

```html
<div data-selectum="lang" data-selectum-placeholder="Set language" data-selectum-update-url data-selectum-url-fetch>
    <div class="plugin">
        <div class="selectum__select">
            <span class="selectum__select__current i-arrow-bottom_after js-raw" data-selectum-clickable data-selectum-current></span>
            <ul class="selectum__select__list" data-selectum-list>
                <li data-selectum-reset>Default (EN)</li>
                <li data-selectum-id="en" data-selectum-val="English">English</li>
                <li data-selectum-id="de" data-selectum-val="Deutsch">Deutsch</li>
                <li data-selectum-id="fr" data-selectum-val="Francaise">Francaise</li>
                <li data-selectum-id="ru" data-selectum-val="Русский">Русский</li>
            </ul>
        </div>
    </div>
</div>
```

### Main Select and Dependent one:
> This is single select which updates history pushState, configured via data-attributes and has no dependent selects.

##### Differences:
1. has ```[data-selectum-picker]``` attribute, which generates proper css ```#selectum-hiding-styles``` that filter dependent selects subsets;
2. has ```[data-selectum-emit]``` attribute, here it emites *countryPicked* event and plugin with ```[data-selectum-listen="countryPicked"]``` will listen for this event to enable oneself and clean url parameter if necessary;
3. doesn't have ```[data-selectum-clickable]```  so open event will be triggered on ```[data-selectum]``` element click, i.e. plugin.

```html
<aside data-selectum="country" data-selectum-picker data-selectum-emit="countryPicked" data-selectum-placeholder="Pick Country">
    <h3>Eurasia</h3>
    <div class="selectum__select">
        <span class="i-arrow-bottom_after js-raw" data-selectum-current></span>
        <ul class="selectum__select__list" data-selectum-list>
            <li data-selectum-reset>Any</li>
            <li data-selectum-id="UK" data-selectum-val="United Kingdom">United Kingdom</li>
            <li data-selectum-id="DE" data-selectum-val="Germany">Germany</li>
            <li data-selectum-id="FR" data-selectum-val="France">France</li>
            <li data-selectum-id="UA" data-selectum-val="Ukraine">Ukraine</li>
        </ul>
    </div>
</aside>

<aside data-selectum="city" data-selectum-picked data-selectum-listen="countryPicked" data-selectum-placeholder="Pick City">
   <h3>Eurasia</h3>
   <section>
       <div class="i-arrow-bottom_after js-raw" data-selectum-current></div>
       <div class="selectum__select__list" data-selectum-list data-selectum-list-hiddable="country">
            <button data-selectum-reset>Any</button>
            <ul data-selectum-hidden-unless="UK">
                <li data-selectum-id="LND" data-selectum-val="London">London</li>
                <li data-selectum-id="BKW" data-selectum-val="Bakewell">Bakewell</li>
            </ul>
            <ul data-selectum-hidden-unless="DE">
                <li data-selectum-id="BRL" data-selectum-val="Berlin">Berlin</li>
                <li data-selectum-id="AAC" data-selectum-val="Aachen">Aachen</li>
            </ul>
            <ul data-selectum-hidden-unless="FR">
                <li data-selectum-id="PRS" data-selectum-val="Paris">Paris</li>
                <li data-selectum-id="MRC" data-selectum-val="Marseille">Marseille</li>
            </ul>
            <ul data-selectum-hidden-unless="UA">
              <li data-selectum-id="ODS" data-selectum-val="Odessa">Odessa</li>
              <li data-selectum-id="KIV" data-selectum-val="Kiev">Kiev</li>
            </ul>
       </div>
   </section>
</aside>
```

### Main Select and Dependent one reset:
> This plugin in despite of the previous one after reset button is clicked will set the dependent one to it's raw state, using ```js-raw``` class.

```html
<aside data-selectum="country" data-selectum-picker data-selectum-emit="countryPicked" data-selectum-emit-reset="clearCities" data-selectum-placeholder="Pick Country">
    <h3>Eurasia</h3>
    <div class="selectum__select">
        <span class="i-arrow-bottom_after js-raw" data-selectum-current></span>
        <ul class="selectum__select__list" data-selectum-list>
            <li data-selectum-reset>Any</li>
            <li data-selectum-id="UK" data-selectum-val="United Kingdom">United Kingdom</li>
            <li data-selectum-id="DE" data-selectum-val="Germany">Germany</li>
            <li data-selectum-id="FR" data-selectum-val="France">France</li>
            <li data-selectum-id="UA" data-selectum-val="Ukraine">Ukraine</li>
        </ul>
    </div>
</aside>

<aside data-selectum="city" data-selectum-picked data-selectum-listen="countryPicked" data-selectum-listen-reset="clearCities" data-selectum-placeholder="Pick City">
   <h3>Eurasia</h3>
   <section>
       <div class="i-arrow-bottom_after js-raw" data-selectum-current></div>
       <div class="selectum__select__list" data-selectum-list data-selectum-list-hiddable="country">
            <button data-selectum-reset>Any</button>
            <ul data-selectum-hidden-unless="UK">
                <li data-selectum-id="LND" data-selectum-val="London">London</li>
                <li data-selectum-id="BKW" data-selectum-val="Bakewell">Bakewell</li>
            </ul>
            <ul data-selectum-hidden-unless="DE">
                <li data-selectum-id="BRL" data-selectum-val="Berlin">Berlin</li>
                <li data-selectum-id="AAC" data-selectum-val="Aachen">Aachen</li>
            </ul>
            <ul data-selectum-hidden-unless="FR">
                <li data-selectum-id="PRS" data-selectum-val="Paris">Paris</li>
                <li data-selectum-id="MRC" data-selectum-val="Marseille">Marseille</li>
            </ul>
            <ul data-selectum-hidden-unless="UA">
              <li data-selectum-id="ODS" data-selectum-val="Odessa">Odessa</li>
              <li data-selectum-id="KIV" data-selectum-val="Kiev">Kiev</li>
            </ul>
       </div>
   </section>
</aside>
```

### Select rendered by client with a default template:
> This select can be rendered dynamically by client side and configured either by attribtes or js means.

Custom array of objects or string of elements should be passed to select

```javascript
var select = null;

 [].slice.call( document.querySelectorAll('[data-selectum]') ).forEach( function(el) {
     select = new Selectum(el);
 });

window.setTimeout(function() {
  select.render({
    head: select.options.head || 'Any other head', // Optional
    items: [
       {id : 0, val : 'apple'},
       {id : 1, val : 'banana'},
       {id : 2, val : 'tangerin'}
    ]
  })
}, Math.random() * 2000 + 1000);
```

```html
<aside data-selectum="fruit" data-selectum-picker data-selectum-emit="fruit:chosen" data-selectum-emit-reset="sell:fruits" data-selectum-placeholder="Get your Fruit" data-selectum-head="Buy a Fruit" data-selectum-render></aside>
```

> This will be rendered into

```html
<aside data-selectum="country" data-selectum-picker data-selectum-emit="fruit:chosen" data-selectum-emit-reset="sell:fruits" data-selectum-placeholder="Get your Fruit" data-selectum-head="Buy a Fruit" data-selectum-render></aside>
    <h3 class="selectum__head">Buy a Fruit</h3>
    <div class="selectum__select">
        <span class="selectum__select__current i-arrow-bottom_after js-raw" data-selectum-current>Get your Fruit</span>
        <ul class="selectum__select__list" data-selectum-list>
            <li data-selectum-reset>Any</li>
            <li data-selectum-id="0" data-selectum-val="apple">apple</li>
            <li data-selectum-id="1" data-selectum-val="banana">banana</li>
            <li data-selectum-id="2" data-selectum-val="tangerin">tangerin</li>
        </ul>
    </div>
</aside>
```

### Select rendered by client with a default template:
> This is the dependent select which depend on the fruit one, that can be set via ```[data-selectum-hiddable="fruit"]``` attribute or with js by passing ```listen: 'fruit'``` setting key.

Custom array of objects or string of elements should be passed to select

```javascript
var select = null;

 [].slice.call( document.querySelectorAll('[data-selectum]') ).forEach( function(el) {
     select = new Selectum(el);
 });

window.setTimeout(function() {
  select.render({
    head: select.options.head || 'Any other head', // Optional
    listen: 'fruit', // Optional, just for example, unnecessary here as it's duplicated via data-selectum-hiddable attribute
    items: [
    {
        id : '0',
        val : [
            {id : 00, val : 'green'},
            {id : 01, val : 'red'},
            {id : 02, val : 'yellow'}
       ]
   },
    {
        id : '1',
        val : [
            {id : 10, val : 'fresh'},
            {id : 11, val : 'rotten'},
            {id : 12, val : 'green'}
       ]
   },
   {
       id : '2',
       val : [
           {id : 20, val : 'sweet'},
           {id : 21, val : 'sour'},
           {id : 22, val : 'mild'}
      ]
  }
   ]
  })
}, Math.random() * 2000 + 1000);
```

```html
<aside data-selectum="fruit" data-selectum-head="Fruit Type" data-selectum-picked data-selectum-listen="fruit:chosen" data-selectum-listen-reset="sell:fruits" data-selectum-placeholder="Get your Fruit" data-selectum-head="Buy a Fruit" data-selectum-render data-selectum-hiddable="fruit"></aside>
```

> This will be rendered into

```html
<aside data-selectum="fruit" data-selectum-head="Fruit Type" data-selectum-picked="" data-selectum-listen="fruit:chosen" data-selectum-listen-reset="sell:fruits" data-selectum-placeholder="Get your Fruit" data-selectum-render="" data-selectum-hiddable="fruit" class="js-disabled">
    <h3 class="selectum__head">Fruit Type</h3>
    <section>
        <div class="selectum__select__current i-arrow-bottom_after js-raw" data-selectum-current="">Get your Fruit</div>
        <div class="selectum__select__list" data-selectum-list="" data-selectum-list-hiddable="fruit">
            <button data-selectum-reset="">Any</button>
            <ul data-selectum-hidden-unless="0">
                <li data-selectum-id="0" data-selectum-val="green">green</li>
                <li data-selectum-id="1" data-selectum-val="red">red</li>
                <li data-selectum-id="2" data-selectum-val="yellow">yellow</li>
            </ul>
            <ul data-selectum-hidden-unless="1">
                <li data-selectum-id="10" data-selectum-val="fresh">fresh</li>
                <li data-selectum-id="11" data-selectum-val="rotten">rotten</li>
                <li data-selectum-id="12" data-selectum-val="green">green</li>
            </ul>
            <ul data-selectum-hidden-unless="2">
                <li data-selectum-id="20" data-selectum-val="sweet">sweet</li>
                <li data-selectum-id="21" data-selectum-val="sour">sour</li>
                <li data-selectum-id="22" data-selectum-val="mild">mild</li>
            </ul>
        </div>
    </section>
</aside>
```

### Select rendered by client with a custom template:
> This select can be rendered dynamically by client side and configured either by attribtes or js means.

Custom array of objects or string of elements should be passed to select

```javascript
var select = null;
    [].slice.call( document.querySelectorAll('[data-selectum]') ).forEach( function(el) {
        select = new Selectum(el);
    });

window.setTimeout(function() {
  select.render({
    items: [
       {id : 0, val : 'apple'},
       {id : 1, val : 'banana'},
       {id : 2, val : 'tangerin'}
    ]
  })
}, 3000);

window.setTimeout(function() {
  select.render({
    head: 'Totally changed head',
    items: [
       {id : 0, val : 'some'},
       {id : 1, val : 'other'},
       {id : 2, val : 'array'},
       {id : 3, val : 'maybe'},
       {id : 4, val : 'enormous'}
    ]
  })
}, 7000);
```

```html
<aside data-selectum="fruit" data-selectum-head="Fruit Type" data-selectum-picker data-selectum-emit="fruit:chosen" data-selectum-emit-reset="sell:fruits" data-selectum-placeholder="Get your Fruit" data-selectum-head="Buy a Fruit" data-selectum-render data-selectum-exist>
    <h3><%=head%></h3>
    <div class="selectum__select">
        <span class="i-arrow-bottom_after js-raw" data-selectum-current></span>
        <ul class="selectum__select__list" data-selectum-list>
            <li data-selectum-reset>Any</li>
          <% for ( var i = 0; i < items.length; i++ ) { %>
            <li data-selectum-id="<%=items[i].id%>" data-selectum-val="<%=items[i].val%>"><%=items[i].val%></li>
          <% } %>
        </ul>
    </div>
</aside>
```

> This will be rendered into

```html
<aside data-selectum="fruit" data-selectum-head="Fruit Type" data-selectum-picker data-selectum-emit="fruit:chosen" data-selectum-emit-reset="sell:fruits" data-selectum-placeholder="Get your Fruit" data-selectum-head="Buy a Fruit" data-selectum-render data-selectum-exist>
    <h3 class="selectum__head">Totally changd head</h3>
    <div class="selectum__select">
        <span class="selectum__select__current i-arrow-bottom_after js-raw" data-selectum-current>Get your Fruit</span>
        <ul class="selectum__select__list" data-selectum-list>
            <li data-selectum-reset>Any</li>
            <li data-selectum-id="0" data-selectum-val="some">some</li>
            <li data-selectum-id="1" data-selectum-val="other">other</li>
            <li data-selectum-id="2" data-selectum-val="array">array</li>
            <li data-selectum-id="3" data-selectum-val="maybe">maybe</li>
            <li data-selectum-id="4" data-selectum-val="enormous">enormous</li>
        </ul>
    </div>
</aside>
```
