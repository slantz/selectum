;(function(window){

    'use strict';

    (function(e){
        e.closest = e.closest || function closest(css){
                return this.parentNode ?
                    this.matches(css) ? this : closest.call(this.parentNode, css)
                    : null;
            }
    })(Element.prototype);

    function callCallback(instance, type) {
        if (instance.options.callbacks.hasOwnProperty(type)) {
            for (var i = 0, max = instance.options.callbacks[type].length; i < max; i++) {
                instance.options.callbacks[type][i](this.options.selected);
            }
        }
    };

    var templateCache = {};

    function getDefaultTemplate(type) {
        switch (type) {
            case 'simple':
                return '<h6 class="selectum__head"><%=head%></h6>\
                        <div class="selectum__select">\
                            <span class="selectum__select__current i-arrow-bottom_after js-raw" data-selectum-current></span>\
                            <ul class="selectum__select__list" data-selectum-list>\
                                <li data-selectum-reset>Any</li>\
                            <% for ( var i = 0; i < items.length; i++ ) { %>\
                                <li data-selectum-id="<%=items[i].id%>" data-selectum-val="<%=items[i].val%>"><%=items[i].val%></li>\
                            <% } %>\
                            </ul>\
                        </div>';
            case 'picker':
                return '<h3 class="selectum__head"><%=head%></h3>\
                        <div class="selectum__select">\
                            <span class="selectum__select__current i-arrow-bottom_after js-raw" data-selectum-current></span>\
                            <ul class="selectum__select__list" data-selectum-list>\
                                <li data-selectum-reset>Any</li>\
                            <% for ( var i = 0; i < items.length; i++ ) { %>\
                                <li data-selectum-id="<%=items[i].id%>" data-selectum-val="<%=items[i].val%>"><%=items[i].val%></li>\
                            <% } %>\
                            </ul>\
                        </div>';
            case 'picked':
                return '<h3 class="selectum__head"><%=head%></h3>\
                        <section>\
                            <div class="selectum__select__current i-arrow-bottom_after js-raw" data-selectum-current></div>\
                            <div class="selectum__select__list" data-selectum-list data-selectum-list-hiddable="<%=listen%>">\
                                <button data-selectum-reset>Any</button>\
                            <% for ( var i = 0; i < items.length; i++ ) { %>\
                                <ul data-selectum-hidden-unless="<%=items[i].id%>">\
                                <% for ( var j = 0; j < items[i].val.length; j++ ) { %>\
                                    <li data-selectum-id="<%=items[i].val[j].id%>" data-selectum-val="<%=items[i].val[j].val%>"><%=items[i].val[j].val%></li>\
                                <% } %>\
                                </ul>\
                            <% } %>\
                            </div>\
                        </section>';
        };
    };

    (function(){
        var cache = {};

        this.tmpl = function tmpl(str, data, custom){
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            var fn = !/\W/.test(str) ?
                cache[str] = cache[str] ||
                    tmpl(custom ? str : getDefaultTemplate(str)) :

                // Generate a reusable function that will serve as a template
                // generator (and which will be cached).
                new Function("obj",
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +

                        // Introduce the data as local variables using with(){}
                    "with(obj){p.push('" +

                        // Convert the template into pure JavaScript
                    str
                        .replace(/[\r\t\n]/g, " ")
                        .split("<%").join("\t")
                        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                        .replace(/\t=(.*?)%>/g, "',$1,'")
                        .split("\t").join("');")
                        .split("%>").join("p.push('")
                        .split("\r").join("\\'")
                    + "');}return p.join('');");

            // Provide some basic currying to the user
            return data ? fn( data ) : fn;
        };
    }.bind(Selectum))();

    function Selectum( el, options ) {
        this.el = el;
        this.options = Selectum.extend({
            inited: false,
            selected: null,
            render: false,
            exist: false,
            picker: false,
            picked: false,
            emit: false,
            emitReset: false,
            listen: false,
            listenReset: false,
            defaultText: '',
            updateUrl: false,
            urlFetch: false,
            head: 'Select an Item',
            hiddable: '',
            callbacks: {}
        }, {
            render: this.el.dataset.hasOwnProperty('selectumRender'),
            exist: this.el.dataset.hasOwnProperty('selectumExist') ? this.el.dataset.selectumExist || 'Loading...' : false,
            head: this.el.dataset.hasOwnProperty('selectumHead') ? this.el.dataset.selectumHead : '',
            picker: this.el.dataset.hasOwnProperty('selectumPicker'),
            picked: this.el.dataset.hasOwnProperty('selectumPicked'),
            emit: this.el.dataset.hasOwnProperty('selectumEmit') ? this.el.dataset.selectumEmit : false,
            emitReset: this.el.dataset.hasOwnProperty('selectumEmitReset') ? this.el.dataset.selectumEmitReset : false,
            hiddable: this.el.dataset.hasOwnProperty('selectumHiddable') ? this.el.dataset.selectumHiddable : '',
            listen: this.el.dataset.hasOwnProperty('selectumListen') ? this.el.dataset.selectumListen : false,
            listenReset: this.el.dataset.hasOwnProperty('selectumListenReset') ? this.el.dataset.selectumListenReset : false,
            defaultText: this.el.dataset.hasOwnProperty('selectumPlaceholder') ? this.el.dataset.selectumPlaceholder : '',
            updateUrl: this.el.dataset.hasOwnProperty('selectumUpdateUrl'),
            urlFetch: this.el.dataset.hasOwnProperty('selectumUrlFetch'),
        });
        Selectum.extend( this.options, options );
        this._init();
    }

    Selectum.event = {};

    Selectum.extend = function(a,b) {
        for( var key in b ) {
            if( b.hasOwnProperty( key ) ) {
                a[key] = b[key];
            }
        }
        return a;
    };

    Selectum.urlUpdater = function(key, value) {
        var string = location.pathname + location.search;
        var value =  value === '' ? value : isNaN(+value) ? value : parseInt(+value,10);
        var regexp = new RegExp('(' + key + '=)(.+?)(&|$)');
        var partialString = '';

        if (regexp.test(string)) {
            string = string.replace(regexp, function(match, p1, p2, p3, offset){
                if (value === '') {
                    return '';
                } else {
                    return p1 + value + p3;
                }
            });
            regexp.lastIndex = null;
        } else {
            if (value === '') {
                return null;
            } else {
                partialString = location.search !== '' ? '&' : '?';
                partialString += key + '=' + value;
                string += partialString;
            }
        }

        if (string.substring(string.length-1) === '&' || string.substring(string.length-1) === '?') {
            string = string.slice(0, string.length-1);
        }
        window.history.pushState(key, 'filter', string);
    };

    Selectum._showProperSubsets = function(param) {
        var uniqueId = "selectum-hiding-styles-" + this.el.dataset.selectum;
        var style = document.querySelector('#' + uniqueId);
        if (!style) {
            style = document.createElement('style');
            style.id = uniqueId;
            document.head.appendChild(style);
        }
        style.innerHTML = "[data-selectum-list-hiddable='" + this.el.dataset.selectum + "']>[data-selectum-hidden-unless='" + param+ "']{display:block}";
    }

    Selectum.prototype._setDocumentExternalClose = function() {
        var _this = this;
        document.addEventListener('click', function(e){
            if (!(e.target.closest('[data-selectum]'))) {
                if (_this.DOMElements.currentList.classList.contains('js-open')) {
                    _this.DOMElements.currentList.classList.remove('js-open');
                    _this._toggleArrows();
                }
            }
        });
    };

    Selectum.prototype._init = function(triggered){
        if (!this.options.render || triggered) {
            this._setDOMElements();
            this._initEvents();
            this._setActive();
            this._disabledIfDependent();
            this._addHiddenStyles();
            this._setDocumentExternalClose();
            this._setDefaultPlaceholder();
            this._setFromSearchParams();
            this.options.inited = true;
        }
        if (this.options.render && !triggered) {
            this._hideExistingTemplate();
        }
    };

    Selectum.prototype.render = function(data) {
        if (this.options.inited) {
            this.el.innerHTML = '';
        }
        if (data !== null && typeof data === 'object') {
            if (typeof data.head === 'undefined') {
                data.head = this.options.head || 'Select';
            }
            if (this.options.picked) {
                if (typeof data.listen === 'undefined') {
                    data.listen = this.options.hiddable || 'selectum';
                }
            }
            if (typeof data.items === 'undefined') {
                console.error('items key should be present');
            } else {
                if (!Array.isArray(data.items)) {
                    console.error('items should be an array');
                } else {
                    if (data.items.length === 0) {
                        console.error('items should becontain at least one object with key: id, val');
                    } else {
                        var type = '';
                        if (!this.options.picked) {
                            if (this.options.picker) {
                                type = 'picker';
                            } else {
                                type = 'simple';
                            }
                        } else {
                            type = 'picked';
                        }
                        if (this.options.exist) {
                            this.el.innerHTML = Selectum.tmpl(templateCache[this.el.dataset.selectum], data, true);
                        } else {
                            this.el.innerHTML = Selectum.tmpl(type, data);
                        }
                        this._init(true);
                    }
                }
            }
        } else {
            console.error('Please provide data Object to render');
        }
    };

    Selectum.prototype._hideExistingTemplate = function() {
        if (this.options.exist) {
            if (!templateCache.hasOwnProperty(this.el.dataset.selectum)) {
                templateCache[this.el.dataset.selectum] = this.el.innerHTML.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
            }
            this.el.innerHTML = '<h3 data-selectum-temp-head>' + this.options.exist + '</h3>'
        }
    }

    Selectum.prototype._setDefaultPlaceholder = function() {
        this.DOMElements.currentFilter.textContent = this.options.defaultText;
    };

    Selectum.prototype._disabledIfDependent = function() {
        if (this.options.picked) {
            this.el.classList.add('js-disabled');
            this.DOMElements.currentFilter.classList.remove('i-arrow-bottom_after');
            this.DOMElements.currentFilter.classList.add('js-raw', 'i-arrow-bottom-disabled_after');
        }
    };

    Selectum.prototype._addHiddenStyles = function() {
        if (this.options.picked) {
            var uniqueId = "data-selectum-list-hiddable";
            var style = document.querySelector('#' + uniqueId);
            if (!style) {
                style = document.createElement('style');
                style.id = uniqueId;
                document.head.appendChild(style);
                style.innerHTML = "[data-selectum-list-hiddable]>[data-selectum-hidden-unless]{display:none}";
            }
        }
    };

    Selectum.prototype._setDOMElements = function(){
        this.DOMElements = {};
        this.DOMElements.currentFilter = this.el.querySelector('[data-selectum-current]');
        this.DOMElements.currentClickable = this.el.querySelector('[data-selectum-clickable]') === null ? this.el : this.el.querySelector('[data-selectum-clickable]');
        this.DOMElements.resetButton = this.el.querySelector('[data-selectum-reset]');
        this.DOMElements.currentList = this.el.querySelector('[data-selectum-list]');
        this.DOMElements.currentListElement = this.el.querySelectorAll('[data-selectum-id]');
    };

    Selectum.prototype._createResetModelEvent = function() {
        if (this.options.emit) {
            Selectum.event[this.options.emit] = document.createEvent('Event');
            if (typeof Selectum.event[this.options.emit].initEvent === 'function') {
                Selectum.event[this.options.emit].initEvent(this.options.emit, true, true);
            } else if (typeof Selectum.event[this.options.emit].initCustomEvent === 'function') {
                Selectum.event.initCustomEvent(this.options.emit, true, true, null);
            }
        }
    };

    Selectum.prototype._createResetEvent = function() {
        if (this.options.emitReset) {
            Selectum.event[this.options.emitReset] = document.createEvent('Event');
            if (typeof Selectum.event[this.options.emitReset].initEvent === 'function') {
                Selectum.event[this.options.emitReset].initEvent(this.options.emitReset, true, true);
            } else if (typeof Selectum.event[this.options.emitReset].initCustomEvent === 'function') {
                Selectum.event.initCustomEvent(this.options.emitReset, true, true, null);
            }
        }
    };

    Selectum.prototype._initEvents = function(){
        if (!this.options.inited) {
            this._createResetModelEvent();
            this._createResetEvent();
            this._clearCurrentOnExtraPick();
            this._resetIfDependent();
        }
        if (this.el.querySelector('[data-selectum-clickable]') !== null) {
            this._toggleDropdown();
        } else {
            if (!this.options.inited) {
                this._toggleDropdown();
            }
        }
        this._initResetButton();
        this._onOptionClick();
    };

    Selectum.prototype.on = function(funcName, handler) {
        this.options.callbacks[funcName].push(handler);
    }

    Selectum.prototype.off = function(funcName) {
        delete this.options.callbacks[funcName];
    }

    Selectum.prototype._initResetButton = function() {
        var _this = this;
        if (_this.DOMElements.resetButton) {
            _this.DOMElements.resetButton.addEventListener('click',function(e){
                e.stopPropagation();
                _this.DOMElements.currentFilter.textContent = '';
                _this.DOMElements.currentList.classList.remove('js-open');
                _this._toggleArrows();
                _this.DOMElements.currentFilter.classList.add('js-raw');
                _this._setDefaultPlaceholder();
                _this._setSelected(null);
                _this._setActive();
                _this._emitResetEvent();
                Selectum.urlUpdater(_this.el.dataset.selectum, '');
                callCallback(_this, 'reset');
            });
        }
    };

    Selectum.prototype._clearCurrentOnExtraPick = function() {
        var _this = this;
        if (_this.options.listen) {
            document.addEventListener(_this.options.listen,function(){
                if (!_this.DOMElements.currentFilter.classList.contains('js-raw')) {
                    _this.DOMElements.currentFilter.textContent = '';
                    _this.DOMElements.currentFilter.classList.add('js-raw');
                    _this._setDefaultPlaceholder();
                    Selectum.urlUpdater(_this.el.dataset.selectum, '');
                    callCallback(_this, 'reset');
                }
                if (_this.options.picked) {
                    _this.options.picked = false;
                    _this.el.classList.remove('js-disabled');
                    _this.DOMElements.currentFilter.classList.remove('i-arrow-bottom-disabled_after');
                    _this.DOMElements.currentFilter.classList.add('i-arrow-bottom_after');
                    if (_this.options.selected) {
                        _this.DOMElements.currentFilter.classList.remove('js-raw');
                    }
                }
            });
        }
    }

    Selectum.prototype._resetIfDependent = function() {
        var _this = this;
        if (_this.options.listenReset && _this.options.picked) {
            document.addEventListener(_this.options.listenReset,function(){
                _this.options.picked = true;
                _this.options.selected = null;
                _this.el.classList.add('js-disabled');
                _this.DOMElements.currentFilter.textContent = '';
                _this.DOMElements.currentFilter.classList.add('js-raw', 'i-arrow-bottom-disabled_after');
                _this.DOMElements.currentFilter.classList.remove('i-arrow-bottom_after');
                _this._setDefaultPlaceholder();
                Selectum.urlUpdater(_this.el.dataset.selectum, '');
                callCallback(_this, 'reset:picked');
            });
        }
    }

    Selectum.prototype._toggleArrows = function() {
        if (this.DOMElements.currentFilter.classList.contains('i-arrow-bottom_after') || this.DOMElements.currentFilter.classList.contains('i-arrow-bottom-disabled_after')) {
            this.DOMElements.currentFilter.classList.remove('i-arrow-bottom_after', 'i-arrow-bottom-disabled_after');
            this.DOMElements.currentFilter.classList.add('i-arrow-top_after');
            this.el.classList.add('js-open');
        } else {
            this.DOMElements.currentFilter.classList.remove('i-arrow-top_after');
            this.DOMElements.currentFilter.classList.add('i-arrow-bottom_after');
            this.el.classList.remove('js-open');
        }
    }

    Selectum.prototype._toggleDropdown = function(){
        var _this = this;
        _this.DOMElements.currentClickable.addEventListener('click', function(){
            if (!_this.options.picked) {
                callCallback(_this, 'before:open');
                _this.DOMElements.currentList.classList.toggle('js-open');
                _this._toggleArrows();
                callCallback(_this, 'open');
            }
        });
    };

    Selectum.prototype._onOptionClick = function() {
        var _this = this;
        [].slice.call( _this.DOMElements.currentListElement ).forEach( function(el) {
            el.addEventListener('click', function(e){
                e.stopPropagation();
                callCallback(_this, 'before:select');
                _this.DOMElements.currentList.classList.remove('js-open');
                _this.DOMElements.currentFilter.classList.remove('js-raw');
                _this._toggleArrows();
                _this.DOMElements.currentFilter.textContent = e.target.dataset.selectumVal;
                _this._setSelected(e.target.dataset.selectumId);
                _this._setActive();
                _this._removeDisabled();
                _this._showSubsets(e.target.dataset.selectumId);
                _this._updateUrl();
                _this._emitEvent();
                callCallback(_this, 'select');
            });
        });
    };

    Selectum.prototype._updateUrl = function() {
        if (this.options.updateUrl) {
            var url = location.search !== '' ? '&' : '?';
            url += this.el.dataset.selectum + '=' + this.options.selected;
            Selectum.urlUpdater(this.el.dataset.selectum, this.options.selected);
            callCallback(this, 'url:update');
        }
    }

    Selectum.prototype._removeDisabled = function() {
        this.el.removeAttribute('disabled');
    }

    Selectum.prototype._showSubsets = function(param) {
        if (this.options.picker) {
            Selectum._showProperSubsets.bind(this, param)();
        }
    };

    Selectum.prototype._setSelected = function(param) {
        this.options.selected = param;
    };

    Selectum.prototype._emitEvent = function() {
        if (this.options.emit) {
            document.dispatchEvent(Selectum.event[this.options.emit]);
        }
    };

    Selectum.prototype._emitResetEvent = function() {
        if (this.options.emitReset) {
            document.dispatchEvent(Selectum.event[this.options.emitReset]);
        }
    };

    Selectum.prototype._setActive = function(){
        var currentText = this.DOMElements.currentFilter.textContent;
        [].slice.call( this.DOMElements.currentListElement ).forEach( function(el) {
            if (el.dataset.selectumVal === currentText) {
                el.classList.add('js-current');
            } else {
                el.classList.remove('js-current');
            }
        });
    };

    Selectum.prototype._setFromSearchParams = function() {
        if (this.options.urlFetch) {
            var data = location.search;
            var type = this.el.dataset.selectum;
            if (data.length > 0) {
                var reg = /(\w+)=([\w\.\|]+)/gi;
                data = data.slice(1, data.length).split('&');
                data = data.reduce(function(prev, curr){
                    var found = reg.exec(curr);
                    prev[found[1]] = found[2];
                    reg.lastIndex = null;
                    return prev;
                }, {});
                if (data.hasOwnProperty(type)) {
                    if (!this.options.picked) {
                        this.DOMElements.currentFilter.classList.remove('js-raw');
                    }
                    this.DOMElements.currentFilter.textContent = this.el.querySelector("[data-selectum-id='" + data[type] + "']").dataset.selectumVal;
                    this._setSelected(data[type]);
                    this._setActive();
                    this._removeDisabled();
                    this._showSubsets(data[type]);
                    setTimeout(this._emitEvent.bind(this),0);
                    callCallback(this, 'init:url');
                }
            }
        }
    };

    window.Selectum = Selectum;

})(window);
//var select = null;
//[].slice.call( document.querySelectorAll('[data-selectum]') ).forEach( function(el) {
//    select = new Selectum(el);
//});
//
//window.setTimeout(function() {
//    select.render({
//        head: select.options.head || 'Any other head', // Optional
//        items: [
//            {id : 0, val : 'apple'},
//            {id : 1, val : 'banana'},
//            {id : 2, val : 'tangerin'}
//        ]
//    })
//}, 3000);
//
//window.setTimeout(function() {
//    select.render({
//        head: select.options.head || 'Any other head', // Optional
//        items: [
//            {id : 0, val : 'some'},
//            {id : 1, val : 'other'},
//            {id : 2, val : 'array'}
//        ]
//    })
//}, 7000);