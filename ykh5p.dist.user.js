'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ==UserScript==
// @name         ykh5p
// @namespace    https://github.com/gooyie/ykh5p
// @homepageURL  https://github.com/gooyie/ykh5p
// @supportURL   https://github.com/gooyie/ykh5p/issues
// @updateURL    https://raw.githubusercontent.com/gooyie/ykh5p/master/ykh5p.user.js
// @version      0.2.0
// @description  youku html5 player +
// @author       gooyie
// @license      MIT License
//
// @include      *://v.youku.com/*
// @grant        GM_info
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    /* eslint-disable no-console */

    var Logger = function () {
        function Logger() {
            _classCallCheck(this, Logger);
        }

        _createClass(Logger, null, [{
            key: 'log',
            value: function log() {
                var _console;

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                (_console = console).log.apply(_console, ['%c' + this.tag + '%c' + args.shift(), 'color: #fff; background: #2FB3FF', ''].concat(args));
            }
        }, {
            key: 'info',
            value: function info() {
                var _console2;

                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                (_console2 = console).info.apply(_console2, [this.tag + args.shift()].concat(args));
            }
        }, {
            key: 'debug',
            value: function debug() {
                var _console3;

                for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    args[_key3] = arguments[_key3];
                }

                (_console3 = console).debug.apply(_console3, [this.tag + args.shift()].concat(args));
            }
        }, {
            key: 'warn',
            value: function warn() {
                var _console4;

                for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                    args[_key4] = arguments[_key4];
                }

                (_console4 = console).warn.apply(_console4, [this.tag + args.shift()].concat(args));
            }
        }, {
            key: 'error',
            value: function error() {
                var _console5;

                for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                    args[_key5] = arguments[_key5];
                }

                (_console5 = console).error.apply(_console5, [this.tag + args.shift()].concat(args));
            }
        }, {
            key: 'tag',
            get: function get() {
                return '[' + GM_info.script.name + ']';
            }
        }]);

        return Logger;
    }();
    /* eslint-enable no-console */

    var Hooker = function () {
        function Hooker() {
            _classCallCheck(this, Hooker);
        }

        _createClass(Hooker, null, [{
            key: 'hookCall',
            value: function hookCall() {
                var after = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
                var before = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

                var call = Function.prototype.call;
                Function.prototype.call = function () {
                    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                        args[_key6] = arguments[_key6];
                    }

                    try {
                        if (args) before.apply(undefined, args);
                    } catch (err) {
                        Logger.error(err.stack);
                    }

                    var ret = call.apply(this, args);

                    try {
                        if (args) after.apply(undefined, args);
                    } catch (err) {
                        Logger.error(err.stack);
                    }

                    return ret;
                };

                Function.prototype.call.toString = Function.prototype.call.toLocaleString = function () {
                    return 'function call() { [native code] }';
                };
            }
        }, {
            key: '_isFactoryCall',
            value: function _isFactoryCall(args) {
                // m.exports, _dereq_, m, m.exports, outer, modules, cache, entry
                return args.length === 8 && args[2] instanceof Object && args[2].hasOwnProperty('exports');
            }
        }, {
            key: 'hookFactoryCall',
            value: function hookFactoryCall() {
                var _this = this;

                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookCall(function () {
                    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                        args[_key7] = arguments[_key7];
                    }

                    if (_this._isFactoryCall(args)) cb.apply(undefined, args);
                });
            }
        }, {
            key: '_isManagerFactoryCall',
            value: function _isManagerFactoryCall() {
                var exports = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return 'function' === typeof exports && exports.prototype.hasOwnProperty('upsDataSuccess');
            }
        }, {
            key: 'hookManager',
            value: function hookManager() {
                var _this2 = this;

                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookFactoryCall(function () {
                    for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
                        args[_key8] = arguments[_key8];
                    }

                    if (_this2._isManagerFactoryCall(args[2].exports)) cb(args[2].exports);
                });
            }
        }, {
            key: 'hookUpsDataSuccess',
            value: function hookUpsDataSuccess() {
                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookManager(function (exports) {
                    var upsDataSuccess = exports.prototype.upsDataSuccess;
                    exports.prototype.upsDataSuccess = function (data) {
                        cb(data);
                        upsDataSuccess.apply(this, [data]);
                    };
                });
            }
        }, {
            key: '_isSkinsViewRenderCall',
            value: function _isSkinsViewRenderCall(args) {
                return args.length === 3 && args[1] === 'spvdiv' && args[2].className === 'spv_player';
            }
        }, {
            key: 'hookSkinsViewRender',
            value: function hookSkinsViewRender() {
                var _this3 = this;

                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookCall(undefined, function () {
                    for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
                        args[_key9] = arguments[_key9];
                    }

                    if (_this3._isSkinsViewRenderCall(args)) cb(args[2]);
                });
            }
        }, {
            key: '_isUtilFactoryCall',
            value: function _isUtilFactoryCall() {
                var exports = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return exports.hasOwnProperty('getJsonp') && exports.TAG === 'util';
            }
        }, {
            key: 'hookUtil',
            value: function hookUtil() {
                var _this4 = this;

                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookFactoryCall(function () {
                    for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
                        args[_key10] = arguments[_key10];
                    }

                    if (_this4._isUtilFactoryCall(args[2].exports)) cb(args[2].exports);
                });
            }
        }, {
            key: 'hookGetJsonp',
            value: function hookGetJsonp() {
                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookUtil(function (exports) {
                    var getJsonp = exports.getJsonp.bind(exports);
                    exports.getJsonp = function () {
                        for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
                            args[_key11] = arguments[_key11];
                        }

                        // url, onload, onerror, ontimeout, timeout
                        if (cb(args)) return; // hijack
                        getJsonp.apply(undefined, args);
                    };
                });
            }
        }, {
            key: '_isH5PlayerCoreFactoryCall',
            value: function _isH5PlayerCoreFactoryCall() {
                var exports = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return exports instanceof Object && exports.hasOwnProperty('YoukuH5PlayerCore');
            }
        }, {
            key: 'hookH5PlayerCore',
            value: function hookH5PlayerCore() {
                var _this5 = this;

                var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                this.hookFactoryCall(function () {
                    for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
                        args[_key12] = arguments[_key12];
                    }

                    if (_this5._isH5PlayerCoreFactoryCall(args[2].exports)) cb(args[2].exports);
                });
            }
        }]);

        return Hooker;
    }();

    var Mocker = function () {
        function Mocker() {
            _classCallCheck(this, Mocker);
        }

        _createClass(Mocker, null, [{
            key: 'mockVip',
            value: function mockVip() {
                Hooker.hookUpsDataSuccess(function (data) {
                    if (data.user) {
                        data.user.vip = true;
                    } else {
                        data.user = { vip: true };
                    }
                });
            }
        }]);

        return Mocker;
    }();

    var Blocker = function () {
        function Blocker() {
            _classCallCheck(this, Blocker);
        }

        _createClass(Blocker, null, [{
            key: '_isAdReq',
            value: function _isAdReq(url) {
                return (/atm\.youku\.com/.test(url)
                );
            }
        }, {
            key: 'blockAd',
            value: function blockAd() {
                var _this6 = this;

                Hooker.hookGetJsonp(function (args) {
                    var _args = _slicedToArray(args, 3),
                        url = _args[0],
                        /* onload */onerror = _args[2];

                    if (_this6._isAdReq(url)) {
                        setTimeout(onerror, 0); // async invoke
                        Logger.log('blocked ad request', url);
                        return true;
                    }
                });
            }
        }]);

        return Blocker;
    }();

    var Patcher = function () {
        function Patcher() {
            _classCallCheck(this, Patcher);
        }

        _createClass(Patcher, null, [{
            key: 'patchQualitySetting',
            value: function patchQualitySetting() {
                Hooker.hookSkinsViewRender(function (elem) {
                    var autoRe = /<spvdiv\s+customer="auto"[^<>]*>自动<\/spvdiv>/;
                    var mp4Re = /<spvdiv\s+customer="mp4"[^<>]*>标清<\/spvdiv>/;
                    var autoDiv = autoRe.exec(elem.innerHTML)[0];
                    var hd3Div = autoDiv.replace('auto', 'mp4hd3').replace('自动', '1080P');
                    elem.innerHTML = elem.innerHTML.replace(autoRe, hd3Div).replace(mp4Re, '$&' + autoDiv);
                });

                GM_addStyle('\n                spvdiv.spv_setting_1080, spvdiv.spv_setting_panel {\n                    width: 300px !important;\n                }\n            ');
            }
        }, {
            key: 'patchQualityFallback',
            value: function patchQualityFallback() {
                Hooker.hookH5PlayerCore(function (exports) {
                    exports.YoukuH5PlayerCore.prototype._initControlInfo = function () {
                        if (!this._videoInfo.langcodes) return;

                        var control = this.control;
                        if (!control.lang || !this._videoInfo.langcodes.includes(control.lang)) {
                            control.lang = this._videoInfo.langcodes[0];
                        }

                        var hdcodes = this._videoInfo.hdList[control.lang].hdcodes;
                        if (!hdcodes.includes(control.hd)) {
                            // 如果设置的优先画质在当前播放的视频里没有
                            control.hd = hdcodes[hdcodes.length - 1]; // 向下选择最高画质（原逻辑是给最渣画质！）
                        }

                        control.autoplay = control.autoplay || false;
                        control.fullscreen = control.fullscreen || false;
                    };
                });
            }
        }]);

        return Patcher;
    }();

    function enableH5Player() {
        sessionStorage.setItem('P_l_h5', 1);
    }

    //=============================================================================

    enableH5Player();

    Blocker.blockAd();
    Mocker.mockVip();
    Patcher.patchQualitySetting();
    Patcher.patchQualityFallback();
})();
