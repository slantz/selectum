# Selectum

[![selectum on NPM](https://img.shields.io/npm/v/selectum.svg)](https://www.npmjs.com/package/selectum)
[![selectum on Bower](https://img.shields.io/bower/v/selectum.svg)](http://bower.io/search/?q=selectum)

> Custom native HTML5 select, using data attributes and vanilla JS events which can update url search params via history API and show subsets of other custom selects. Can have reset button to pick any value or reset dependent selects. Has an ability to set default palceholder text. Click can be handled via plugin or set with special data attribute.

> This is fully jQuery or other libraries independent plugin, can be fully configured with ```[data-attributes]``` or via JS constructor function.

> One of the main advantages of this plugin is that it doesn't render any precompiled layout, you can attach this plugin to any HTML structure and configure it via data attributes or proper css classes. It acts as a separate module or web component.

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
    emit: 'selectCode',
    emitReset: 'resetAll',
    listen: 'seelctNumber',
    listenReset: 'resetCode',
    defaultText: 'Set code',
    updateUrl: true,
    urlFetch: true
  });
```

> IE10+

[Demo](http://slantz.github.io/selectum/)

### Simple HTML5 Dropdown:
> This is single select which updates history pushState, configured via data-attributes and has no dependent selects.

```html
<div data-selectum="color" data-selectum-placeholder="Pick a color">
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

### Url updating select:
> In despite of the previous one this select can update url using History API and *can be updated* from URL parameter with the *lang* name. E.g. after selecting English as a language the URL will become smth like `location.origin/?lang=en`. The page won't be reloaded as pushState method is invoked.'

```html
<div data-selectum="lang" data-selectum-placeholder="Set language" data-selectum-update-url data-selectum-url-fetch>
    <div class="plugin">
        <div class="plgin__select">
            <span class="plugin__select__current i-arrow-bottom_after js-raw" data-selectum-clickable data-selectum-current></span>
            <ul class="plugin__select__list" data-selectum-list>
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

### Main Selct and Dependent one:
> This is single select which updates history pushState, configured via data-attributes and has no dependent selects.

##### Differences:
1. has ```[data-selectum-picker]``` attribute, which generates proper css ```#selectum-hiding-styles``` that filter dependent selects subsets;
2. has ```[data-selectum-emit]``` attribute, here it emites *countryPicked* event and plugin with ```[data-selectum-listen="countryPicked"]``` will listen for this event to enable oneself and clean url parameter if necessary;
3. doesn't have ```[data-selectum-clickable]```  so open event will be triggered on ```[data-selectum]``` element click, i.e. plugin.

```html
<aside data-selectum="make" data-selectum-picker data-selectum-emit="countryPicked" data-selectum-placeholder="Pick Country">
    <h3>Eurasia</h3>
    <div class="plgin__select">
        <span class="i-arrow-bottom_after js-raw" data-selectum-current></span>
        <ul class="plugin__select__list" data-selectum-list>
            <li data-selectum-reset>Any</li>
            <li data-selectum-id="UK" data-selectum-val="United Kingdom">United Kingdom</li>
            <li data-selectum-id="DE" data-selectum-val="Germany">Germany</li>
            <li data-selectum-id="FR" data-selectum-val="France">France</li>
            <li data-selectum-id="UA" data-selectum-val="Ukraine">Ukraine</li>
        </ul>
    </div>
</aside>

<aside data-selectum="make" data-selectum-picked data-selectum-listen="countryPicked" data-selectum-placeholder="Pick City">
   <h3>Eurasia</h3>
   <section>
       <div class="i-arrow-bottom_after js-raw" data-selectum-current></div>
       <div class="plugin__select__list" data-selectum-list>
            <button data-selectum-reset>Any</button>
            <ul data-czd-drpdwn-hidden-unless="UK">
                <li data-czd-drpdwn-li data-czd-drpdwn-id="LND" data-czd-drpdwn-make="London">London</li>
                <li data-czd-drpdwn-li data-czd-drpdwn-id="BKW" data-czd-drpdwn-make="Bakewell">Bakewell</li>
            </ul>
            <ul data-czd-drpdwn-hidden-unless="DE">
                <li data-czd-drpdwn-li data-czd-drpdwn-id="BRL" data-czd-drpdwn-make="Berlin">Berlin</li>
                <li data-czd-drpdwn-li data-czd-drpdwn-id="AAC" data-czd-drpdwn-make="Aachen">Aachen</li>
            </ul>
            <ul data-czd-drpdwn-hidden-unless="FR">
                <li data-czd-drpdwn-li data-czd-drpdwn-id="PRS" data-czd-drpdwn-make="Paris">Paris</li>
                <li data-czd-drpdwn-li data-czd-drpdwn-id="MRC" data-czd-drpdwn-make="Marseille">Marseille</li>
            </ul>
            <ul data-czd-drpdwn-hidden-unless="UA">
              <li data-czd-drpdwn-li data-czd-drpdwn-id="ODS" data-czd-drpdwn-make="Odessa">Odessa</li>
              <li data-czd-drpdwn-li data-czd-drpdwn-id="KIV" data-czd-drpdwn-make="Kiev">Kiev</li>
            </ul>
       </div>
   </section>
</aside>
```

### Main Selct and Dependent one reset:
> This plugin in despite of the previous one after reset button is clicked will set the dependent one to it's raw state, using ```js-raw``` class.

```html
<aside data-selectum="make" data-selectum-picker data-selectum-emit="countryPicked" data-selectum-emit-reset="clearCities" data-selectum-placeholder="Pick Country">
    <h3>Eurasia</h3>
    <div class="plgin__select">
        <span class="i-arrow-bottom_after js-raw" data-selectum-current></span>
        <ul class="plugin__select__list" data-selectum-list>
            <li data-selectum-reset>Any</li>
            <li data-selectum-id="UK" data-selectum-val="United Kingdom">United Kingdom</li>
            <li data-selectum-id="DE" data-selectum-val="Germany">Germany</li>
            <li data-selectum-id="FR" data-selectum-val="France">France</li>
            <li data-selectum-id="UA" data-selectum-val="Ukraine">Ukraine</li>
        </ul>
    </div>
</aside>

<aside data-selectum="make" data-selectum-picked data-selectum-listen="countryPicked" data-selectum-listen-reset="clearCities" data-selectum-placeholder="Pick City">
   <h3>Eurasia</h3>
   <section>
       <div class="i-arrow-bottom_after js-raw" data-selectum-current></div>
       <div class="plugin__select__list" data-selectum-list>
            <button data-selectum-reset>Any</button>
            <ul data-czd-drpdwn-hidden-unless="UK">
                <li data-czd-drpdwn-li data-czd-drpdwn-id="LND" data-czd-drpdwn-make="London">London</li>
                <li data-czd-drpdwn-li data-czd-drpdwn-id="BKW" data-czd-drpdwn-make="Bakewell">Bakewell</li>
            </ul>
            <ul data-czd-drpdwn-hidden-unless="DE">
                <li data-czd-drpdwn-li data-czd-drpdwn-id="BRL" data-czd-drpdwn-make="Berlin">Berlin</li>
                <li data-czd-drpdwn-li data-czd-drpdwn-id="AAC" data-czd-drpdwn-make="Aachen">Aachen</li>
            </ul>
            <ul data-czd-drpdwn-hidden-unless="FR">
                <li data-czd-drpdwn-li data-czd-drpdwn-id="PRS" data-czd-drpdwn-make="Paris">Paris</li>
                <li data-czd-drpdwn-li data-czd-drpdwn-id="MRC" data-czd-drpdwn-make="Marseille">Marseille</li>
            </ul>
            <ul data-czd-drpdwn-hidden-unless="UA">
              <li data-czd-drpdwn-li data-czd-drpdwn-id="ODS" data-czd-drpdwn-make="Odessa">Odessa</li>
              <li data-czd-drpdwn-li data-czd-drpdwn-id="KIV" data-czd-drpdwn-make="Kiev">Kiev</li>
            </ul>
       </div>
   </section>
</aside>
```