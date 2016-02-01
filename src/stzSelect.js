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

    function StzSelect( el, options ) {
        this.el = el;
        this.options = StzSelect.extend( this.options, {
            picker: this.el.dataset.hasOwnProperty('stzSelectPicker'),
            picked: this.el.dataset.hasOwnProperty('stzSelectPicked'),
            emit: this.el.dataset.hasOwnProperty('stzSelectEmit') ? this.el.dataset.stzSelectEmit : false,
            emitReset: this.el.dataset.hasOwnProperty('stzSelectEmitReset') ? this.el.dataset.stzSelectEmitReset : false,
            listen: this.el.dataset.hasOwnProperty('stzSelectListen') ? this.el.dataset.stzSelectListen : false,
            listenReset: this.el.dataset.hasOwnProperty('stzSelectListenReset') ? this.el.dataset.stzSelectListenReset : false,
            defaultText: this.el.dataset.hasOwnProperty('stzSelectPlaceholder') ? this.el.dataset.stzSelectPlaceholder : '',
            updateUrl: this.el.dataset.hasOwnProperty('stzSelectUpdateUrl'),
        });
        StzSelect.extend( this.options, options );
        this._init();
    }

    StzSelect.event = {};

    StzSelect.extend = function(a,b) {
        for( var key in b ) {
            if( b.hasOwnProperty( key ) ) {
                a[key] = b[key];
            }
        }
        return a;
    };

    StzSelect.urlUpdater = function(key, value) {
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

    StzSelect._showProperSubsets = function(param) {
        var style = document.querySelector('#czd-hiding-styles');
        if (!style) {
            style = document.createElement('style');
            style.id = 'czd-hiding-styles';
            document.head.appendChild(style);
        }
        style.innerHTML = "[data-stz-select-list-hiddable]>[data-stz-select-hidden-unless='" + param+ "']{display:block}";
    }

    StzSelect.prototype._setDocumentExternalClose = function() {
        var _this = this;
        document.addEventListener('click', function(e){
            if (!(e.target.closest('[data-stz-select]'))) {
                if (_this.DOMElements.currentList.classList.contains('js-open')) {
                    _this.DOMElements.currentList.classList.remove('js-open');
                    _this._toggleArrows();
                }
            }
        });
    };

    StzSelect.prototype.options = {
        selected: null,
        picker: false,
        picked: false,
        emit: false,
        emitReset: false,
        listen: false,
        listenReset: false,
        defaultText: '',
        updateUrl: false,
        scrollToHash: true,
        callbacks: {}
    };

    StzSelect.prototype._init = function(){
        this._setDOMElements();
        this._initEvents();
        this._setActive();
        this._disabledIfDependent();
        this._setDocumentExternalClose();
        this._setDefaultPlaceholder();
        this._setFromSearchParams();
    };

    StzSelect.prototype._setDefaultPlaceholder = function() {
        this.DOMElements.currentFilter.textContent = this.options.defaultText;
    };

    StzSelect.prototype._disabledIfDependent = function() {
        if (this.options.picked) {
            this.el.classList.add('js-disabled');
        }
    };

    StzSelect.prototype._setDOMElements = function(){
        this.DOMElements = {};
        this.DOMElements.currentFilter = this.el.querySelector('[data-stz-select-current]');
        this.DOMElements.currentClickable = this.el.querySelector('[data-stz-select-clickable]') === null ? this.el : this.el.querySelector('[data-stz-select-clickable]');
        this.DOMElements.resetButton = this.el.querySelector('[data-stz-select-reset]');
        this.DOMElements.currentList = this.el.querySelector('[data-stz-select-list]');
        this.DOMElements.currentListElement = this.el.querySelectorAll('[data-stz-select-li]');
    };

    StzSelect.prototype._createResetModelEvent = function() {
        if (this.options.emit) {
            StzSelect.event[this.options.emit] = document.createEvent('Event');
            if (typeof StzSelect.event[this.options.emit].initEvent === 'function') {
                StzSelect.event[this.options.emit].initEvent(this.options.emit, true, true);
            } else if (typeof StzSelect.event[this.options.emit].initCustomEvent === 'function') {
                StzSelect.event.initCustomEvent(this.options.emit, true, true, null);
            }
        }
    };

    StzSelect.prototype._createResetEvent = function() {
        if (this.options.emitReset) {
            StzSelect.event[this.options.emitReset] = document.createEvent('Event');
            if (typeof StzSelect.event[this.options.emitReset].initEvent === 'function') {
                StzSelect.event[this.options.emitReset].initEvent(this.options.emitReset, true, true);
            } else if (typeof StzSelect.event[this.options.emitReset].initCustomEvent === 'function') {
                StzSelect.event.initCustomEvent(this.options.emitReset, true, true, null);
            }
        }
    };

    StzSelect.prototype._initEvents = function(){
        this._toggleDropdown();
        this._onOptionClick();
        this._createResetModelEvent();
        this._createResetEvent();
        this._clearCurrentOnExtraPick();
        this._resetIfDependent();
        this._initResetButton();
    };

    StzSelect.prototype.onChange = function(funcName, handler) {
        this.options.callbacks[funcName].push(handler);
    }

    StzSelect.prototype._initResetButton = function() {
        var _this = this;
        if (_this.DOMElements.resetButton) {
            _this.DOMElements.resetButton.addEventListener('click',function(){
                _this.DOMElements.currentFilter.textContent = '';
                _this.DOMElements.currentList.classList.remove('js-open');
                _this._toggleArrows();
                _this.DOMElements.currentFilter.classList.add('js-raw');
                _this._setDefaultPlaceholder();
                _this._setSelected(null);
                _this._setActive();
                _this._emitResetEvent();
                StzSelect.urlUpdater(_this.el.dataset.stzSelect, '');
                callCallback(this, 'reset');
            });
        }
    };

    StzSelect.prototype._clearCurrentOnExtraPick = function() {
        var _this = this;
        if (_this.options.listen) {
            document.addEventListener(_this.options.listen,function(){
                if (!_this.DOMElements.currentFilter.classList.contains('js-raw')) {
                    _this.DOMElements.currentFilter.textContent = '';
                    _this.DOMElements.currentFilter.classList.add('js-raw');
                    _this._setDefaultPlaceholder();
                    StzSelect.urlUpdater(_this.el.dataset.stzSelect, '');
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

    StzSelect.prototype._resetIfDependent = function() {
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
                StzSelect.urlUpdater(_this.el.dataset.stzSelect, '');
            });
        }
    }

    StzSelect.prototype._toggleArrows = function() {
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

    StzSelect.prototype._toggleDropdown = function(){
        var _this = this;
        _this.DOMElements.currentClickable.addEventListener('click', function(){
            if (!_this.options.picked) {
                _this.DOMElements.currentList.classList.toggle('js-open');
                _this._toggleArrows();
            }
        });
    };

    StzSelect.prototype._onOptionClick = function() {
        var _this = this;
        [].slice.call( _this.DOMElements.currentListElement ).forEach( function(el) {
            el.addEventListener('click', function(e){
                e.stopPropagation();
                _this.DOMElements.currentList.classList.remove('js-open');
                _this.DOMElements.currentFilter.classList.remove('js-raw');
                _this._toggleArrows();
                _this.DOMElements.currentFilter.textContent = e.target.dataset.stzSelectVal;
                _this._setSelected(e.target.dataset.stzSelectId);
                _this._setActive();
                _this._removeDisabled();
                _this._showSubsets(e.target.dataset.stzSelectId);
                _this._updateUrl();
                _this._emitEvent();
                callCallback(this, 'click');
            });
        });
    };

    StzSelect.prototype._updateUrl = function() {
        if (this.options.updateUrl) {
            var url = location.search !== '' ? '&' : '?';
            url += this.el.dataset.stzSelect + '=' + this.options.selected;
            StzSelect.urlUpdater(this.el.dataset.stzSelect, this.options.selected);
        }
    }

    StzSelect.prototype._removeDisabled = function() {
        this.el.removeAttribute('disabled');
    }

    StzSelect.prototype._showSubsets = function(param) {
        if (this.options.picker) {
            StzSelect._showProperSubsets(param);
        }
    };

    StzSelect.prototype._setSelected = function(param) {
        this.options.selected = param;
    };

    StzSelect.prototype._emitEvent = function() {
        if (this.options.emit) {
            document.dispatchEvent(StzSelect.event[this.options.emit]);
        }
    };

    StzSelect.prototype._emitResetEvent = function() {
        if (this.options.emitReset) {
            document.dispatchEvent(StzSelect.event[this.options.emitReset]);
        }
    };

    StzSelect.prototype._setActive = function(){
        var currentText = this.DOMElements.currentFilter.textContent;
        [].slice.call( this.DOMElements.currentListElement ).forEach( function(el) {
            if (el.dataset.stzSelectVal === currentText) {
                el.classList.add('js-current');
            } else {
                el.classList.remove('js-current');
            }
        });
    };

    StzSelect.prototype._setFromSearchParams = function() {
        var data = location.search;
        var type = this.el.dataset.stzSelect;
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
                this.DOMElements.currentFilter.textContent = this.el.querySelector("[data-stz-select-id='" + data[type] + "']").dataset.stzSelectVal;
                this._setSelected(data[type]);
                this._setActive();
                this._removeDisabled();
                this._showSubsets(data[type]);
                setTimeout(this._emitEvent.bind(this),0);
                callCallback(this, 'init:url');
            }
        }
    };

    window.StzSelect = StzSelect;

})(window);

document.addEventListener('DOMContentLoaded', function(){
    [].slice.call( document.querySelectorAll('[data-stz-select]') ).forEach( function(el) {
        new StzSelect(el);
    });
});