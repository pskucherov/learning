(function (namespace) {
    'use strict';

    if (typeof namespace.ya === 'undefined') {
        namespace.ya = {};
    }
    if (typeof namespace.ya.speechkit === 'undefined') {
        namespace.ya.speechkit = {};
    }
    /**
     * Global settings for speechkit
     * @memberof ya.speechkit
     * @property {String} websocketProtocol - Which protocol to use (wss:// or ws://)
     * @property {String} asrUrl - Url of asr websocket
     * @property {String} ttsUrl - Url of tts server
     * @property {String} lang - Default language for recognition
     * @property {String} model - Default model for recognition
     * @property {String} apiKey - Developer's API key {@link http://ya.ru}
     * @property {String} uuid - Pregenerated uuid of asr session
     * @see https://developer.tech.yandex.ru/
     */
    var settings = {
        websocketProtocol: 'wss://',
        asrUrl: 'webasr.yandex.net/asrsocket.ws',
        spotterUrl: 'webasr.yandex.net/spottersocket.ws',
        ttsUrl: 'https://tts.voicetech.yandex.net',
        ttsStreamUrl: 'webasr.yandex.net/ttssocket.ws',
        lang: 'ru-RU',
        lang_whitelist: ['ru-RU', 'tr-TR', 'en-EN'],
        model: 'freeform',
        applicationName: 'local',
        apiKey: '',
        uuid: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
            /[xy]/g,
            function (c) {
                var r = Math.random() * 16 | 0;
                var v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            }
        ),
    };

    if (typeof namespace.ya.speechkit._extend === 'undefined') {
        namespace.ya.speechkit.settings = settings;
    } else {
        namespace.ya.speechkit.settings = namespace.ya.speechkit._extend(settings, namespace.ya.speechkit.settings);
    }
})(this);



(function (namespace) {
    'use strict';

    /**
     * Пространство имен для классов и методов библиотеки Yandex.Speechkit JS
     * @namespace ya.speechkit
     */
    if (typeof namespace.ya === 'undefined') {
        namespace.ya = {};
    }
    if (typeof namespace.ya.speechkit === 'undefined') {
        namespace.ya.speechkit = {};
    }

    namespace.ya.speechkit.AudioContext = window.AudioContext || window.webkitAudioContext;

    if (typeof namespace.ya.speechkit.settings === 'undefined') {
        var js = document.createElement('script');

        js.type = 'text/javascript';
        js.src = 'https://download.yandex.ru/webspeechkit/webspeechkit-settings.js?seed=' + Math.random();

        document.head.appendChild(js);
    }

    /** Набор поддерживаемых форматов аудио.
     * @readonly
     * @enum
     * @memberof ya.speechkit
     */
    namespace.ya.speechkit.FORMAT = {
        /** PCM 8KHz дает плохое качество распознавания, но малый объем передаваемых на сервер данных */
        PCM8: {format: 'pcm', sampleRate: 8000, mime: 'audio/x-pcm;bit=16;rate=8000', bufferSize: 1024},
        /** PCM 16 KHz наилучшее качество распознавания при среднем объеме данных */
        PCM16: {format: 'pcm', sampleRate: 16000, mime: 'audio/x-pcm;bit=16;rate=16000', bufferSize: 2048},
        /** PCM 44 KHz большой размер передаваемых данных, возможны задержки на узком канале */
        PCM44: {format: 'pcm', sampleRate: 44100, mime: 'audio/x-pcm;bit=16;rate=44100', bufferSize: 4096},
    };

    /** Media stream used by SpeechKit
     * @private
     * @memberof ya.speechkit
     */
    namespace.ya.speechkit._stream = null;

    /**
     * Deep copies fileds from object 'from' to object 'to'
     * @param {Object} from Source object
     * @param {Object} to Destination object
     * @private
     */
    namespace.ya.speechkit._extend = function (to, from) {
        var i;
        var toStr = Object.prototype.toString;
        var astr = '[object Array]';
        to = to || {};

        for (i in from) {
            if (from.hasOwnProperty(i)) {
                if (typeof from[i] === 'object') {
                    to[i] = (toStr.call(from[i]) === astr) ? [] : {};
                    namespace.ya.speechkit._extend(to[i], from[i]);
                } else if (typeof from[i] !== 'undefined' || typeof to[i] === 'undefined') {
                    to[i] = from[i];
                }
            }
        }
        return to;
    };

    /**
     * Создает объект для записи аудио-сигнала с микрофона.
     * @class Класс, управляющий записью звука с микрофона.
     * @name Recorder
     */
    var Recorder = function ()
    {
        if (!namespace.ya.speechkit._stream) {
            return null;
        }

        if (!(this instanceof Recorder)) {
            return new Recorder();
        }

        this.worker = namespace.ya.speechkit.newWorker();

        this.recording = false;

        this.paused = false;
        this.lastDataOnPause = 0;

        this.nullsArray = [];

        this.currCallback = null;
        this.buffCallback = null;
        this.startCallback = null;

        this.worker.onmessage = function (e) {
            if (e.data.command == 'int16stream')
            {
                var data = e.data.buffer;

                if (this.startCallback) {
                    this.startCallback(data);
                }
            } else if (e.data.command == 'getBuffers' && this.buffCallback) {
                this.buffCallback(e.data.blob);
            } else if (e.data.command == 'clear' && this.currCallback) {
                this.currCallback();
            } else if (this.currCallback) {
                this.currCallback(e.data.blob);
            }
        }.bind(this);

    };

    Recorder.prototype = /** @lends Recorder.prototype */ {
        /**
         * Creates an input point for a given audio format (sets samplerate and buffer size
         * @param {ya.speechkit.FORMAT} format audio format (it's samplerate and bufferSize are being used)
         * @private
         */
        _createNode: function (format) {
            if (!namespace.ya.speechkit.audiocontext) {
                namespace.ya.speechkit.audiocontext = new namespace.ya.speechkit.AudioContext();
            }

            this.audioInput = namespace.ya.speechkit.audiocontext.createMediaStreamSource(
                namespace.ya.speechkit._stream);

            if (!namespace.ya.speechkit.audiocontext.createScriptProcessor) {
                this.node = namespace.ya.speechkit.audiocontext.createJavaScriptNode(format.bufferSize, 2, 2);
            } else {
                this.node = namespace.ya.speechkit.audiocontext.createScriptProcessor(format.bufferSize, 2, 2);
            }

            this.audioInput.connect(this.node);
            this.node.onaudioprocess = function (e) {
                if (!this.recording) {return;}

                if (this.paused) {
                    if (Number(new Date()) - this.lastDataOnPause > 2000) {
                        this.lastDataOnPause = Number(new Date());
                        this.worker.postMessage({
                            command: 'record',
                            buffer: [
                                this.nullsArray,
                                this.nullsArray
                            ]
                        });
                    }
                } else {
                    this.worker.postMessage({
                        command: 'record',
                        buffer: [
                            e.inputBuffer.getChannelData(0),
                            e.inputBuffer.getChannelData(1)
                        ]
                    });
                }
            }.bind(this);

            this.node.connect(namespace.ya.speechkit.audiocontext.destination);
        },
        /**
         * Ставит запись звука на паузу.
         * Во время паузы на сервер будут отправляться периодически запросы с пустым звуком, чтобы сервер не обрывал сессию.
         */
        pause: function () {
            this.paused = true;
            this.lastDataOnPause = Number(new Date());
        },
        /**
         * @returns {AudioContext} Текущий <xref scope="external" locale="ru" href="https://developer.mozilla.org/ru/docs/Web/API/AudioContext">
         * AudioContext</xref><xref scope="external" locale="en-com" href="https://developer.mozilla.org/en-US/docs/Web/API/AudioContext">AudioContext</xref>,
         * с которого записывается звук.
         */
        getAudioContext: function () {
            return namespace.ya.speechkit.audiocontext;
        },
        /**
         * @returns {AnalyserNode} <xref scope="external" locale="ru" href="https://developer.mozilla.org/ru/docs/Web/API/AnalyserNode">
         * AnalyserNode</xref><xref scope="external" locale="en-com" href="https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode">
         * AnalyserNode</xref> - объект, предназначенный для анализа аудио-сигнала в реальном времени.
         */
        getAnalyserNode: function () {
            if (!namespace.ya.speechkit.audiocontext) {
                namespace.ya.speechkit.audiocontext = new namespace.ya.speechkit.AudioContext();
            }
            var analyserNode = namespace.ya.speechkit.audiocontext.createAnalyser();
            analyserNode.fftSize = 2048;
            this.audioInput.connect(analyserNode);
            return analyserNode;
        },
        /**
         * @returns {Boolean} true, если запись звука стоит на паузе, false - в противном случае.
         */
        isPaused: function () {
            return this.paused;
        },
        /**
         * Начинает запись звука с микрофона.
         * @param {callback:streamCallback} cb Функция-обработчик, в которую будет передаваться записанный аудио-поток.
         * @param {ya.speechkit.FORMAT} [format=PCM16] Формат для записи аудио-сигнала. Доступные значения:
         * <ul>
         *     <li> PCM8 - плохое качество распознавания, но малый объем передаваемых на сервер данных;</li>
         *     <li> PCM16 - наилучшее качество распознавания при среднем объеме данных; </li>
         *     <li> PCM44 - большой размер передаваемых данных, возможны задержки на узком канале.</li>
         *</ul>
         */
        start: function (cb, format) {
            var backref = this;
            if (!namespace.ya.speechkit._stream) {
                return namespace.ya.speechkit.initRecorder(function () {backref.start(cb, format);}, console.log);
            }

            if (!this.node) {
                this._createNode(format);
            }

            if (this.isPaused()) {
                this.paused = false;
                return;
            }
            if (typeof cb !== 'undefined') {
                this.startCallback = cb;
            } else {
                this.startCallback = null;
            }
            this.worker.postMessage({
                command: 'init',
                config: {
                    sampleRate: namespace.ya.speechkit.audiocontext.sampleRate,
                    format: format || namespace.ya.speechkit.FORMAT.PCM16,
                    channels: this.channelCount,
                }
            });

            this.nullsArray = [];
            var bufferLen = (format || namespace.ya.speechkit.FORMAT.PCM16).bufferSize;
            for (var i = 0; i < bufferLen; i++) {
                this.nullsArray.push(0);
            }

            this.clear(function () {this.recording = true;}.bind(this));
        },
        /**
         * Останавливает запись звука.
         * @param {callback:wavCallback} cb Функция-обработчик, в которую будет передан BLOB с записанным аудио в формате wav.
         * @param {Number} [channelCount=2] Сколько каналов должно быть в wav-файле: 1 - mono, 2 - stereo.
         */
        stop: function (cb, channelCount) {
            this.recording = false;
            if (this.node) {
                this.node.disconnect();
            }

            this.node = null;

            if (namespace.ya.speechkit._stream &&
                typeof namespace.ya.speechkit._stream.stop !== 'undefined') {
                namespace.ya.speechkit._stream.stop();
            }
            namespace.ya.speechkit._stream = null;
            if (typeof namespace.ya.speechkit.audiocontext !== 'undefined' &&
                namespace.ya.speechkit.audiocontext !== null &&
                typeof namespace.ya.speechkit.audiocontext.close !== 'undefined') {
                namespace.ya.speechkit.audiocontext.close();
                namespace.ya.speechkit.audiocontext = null;
            }

            if (typeof cb !== 'undefined') {
                this.exportWAV(function (blob) {
                    cb(blob);
                }, channelCount || 2);
            }
        },
        /**
         * @returns {Boolean} true, если идет запись звука, false - если запись стоит в режиме паузы.
         */
        isRecording: function () {
            return this.recording;
        },
        /**
         * Очищает буферы с записанным аудио-сигналом.
         * @param {callback:clearCallback} cb Функция-обработчик, которая будет вызвана, когда произойдет очистка.
         */
        clear: function (cb) {
            if (typeof cb !== 'undefined') {
                this.currCallback = cb;
            } else {
                this.currCallback = null;
            }
            this.worker.postMessage({command: 'clear'});
        },
        /**
         * Метод для получения буферов с записанным аудио-сигналом.
         * @param {callback:buffersCallback} cb Функция, в которую будут переданы буферы с аудио-сигналом.
         */
        getBuffers: function (cb) {
            if (typeof cb !== 'undefined') {
                this.buffCallback = cb;
            } else {
                this.buffCallback = null;
            }
            this.worker.postMessage({command: 'getBuffers'});
        },
        /**
         * Экспортирует записанный звук в wav-файл.
         * @param {callback:wavCallback} cb Функция, в которую будет передан BLOB с файлом.
         * @param {Number} [channelCount=1] Количество каналов в wav-файле: 1 - mono, 2 - stereo.
         */
        exportWAV: function (cb, channelCount) {
            if (typeof cb !== 'undefined') {
                this.currCallback = cb;
            } else {
                this.currCallback = null;
            }
            var type = 'audio/wav';

            if (!this.currCallback) {throw new Error('Callback not set');}

            var exportCommand = 'export' + (channelCount != 2 && 'Mono' || '') + 'WAV';

            this.worker.postMessage({
                command: exportCommand,
                type: type
            });
        }
    };

    namespace.ya.speechkit.Recorder = Recorder;

    namespace.ya.speechkit.getUserMedia = navigator.getUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia ||
        navigator.webkitGetUserMedia;

    namespace.ya.speechkit.mediaDevices = (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ?
        navigator.mediaDevices :
        (namespace.ya.speechkit.getUserMedia ? {
            getUserMedia: function (c) {
                return new Promise(function (y, n) {
                    namespace.ya.speechkit.getUserMedia.call(navigator, c, y, n);
                });
            }
        } : null);

    namespace.ya.speechkit._stream = null;
    namespace.ya.speechkit.audiocontext = null;

    /**
     * Запрашивает у пользователя права для записи звука с микрофона.
     * @param {callback:initSuccessCallback} initSuccess Функция-обработчик, которая будет вызвана при успешном подключении к микрофону.
     * @param {callback:initFailCallback} initFail Функция-обработчик, в которую будет передано сообщения об ошибке, в случае неуспеха.
     */
    namespace.ya.speechkit.initRecorder = function (initSuccess, initFail)
    {
        var badInitialization = function (err) {
            namespace.ya.speechkit._stream = null;
            if (typeof initFail !== 'undefined') {
                initFail(err);
            }
        };

        if (namespace.ya.speechkit.mediaDevices)
        {
            namespace.ya.speechkit.mediaDevices.getUserMedia(
                {audio: true}).then(
                function (stream) {
                    namespace.ya.speechkit._stream = stream;
                    if (typeof initSuccess !== 'undefined') {
                        initSuccess();
                    }
                }).catch(
                function (err) {
                    badInitialization(err.message || err.name || err);
                });
        } else {
            badInitialization('Your browser doesn\'t support Web Audio API. ' +
                'Please, use Yandex.Browser: https://browser.yandex.ru');
        }
    };

    /**
     * Поддерживается ли рапознавание заданного языка.
     * @return true, если язык поддерживается, false - иначе.
     */
    namespace.ya.speechkit.isLanguageSupported = function (lang)
    {
        if (namespace.ya.speechkit.settings.lang_whitelist.indexOf(lang) >= 0) {
            return namespace.ya.speechkit.isSupported();
        } else {
            return namespace.ya.speechkit.isWebAudioSupported();
        }
    };

    /**
     * Поддерживаются ли технологии рапознавания Яндекса.
     * @return true, если поддерживаются, false - иначе.
     */
    namespace.ya.speechkit.isSupported = function ()
    {
        var userAgent = navigator.userAgent.toLowerCase();
        // Yandex recognition is 100% supported on mobile devices only in firefox
        return ((namespace.ya.speechkit.mediaDevices !== null) &&
        ((/mozilla|firefox/.test(userAgent) && !/yabrowser/.test(userAgent)) ||
        !/iphone|ipod|ipad|android|blackberry/.test(userAgent)));
    };

    /**
     * Поддерживается ли рапознавание с помощью WebAudio API.
     * @return true, если поддерживается, false - иначе.
     */
    namespace.ya.speechkit.isWebAudioSupported = function ()
    {
        var userAgent = navigator.userAgent.toLowerCase();
        // Native recognition is only supported in original chrome and chromium
        return (typeof namespace.webkitSpeechRecognition !== 'undefined' &&
        /chrome/.test(userAgent) && !/firefox|yabrowser|opera|opr/.test(userAgent));
    };


    /**
     * Функция, которая будет вызвана по факту успешного получения прав на доступ к микрофону.
     * @callback
     * @name initSuccessCallback
     * @memberof Recorder
     */

    /**
     * Функция-обработчик, которая будет вызвана при возникновении ошибки при получении доступа к микрофону.
     * @callback initFailCallback
     * @param {String} error Сообщение об ошибке.
     * @memberof Recorder
     */

    /**
     * Функция для BLOB с wav-файлом.
     * @callback
     * @name wavCallback
     * @param {Blob} data waf-файл.
     * @memberof Recorder
     */

    /**
     * Функция-обработчик, в которую будут переданы буферы записанного аудио.
     * @callback
     * @name buffersCallback
     * @param {Float32Array[]} buffers Буферы записанного аудио для двух каналов (моно и стерео).
     * @memberof Recorder
     */

    /**
     * Функция, которая будет вызвана после очистки буферов (это сигнал готовности к повторному запуску).
     * @callback
     * @name clearCallback
     * @memberof Recorder
     */

    /**
     * Функция-обработчик, в которую будет передаваться записанный аудио-поток.
     * @callback
     * @name streamCallback
     * @param {ArrayBuffer} stream Записанный PCM поток 16-bit.
     * @memberof Recorder
     */

}(this));
(function (namespace) {
    'use strict';

    if (typeof namespace.ya === 'undefined') {
        namespace.ya = {};
    }
    if (typeof namespace.ya.speechkit === 'undefined') {
        namespace.ya.speechkit = {};
    }

    function _makeWorker(script) {
        var URL = window.URL || window.webkitURL;
        var Blob = window.Blob;
        var Worker = window.Worker;

        if (!URL || !Blob || !Worker || !script) {
            return null;
        }

        var blob = new Blob([script], {type: 'application/javascript'});
        var worker = new Worker(URL.createObjectURL(blob));
        return worker;
    }

    var inline_worker =
        "function IIRFilter (sampleRate, cutoff, resonance, type) {" +
        "" +
        "    var	self	= this," +
        "            f	= [0.0, 0.0, 0.0, 0.0]," +
        "            freq, damp," +
        "            prevCut, prevReso," +
        "" +
        "            sin	= Math.sin," +
        "            min	= Math.min," +
        "            pow	= Math.pow;" +
        "" +
        "    self.cutoff = cutoff || 20000;" +
        "    self.resonance = resonance || 0.1;" +
        "    self.samplerate = sampleRate || 44100;" +
        "    self.type = type || 0;" +
        "" +
        "    function calcCoeff () {" +
        "            freq = 2 * sin(Math.PI * min(0.25, self.cutoff / (self.samplerate * 2)));" +
        "            damp = min(2 * (1 - pow(self.resonance, 0.25)), min(2, 2 / freq - freq * 0.5));" +
        "    }" +
        "" +
        "    self.pushSample = function (sample) {" +
        "            if (prevCut !== self.cutoff || prevReso !== self.resonance){" +
        "                    calcCoeff();" +
        "                    prevCut = self.cutoff;" +
        "                    prevReso = self.resonance;" +
        "            }" +
        "" +
        "            f[3] = sample - damp * f[2];" +
        "            f[0] = f[0] + freq * f[2];" +
        "            f[1] = f[3] - f[0];" +
        "            f[2] = freq * f[1] + f[2];" +
        "" +
        "            f[3] = sample - damp * f[2];" +
        "            f[0] = f[0] + freq * f[2];" +
        "            f[1] = f[3] - f[0];" +
        "            f[2] = freq * f[1] + f[2];" +
        "" +
        "            return f[self.type];" +
        "    };" +
        "" +
        "    self.getMix = function (type) {" +
        "            return f[type || self.type];" +
        "    };" +
        "}" +
        "" +
        "var speex_loaded = false;" +
        "var recLength = 0;" +
        "var recBuffersL = [];" +
        "var recBuffersR = [];" +
        "var sampleRate;" +
        "var outSampleRate;" +
        "var tmp_buf = 0;" +
        "var need_buf_size = 4096;" +
        "var speex_converter = null;" +
        "    " +
        "this.onmessage = function (e) {" +
        "    switch (e.data.command) {" +
        "    case 'init':" +
        "        init(e.data.config);" +
        "        break;" +
        "    case 'record':" +
        "        record(e.data.buffer);" +
        "        break;" +
        "    case 'exportWAV':" +
        "        exportWAV(e.data.type);" +
        "        break;" +
        "    case 'exportMonoWAV':" +
        "        exportMonoWAV(e.data.type);" +
        "        break;" +
        "    case 'getBuffers':" +
        "        getBuffers();" +
        "        break;" +
        "    case 'clear':" +
        "        clear();" +
        "        break;" +
        "    }" +
        "};" +
        "    " +
        "function init(config) {" +
        "    sampleRate = config.sampleRate;" +
        "    outSampleRate = config.format.sampleRate || sampleRate;" +
        "    need_buf_size = config.format.bufferSize || 4096;" +
        "    speex_converter = null;" +
        "    /*if (config.format.format == \'speex\') {" +
        "        if (!speex_loaded) {" +
        "            importScripts(\'./speex.min.js\');" +
        "            speex_loaded = true;" +
        "        }" +
        "        need_buf_size /= 16;" +
        "        speex_converter = new SpeexConverter(outSampleRate);" +
        "    }*/" +
        "}" +
        "" +
        "var resample = function (inbuf) {" +
        "    var speed = 1.0 * sampleRate / outSampleRate;" +
        "    var l = Math.ceil(inbuf.length / speed);" +
        "    var result = new Float32Array(l);" +
        "    var bin = 0;" +
        "    var num = 0;" +
        "    var indexIn = 0;" +
        "    var indexOut = 0;" +
        "    for (indexOut = 1, indexIn = speed; indexOut < l - 1; indexIn += speed, indexOut++) {" +
        "        var pos = Math.floor(indexIn);" +
        "        var dt = indexIn - pos;" +
        "        var second = (pos + 1 < inbuf.length) ? pos + 1 : inbuf.length - 1; " +
        "        result[indexOut] = inbuf[pos] * (1 - dt) + inbuf[second] * dt;" +
        "    }" +
        "    result[0] = inbuf[0];" +
        "    result[l - 1] = inbuf[inbuf.length - 1];" +
        "    return result;" +
        "};" +
        "    " +
        "function record(inputBuffer) {" +
        "    if (outSampleRate == sampleRate) {" +
        "        recBuffersL.push(inputBuffer[0]);" +
        "        recBuffersR.push(inputBuffer[1]);" +
        "        recLength += inputBuffer[0].length;" +
        "    " +
        "        var samples = inputBuffer[0];" +
        "        var buffer = new ArrayBuffer(samples.length * 2);" +
        "        var view = new DataView(buffer);" +
        "        floatTo16BitPCM(view, 0, samples);" +
        "        this.postMessage({command: 'int16stream', buffer: buffer});" +
        "    } else {" +
        "        var filter0 = new IIRFilter(outSampleRate, outSampleRate * 0.125, 0.0); " +
        "        var filter1 = new IIRFilter(outSampleRate, outSampleRate * 0.125, 0.0); " +
        "" +
        "        for (var i =0; i < inputBuffer[0].length; i++) { " +
        "            inputBuffer[0][i] = filter0.pushSample(inputBuffer[0][i]); " +
        "            inputBuffer[1][i] = filter1.pushSample(inputBuffer[1][i]); " +
        "        }" +
        "" +
        "        var resin0 = resample(inputBuffer[0], outSampleRate, sampleRate);" +
        "        var resin1 = resample(inputBuffer[1], outSampleRate, sampleRate);" +
        "    " +
        "        recBuffersL.push(resin0);" +
        "        recBuffersR.push(resin1);" +
        "        recLength += resin0.length;" +
        "    " +
        "        var result = new Int16Array(resin0.length);" +
        "    " +
        "        for (var i = 0 ; i < resin0.length ; i++) {" +
        "            result[i] = Math.floor(Math.min(Math.max((resin0[i] + resin1[i]) * 0.5, -1.0), 1.0) * 16383);" +
        "        }" +
        "    " +
        "        if (speex_converter) {" +
        "            result = speex_converter.convert(result);" +
        "        } else {" +
        "            result = result.buffer;" +
        "        }" +
        "    " +
        "        if (!tmp_buf) {" +
        "            tmp_buf = result;" +
        "        } else {" +
        "            var tmp = new DataView(new ArrayBuffer(tmp_buf.byteLength + result.byteLength));" +
        "            tmp_buf = new DataView(tmp_buf);" +
        "            result = new DataView(result);" +
        "    " +
        "            for (i = 0; i < tmp_buf.byteLength; i++) {" +
        "                tmp.setUint8(i, tmp_buf.getUint8(i));" +
        "            }" +
        "    " +
        "            for (i = 0; i < result.byteLength; i++) {" +
        "                tmp.setUint8(i + tmp_buf.byteLength, result.getUint8(i));" +
        "            }" +
        "    " +
        "            tmp_buf = tmp.buffer;" +
        "        }" +
        "    " +
        "        if (tmp_buf.byteLength >= need_buf_size) {" +
        "            this.postMessage({command: 'int16stream', buffer: tmp_buf});" +
        "            tmp_buf = false;" +
        "        }" +
        "    }" +
        "}" +
        "    " +
        "function exportWAV(type) {" +
        "    var bufferL = mergeBuffers(recBuffersL, recLength);" +
        "    var bufferR = mergeBuffers(recBuffersR, recLength);" +
        "    var interleaved = interleave(bufferL, bufferR);" +
        "    var dataview = encodeWAV(interleaved);" +
        "    var audioBlob = new Blob([dataview], {type: type});" +
        "    " +
        "    this.postMessage({command: 'exportWAV', blob: audioBlob});" +
        "}" +
        "    " +
        "function exportMonoWAV(type) {" +
        "    var bufferL = mergeBuffers(recBuffersL, recLength);" +
        "    var dataview = encodeWAV(bufferL, true);" +
        "    var audioBlob = new Blob([dataview], {type: type});" +
        "    " +
        "    this.postMessage({command: 'exportMonoWAV', blob: audioBlob});" +
        "}" +
        "    " +
        "function getBuffers() {" +
        "    var buffers = [];" +
        "    buffers.push(mergeBuffers(recBuffersL, recLength));" +
        "    buffers.push(mergeBuffers(recBuffersR, recLength));" +
        "    this.postMessage({command: 'getBuffers', blob: buffers});" +
        "}" +
        "    " +
        "function clear() {" +
        "    recLength = 0;" +
        "    recBuffersL = [];" +
        "    recBuffersR = [];" +
        "    if (speex_converter) {" +
        "        speex_converter.clear();" +
        "    }" +
        "    this.postMessage({command: 'clear'});" +
        "}" +
        "    " +
        "function mergeBuffers(recBuffers, recLength) {" +
        "    var result = new Float32Array(recLength);" +
        "    var offset = 0;" +
        "    for (var i = 0; i < recBuffers.length; i++){" +
        "        result.set(recBuffers[i], offset);" +
        "        offset += recBuffers[i].length;" +
        "    }" +
        "    return result;" +
        "}" +
        "    " +
        "function interleave(inputL, inputR) {" +
        "    var length = inputL.length + inputR.length;" +
        "    var result = new Float32Array(length);" +
        "    " +
        "    var index = 0;" +
        "    var inputIndex = 0;" +
        "    " +
        "    while (index < length){" +
        "        result[index++] = inputL[inputIndex];" +
        "        result[index++] = inputR[inputIndex];" +
        "        inputIndex++;" +
        "    }" +
        "    return result;" +
        "}" +
        "    " +
        "function floatTo16BitPCM(output, offset, input) {" +
        "    for (var i = 0; i < input.length; i++, offset += 2){" +
        "        var s = Math.max(-1, Math.min(1, input[i]));" +
        "        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);" +
        "    }" +
        "}" +
        "    " +
        "function writeString(view, offset, string) {" +
        "    for (var i = 0; i < string.length; i++){" +
        "        view.setUint8(offset + i, string.charCodeAt(i));" +
        "    }" +
        "}" +
        "    " +
        "function encodeWAV(samples, mono) {" +
        "    var buffer = new ArrayBuffer(44 + samples.length * 2);" +
        "    var view = new DataView(buffer);" +
        "    " +
        "    /* RIFF identifier */" +
        "    writeString(view, 0, 'RIFF');" +
        "    /* file length */" +
        "    view.setUint32(4, 32 + samples.length * 2, true);" +
        "    /* RIFF type */" +
        "    writeString(view, 8, 'WAVE');" +
        "    /* format chunk identifier */" +
        "    writeString(view, 12, 'fmt ');" +
        "    /* format chunk length */" +
        "    view.setUint32(16, 16, true);" +
        "    /* sample format (raw) */" +
        "    view.setUint16(20, 1, true);" +
        "    /* channel count */" +
        "    view.setUint16(22, mono ? 1 : 2, true);" +
        "    /* sample rate */" +
        "    view.setUint32(24, outSampleRate, true);" +
        "    /* block align (channel count * bytes per sample) */" +
        "    var block_align = mono ? 2 : 4;" +
        "    /* byte rate (sample rate * block align) */" +
        "    view.setUint32(28, outSampleRate * block_align, true);" +
        "    /* block align (channel count * bytes per sample) */" +
        "    view.setUint16(32, block_align, true);" +
        "    /* bits per sample */" +
        "    view.setUint16(34, 16, true);" +
        "    /* data chunk identifier */" +
        "    writeString(view, 36, 'data');" +
        "    /* data chunk length */" +
        "    view.setUint32(40, samples.length * 2, true);" +
        "    " +
        "    floatTo16BitPCM(view, 44, samples);" +
        "    " +
        "    return view;" +
        "}" +
        " ";

    namespace.ya.speechkit.newWorker = function () {
        return _makeWorker(inline_worker);
    };
}(this));

(function (namespace) {
    'use strict';

    if (typeof namespace.ya === 'undefined') {
        namespace.ya = {};
    }
    if (typeof namespace.ya.speechkit === 'undefined') {
        namespace.ya.speechkit = {};
    }

    /**
     * Создает новый объект типа Recognizer.
     * @class Создает сессию и отправляет запрос на сервер для распознавания речи.
     * @name Recognizer
     * @param {Object} [options] Опции.
     * @param {callback:initCallback} [options.onInit] Функция-обработчик, которая будет вызвана после успешной инициализации
     * сессии.
     * @param {callback:dataCallback} [options.onResult] Функция-обработчик, которая будет вызвана после завершения распознавания речи.
     * @param {callback:errorCallback} [options.onError]
     * @param {String} [options.uuid=см. описание] UUID сессии. По умолчанию принимает значение, указанное
     * в настройках ya.speechkit.settings.uuid.
     * @param {String} [options.key=см. описание] API-ключ. Если не задан, то используется ключ, указанный
     * в настройках ya.speechkit.settings.apiKey.
     * @param {ya.speechkit.FORMAT} [options.format=ya.speechkit.FORMAT.PCM16] Формат аудиопотока.
     * @param {String} [options.url=см. описание] URL сервера, на котором будет производиться распознавание.
     * Если параметр не указан, то берется значение, заданное в настройках ya.speechkit.settings.asrUrl. По умолчанию оно равно
     * 'webasr.yandex.net/asrsocket.ws'.
     * @param {Boolean} [options.punctuation=true] Использовать ли пунктуацию.
     * @param {Boolean} [options.allowStrongLanguage=false] Отключить фильтрацию обсценной лексики.
     * @param {String} [options.model=см. описание] Языковая модель, которая должна быть использована при распознавании.
     * Если параметр не указан, то используется значение, заданное в настройках ya.speechkit.model. Если в настройках значение не задано, то
     * используется модель 'freeform'.
     * @param {String} [options.lang=см. описание] Язык распознавания. По умолчанию принимает значение, указанное
     * в настройках ya.speechkit.settings.lang.
     * @param {String} [options.applicationName] Название приложения. Для некоторых приложений мы поддерживаем специальную логику. Пример - sandbox.
     */
    var Recognizer = function (options) {
        if (!(this instanceof namespace.ya.speechkit.Recognizer)) {
            return new namespace.ya.speechkit.Recognizer(options);
        }
        this.options = namespace.ya.speechkit._extend(
            {apiKey: namespace.ya.speechkit.settings.apiKey,
                uuid: namespace.ya.speechkit.settings.uuid,
                applicationName: namespace.ya.speechkit.settings.applicationName,
                url: namespace.ya.speechkit.settings.websocketProtocol +
                namespace.ya.speechkit.settings.asrUrl,
                onInit: function () {},
                onResult: function () {},
                onError: function () {},
                punctuation: true,
                allowStrongLanguage: false
            },
            options);

        // Backward compatibility
        this.options.key = this.options.apiKey;
        this.options.format = this.options.format.mime;

        this.sessionId = null;
        this.socket = null;

        this.buffered = [];
        this.totaldata = 0;
    };

    Recognizer.prototype = /** @lends Recognizer.prototype */{
        /**
         * Send raw data to websocket.
         * @param data Any data to send to websocket (json string, raw audio data).
         * @private
         */
        _sendRaw: function (data) {
            if (this.socket) {
                this.socket.send(data);
            }
        },
        /**
         * Stringify JSON and send it to websocket.
         * @param {Object} json Object needed to be send to websocket.
         * @private
         */
        _sendJson: function (json) {
            this._sendRaw(JSON.stringify({type: 'message', data: json}));
        },
        /**
         * Запускает процесс распознавания.
         */
        start: function () {
            this.sessionId = null;
            try {
                this.socket = new WebSocket(this.options.url);
            } catch (e) {
                this.options.onError('Error on socket creation: ' + e);
                this.options.stopCallback();
                return;
            }

            this.socket.onopen = function () {
                // {uuid: uuid, key: key, format: audioFormat, punctuation: punctuation ...
                // console.log('Initial request: ' + JSON.stringify(this.options));
                this._sendJson(this.options);
            }.bind(this);

            this.socket.onmessage = function (e) {
                var message = JSON.parse(e.data);

                console.log(message);

                if (message.type == 'InitResponse'){
                    this.sessionId = message.data.sessionId;
                    this.options.onInit(message.data.sessionId, message.data.code);
                } else if (message.type == 'AddDataResponse'){
                    this.options.onResult(message.data.text, message.data.uttr, message.data.merge, message.data.words);
                    if (typeof message.data.close !== 'undefined' && message.data.close) {
                        this.close();
                    }
                } else if (message.type == 'Error'){
                    this.options.onError('Session ' + this.sessionId + ': ' + message.data);
                    this.close();
                } else {
                    this.options.onError('Session ' + this.sessionId + ': ' + message);
                    this.close();
                }
            }.bind(this);

            this.socket.onerror = function (error) {
                this.options.onError('Socket error: ' + error.message);
            }.bind(this);

            this.socket.onclose = function (event) {
            }.bind(this);
        },
        /**
         * Добавляет данные с аудио к потоку для распознавания речи.
         * Если сессия распознавания еще не была создана, то данные будут буферизованы и отправятся на сервер
         * по факту установления соединения.
         * @param {ArrayBuffer} data Буфер с аудио сигналом в формате PCM 16bit.
         */
        addData: function (data) {
            this.totaldata += data.byteLength;

            if (!this.sessionId) {
                this.buffered.push(data);
                return;
            }

            for (var i = 0; i < this.buffered.length; i++){
                this._sendRaw(new Blob([this.buffered[i]], {type: this.options.format}));

                // here
                //this.totaldata += this.buffered[i].byteLength;
                this.totaldata = this.buffered[i].byteLength;
            }

            this.buffered = [];
            this._sendRaw(new Blob([data], {type: this.options.format}));
        },
        /**
         * Принудительно завершает запись звука и отсылает запрос (не закрывает сессию распознавания, пока не получит от сервера последний ответ).
         */
        finish: function () {
            this._sendJson({command: 'finish'});
        },
        /**
         * Завершает сессию распознавания речи, закрывая соединение с сервером.
         */
        close: function () {
            this.options.onInit = function () {};
            this.options.onResult = this.options.onInit;
            this.options.onError = this.options.onInit;

            if (this.socket) {
                this.socket.close();
                this.options.stopCallback();
            }
            this.socket = null;
        }
    };

    namespace.ya.speechkit.Recognizer = Recognizer;

    /**
     * Функция-обработчик, которая будет вызвана после успешной инициализации
     * сессии.
     * @callback
     * @name initCallback
     * @param {String} sessionId Идентификатор сессии.
     * @param {Number} code HTTP-статус, который будет содержаться в ответе сервера после инициализации сессии (200).
     * @memberOf Recognizer
     */

    /**
     * Функция-обработчик, которая будет вызвана в случае возникновения ошибки.
     * @callback
     * @name errorCallback
     * @param {String} message Текст сообщения об ошибке.
     * @memberOf Recognizer
     */

    /**
     * Функция-обработчик, которая будет вызвана после завершения распознавания речи.
     * @callback
     * @name dataCallback
     * @param {String} text Распознанный текст.
     * @param {Boolean} utterance Является ли данный текст финальным результатом распознавания.
     * @param {Number} merge Число обработанных запросов по которым выдан ответ. (Сколько пакетов с данными были соединены в этот результат).
     * @memberOf Recognizer
     */
}(this));
(function (namespace) {
    'use strict';

    if (typeof namespace.ya === 'undefined') {
        namespace.ya = {};
    }
    if (typeof namespace.ya.speechkit === 'undefined') {
        namespace.ya.speechkit = {};
    }

    function noop() {}

    /**
     * Параметры по умолчанию для SpeechRecognition
     * @private
     */
    namespace.ya.speechkit._defaultOptions = function () {
        /**
         * @typedef {Object} SpeechRecognitionOptions
         * @property {SpeechRecognition~initCallback} initCallback - Функция, которая будет вызвана по факту инициализации сессии распознавания
         * @property {SpeechRecognition~errorCallback} errorCallback - Функция, которая будет вызвана по факту ошибки (все ошибки - критичны, и приводят к порче сессии)
         * @property {SpeechRecognition~dataCallback} dataCallback - Функция, в которую будут приходить результаты распознавания
         * @property {SpeechRecognition~infoCallback} infoCallback - Функция для технической информации
         * @property {SpeechRecognition~stopCallback} stopCallback - Функция, которая будет вызвана в момент остановки сессии распознавания
         * @property {Boolean} punctuation - Следует ли пытаться расставлять знаки препинания
         * @property {Boolean} allowStringLanguage - Следует ли отключить фильтрацию обсценной лексики
         * @property {String} model - Языковая модель для распознавания речи
         * @property {String} lang - Язык, речь на котором следует распознавать
         * @property {ya.speechkit.FORMAT} format - Формат передачи аудио сигнала
         * @property {String} [options.applicationName] Название приложения. Для некоторых приложений мы поддерживаем специальную логику. Пример - sandbox.
         */
        return {
            initCallback: noop,
            errorCallback: noop,
            dataCallback: noop,
            infoCallback: noop,
            stopCallback: noop,
            punctuation: false,
            allowStrongLanguage: false,
            advancedOptions: {},
            model: namespace.ya.speechkit.settings.model,
            applicationName: namespace.ya.speechkit.settings.applicationName,
            lang: namespace.ya.speechkit.settings.lang,
            format: namespace.ya.speechkit.FORMAT.PCM16,
            url: namespace.ya.speechkit.settings.websocketProtocol +
            namespace.ya.speechkit.settings.asrUrl,
            vad: false,
            speechStart: noop,
            speechEnd: noop,
        };
    };

    /**
     * Создает новый объект типа SpeechRecognition.
     * @class Класс для распознавания большого потока аудио-сигнала.
     * @name SpeechRecognition
     */
    var SpeechRecognition = function () {
        if (!(this instanceof namespace.ya.speechkit.SpeechRecognition)) {
            return new namespace.ya.speechkit.SpeechRecognition();
        }
        this.send = 0;
        this.send_bytes = 0;
        this.proc = 0;
        this.recorder = null;
        this.recognizer = null;
        this.vad = null;
    };

    SpeechRecognition.prototype = /** @lends SpeechRecognition.prototype */ {
        /**
         * Запускает процесс распознавания речи.
         * @param {SpeechRecognitionOptions} [options] Параметры, которые будут использоваться во время сессии.
         * @param {callback:initCallback} [options.initCallback] Функция-обработчик, которая будет вызвана по факту инициализации сессии распознавания.
         * @param {callback:errorCallback} [options.errorCallback] Функция-обработчик, которая будет вызвана по факту ошибки (все ошибки критичны и приводят к завершению сессии).
         * @param {callback:dataCallback} [options.dataCallback] Функция-обработчик, которая будет вызвана после успешного завершения
         * распознавания. В качестве аргумента ей передаются результаты распознавания.
         * @param {callback:infoCallback} [options.infoCallback] Функция для получения технической информации.
         * @param {callback:stopCallback} [options.stopCallback] Функция-обработчик, которая будет вызвана в момент остановки сессии распознавания.
         * @param {Boolean} [options.apiKey] API-ключ. Если не задан, то используется ключ, указанный
         * в настройках ya.speechkit.settings.apiKey.
         * @param {Boolean} [options.punctuation=false] Следует ли использовать пунктуацию.
         * @param {Boolean} [options.allowStrongLanguage=false] Следует ли отключить фильтрацию обсценной лексики.
         * @param {String} [options.model='notes'] Языковая модель для распознавания речи. Список доступных значений:
         * <ul>
         *     <li>'notes' (по умолчанию) — общая лексика;</li>
         *     <li>'queries' — короткие запросы;</li>
         *     <li>'names' — имена; </li>
         *     <li>'dates' — даты; </li>
         *     <li>'maps' - топонимы;</li>
         *     <li>'notes' - тексты;</li>
         *     <li>'numbers' — числа.</li>
         * </ul>
         * <p>Если параметр не указан, то используется
         * значение, заданное в настройках ya.speechkit.model. Если в настройках значение не задано, то
         * используется модель по умолчанию - 'notes'. </p>
         * @param {String} [options.applicationName] Название приложения. Для некоторых приложений мы поддерживаем специальную логику. Пример - sandbox.
         * @param {String} [options.lang='ru-RU'] Язык, речь на котором следует распознавать. Если параметр не указан, то используется
         * значение, заданное в настройках ya.speechkit.lang. Если в настройках значение не задано, то по умолчанию
         * выбирается русский язык: 'ru-RU'.
         * @param {ya.speechkit.FORMAT} [options.format=ya.speechkit.FORMAT.PCM16] Формат передачи аудио-сигнала.
         */
        start: function (options) {
            this.options = namespace.ya.speechkit._extend(
                namespace.ya.speechkit._extend(
                    {},
                    namespace.ya.speechkit._defaultOptions()
                ),
                options);
            if (namespace.ya.speechkit.settings.lang_whitelist.indexOf(this.options.lang) >= 0) {
                if (namespace.ya.speechkit._stream !== null) {
                    this._onstart();
                } else {
                    namespace.ya.speechkit.initRecorder(
                        this._onstart.bind(this),
                        this.options.errorCallback
                    );
                }
            } else {
                var old_error_callback = this.options.errorCallback;
                this.recorder = namespace.ya.speechkit.WebAudioRecognition(
                    namespace.ya.speechkit._extend(
                        this.options,
                        {
                            errorCallback: function (e) {
                                this.recorder = null;
                                old_error_callback(e);
                            }.bind(this)
                        }
                    ));
                this.recorder.start();
            }
        },
        /**
         * Will be called after successful call of initRecorder
         * @private
         */
        _onstart: function () {
            if (this.recorder && this.recorder.isPaused()) {
                this.recorder.start();
            }

            if (this.recognizer) {
                return;
            }

            this.send = 0;
            this.send_bytes = 0;
            this.proc = 0;

            if (!this.recorder) {
                this.recorder = new namespace.ya.speechkit.Recorder();
                if (this.options.vad) {
                    this.vad = new namespace.ya.speechkit.Vad({recorder: this.recorder,
                        speechStart: this.options.speechStart,
                        speechEnd: this.options.speechEnd});
                }
            }

            this.recognizer = new namespace.ya.speechkit.Recognizer(
                namespace.ya.speechkit._extend(this.options,
                    {
                        onInit: function (sessionId, code) {
                            this.recorder.start(function (data) {
                                if (this.options.vad && this.vad) {
                                    this.vad.update();
                                }
                                this.send++;
                                this.send_bytes += data.byteLength;
                                this.options.infoCallback({
                                    send_bytes: this.send_bytes,
                                    format: this.options.format,
                                    send_packages: this.send,
                                    processed: this.proc
                                });
                                this.recognizer.addData(data);
                            }.bind(this), this.options.format);

                            this.options.initCallback(sessionId, code, 'yandex');
                        }.bind(this),
                        onResult: function (text, uttr, merge, words) {
                            this.proc += merge;
                            this.options.dataCallback(text, uttr, merge, words);
                        }.bind(this),
                        onError: function (msg) {
                            if (this.recorder) {
                                this.recorder.stop(function () { this.recorder = null; }.bind(this));
                            }
                            if (this.recognizer) {
                                this.recognizer.close();
                                this.recognizer = null;
                            }
                            this.options.errorCallback(msg);
                        }.bind(this),
                    }));
            this.recognizer.start();
        },
        /**
         * Завершает сессию распознавания речи.
         * По завершении сессии будет вызвана функция-обработчик stopCallback.
         */
        stop: function () {
            if (this.recognizer) {
                this.recognizer.finish();
            }

            if (this.recorder) {
                this.recorder.stop(
                    function () {
                        this.recognizer = null;
                        this.recorder = null;
                    }.bind(this)
                );
            }
        },
        /**
         * Прерывает сессию распознавания речи (не дожидается финального результата распознавания).
         * По завершении сессии будет вызвана функция-обработчик stopCallback.
         */
        abort: function () {
            if (this.recognizer) {
                this.recognizer.close();
            }
            if (this.recorder) {
                this.recorder.stop(
                    function () {
                        this.recognizer = null;
                        this.recorder = null;
                    }.bind(this)
                );
            }
        },
        /**
         * Ставит сессию распознавания на паузу.
         * Чтобы соединение с сервером не прерывалось и можно было моментально возобновить распознавание,
         * на сервер периодически посылаются небольшие куски данных.
         */
        pause: function () {
            if (this.recorder) {
                this.recorder.pause();
            }
        },
        /**
         * Определяет, стоит ли на паузе сессия распознавания.
         * @returns {Boolean} true, если сессия распознавания речи стоит на паузе, false - иначе.
         */
        isPaused: function () {
            return (!this.recorder || this.recorder.isPaused());
        }
    };

    ya.speechkit.SpeechRecognition = SpeechRecognition;

    /**
     * Функция для распознавания коротких фрагментов речи.
     * <p> При вызове функции recognize() начинается запись звука с микрофона.
     * Как только наступает тишина более чем на одну секунду, запись
     * прекращается, и функция отправляет запрос на сервер для распознавания записанного фрагмента.</p>
     * <p>Приемлемое качество распознавания обеспечивается на фрагментах длительностью не более 10 секунд.
     * При более длительном фрагменте качество распознавания ухудшается.</p>
     * @static
     * @function
     * @name recognize
     * @param {SpeechRecognitionOptions} [options] Параметры распознавания речи.
     * @param {callback:SpeechRecognition.initCallback} [options.initCallback] Функция-обработчик, которая будет вызвана по факту
     * инициализации сессии распознавания.
     * @param {callback:SpeechRecognition.errorCallback} [options.errorCallback] Функция-обработчик, которая будет вызвана при возникновении ошибки
     * (все ошибки критичны и приводят к завершению сессии).
     * @param {callback:SpeechRecognition.recognitionDoneCallback} [options.doneCallback] Функция-обработчик, в которую будет отправлен результат распознавания речи.
     * @param {String} [options.apiKey] API-ключ. По умолчанию принимает значение, указанное
     * в настройках ya.speechkit.settings.apiKey.
     * @param {String} [options.model='notes'] Список доступных значений:
     * <ul>
     *     <li>'notes' (по умолчанию) — текст;</li>
     *     <li>'queries' — короткие запросы;</li>
     *     <li>'names' — имена; </li>
     *     <li>'dates' — даты; </li>
     *     <li>'maps' - топонимы;</li>
     *     <li>'notes' - тексты;</li>
     *     <li>'numbers' — числа.</li>
     * </ul>
     * <p>Если параметр не указан, то используется
     * значение, заданное в настройках ya.speechkit.model. Если в настройках значение не задано, то
     * используется модель по умолчанию - 'notes'. </p>
     * @param {String} [options.applicationName] Название приложения. Для некоторых приложений мы поддерживаем специальную логику. Пример - sandbox.
     * @param {String} [options.lang='ru-RU'] Язык, речь на котором следует распознавать. Если параметр не указан, то используется
     * значение, заданное в настройках ya.speechkit.lang. Если в настройках значение не задано, то по умолчанию
     * выбирается русский язык: 'ru-RU'.
     * @param {Object} [advancedOptions] Дополнительные опции.
     * @param {Boolean} [advancedOptions.partial_results=true] Отправлять ли на сервер промежуточные результаты.
     * @param {Number} [advancedOptions.utterance_silence=120] Длительность промежутка тишины во время записи речи. Как только встречается
     * такой перерыв в речи, запись звука останавливается, и записанный фрагмент речи отправляется на сервер.
     */

    namespace.ya.speechkit.recognize = function (options) {
        var dict = new namespace.ya.speechkit.SpeechRecognition();

        var opts = namespace.ya.speechkit._extend(
            namespace.ya.speechkit._extend(
                {},
                namespace.ya.speechkit._defaultOptions()
            ),
            options);

        opts.doneCallback = options.doneCallback;

        opts.dataCallback = function (text, uttr, merge) {

            //console.log('text ' + text);

            opts.resultCallBackBuf(text);

            if (uttr) {
                console.log('stop');
                if (opts.doneCallback) {
                    opts.doneCallback(text);
                }
                dict.stop();
            }
        };

        opts.stopCallback = function () {
            dict = null;
        };

        dict.start(opts);
    };

    /**
     * Функция, в которую передается полностью распознанный фрагмент текста.
     * @param {String} text Распознанная речь.
     * @callback
     * @name recognitionDoneCallback
     * @memberOf SpeechRecognition
     */

    /**
     * Функция, которая будет вызвана после успешной инициализации сессии распознавания речи.
     * @callback
     * @name initCallback
     * @memberOf SpeechRecognition
     * @param {String} sessionId Идентификатор сессии.
     * @param {Number} code HTTP-статус, который будет содержаться в ответе сервера (200 в случае успеха).
     */

    /**
     * Функция, в которую будут переданы сообщения об ошибках.
     * @callback
     * @name errorCallback
     * @memberOf SpeechRecognition
     * @param {String} message Текст сообщения об ошибке.
     */

    /**
     * Функция для результатов распознавания речи.
     * @callback
     * @name dataCallback
     * @memberOf SpeechRecognition
     * @param {String} text Распознанный текст.
     * @param {Boolean} utterance Является ли данный текст финальным результатом распознавания.
     * @param {Number} merge Число обработанных запросов, по которым выдан ответ от сервера.
     */

    /**
     * В эту функцию будет передаваться техническая информация.
     * @callback
     * @name infoCallback
     * @memberOf SpeechRecognition.
     * @param {Number} send_bytes Сколько байт аудио-данных было передано на сервер.
     * @param {Number} send_packages Сколько пакетов аудио-данных было передано на сервер.
     * @param {Number} processed Количество пакетов, на которые ответил сервер.
     * @param {ya.speechkit.FORMAT} format Какой формат аудио используется.
     */

    /**
     * Функция, которая будет вызвана после остановки сессии распознавания речи.
     * @callback
     * @name stopCallback
     * @memberOf SpeechRecognition
     */
}(this));







(function (namespace) {
    'use strict';

    if (typeof namespace.ya === 'undefined') {
        namespace.ya = {};
    }
    if (typeof namespace.ya.speechkit === 'undefined') {
        namespace.ya.speechkit = {};
    }

    var WebAudioRecognition = function (options) {
        if (!(this instanceof namespace.ya.speechkit.WebAudioRecognition)) {
            return new namespace.ya.speechkit.WebAudioRecognition(options);
        }
        this.recognition = null;
        this.recorder = null;
        this.options = namespace.ya.speechkit._extend(
            namespace.ya.speechkit._extend(
                namespace.ya.speechkit._defaultOptions(),
                options),
            {format: namespace.ya.speechkit.FORMAT.PCM44});
    };

    WebAudioRecognition.prototype = {
        _onstart: function () {
            this.send = 0;
            this.send_bytes = 0;

            this.recognition = namespace.ya.speechkit._extend(this.recognition,
                {
                    interim_transcript: '',
                    lang: this.options.lang,
                    onend: this.stop.bind(this),
                    onresult: function (event) {
                        this.interim_transcript = '';
                        var arr = [];
                        for (var i = event.resultIndex; i < event.results.length; ++i) {
                            if (event.results[i].isFinal) {
                                arr.push({0:{
                                    transcript: event.results[i][0].transcript,
                                    confidence: event.results[i][0].confidence
                                }});
                                this.backref.options.dataCallback(event.results[i][0].transcript, true, 1);
                                this.interim_transcript = '';
                            } else {
                                this.interim_transcript += event.results[i][0].transcript;
                            }
                        }
                        if (arr.length) {
                            this.backref.recognizer._sendJson(arr);
                        }
                        this.backref.options.dataCallback(this.interim_transcript, false, 1);
                    },
                    continuous: true,
                    interimResults: true,
                    maxAlternatives: 5,
                    errorCallback: this.options.errorCallback,
                    onerror: function (e) { this.errorCallback(e.error); }
                });
            this.recognition.backref = this;

            this.recorder = new namespace.ya.speechkit.Recorder();
            this.recognizer = new namespace.ya.speechkit.Recognizer(
                namespace.ya.speechkit._extend(this.options,
                    {
                        url: this.options.url.replace('asrsocket.ws', 'logsocket.ws'),
                        samplerate: this.options.format.sampleRate,
                        onInit: function (sessionId, code) {
                            this.recorder.start(function (data) {
                                if (this.options.vad && this.vad) {
                                    this.vad.update();
                                }
                                this.send++;
                                this.send_bytes += data.byteLength;
                                this.options.infoCallback({
                                    send_bytes: this.send_bytes,
                                    format: this.options.format,
                                    send_packages: this.send,
                                    processed: this.proc
                                });
                                this.recognizer.addData(data);
                            }.bind(this), this.options.format);
                            this.recognition.onstart = this.options.initCallback.bind(this, sessionId, code, 'native');
                            this.recognition.start();
                        }.bind(this),
                        onResult: function () {},
                        onError: function (msg) {
                            this.recorder.stop(function () {});
                            this.recognizer.close();
                            this.recognizer = null;
                            this.options.errorCallback(msg);
                        }.bind(this),
                    }));
            this.recognizer.start();
        },
        start: function () {
            if (typeof namespace.webkitSpeechRecognition !== 'undefined') {
                this.recognition = new namespace.webkitSpeechRecognition();

                if (namespace.ya.speechkit._stream !== null) {
                    this._onstart();
                } else {
                    namespace.ya.speechkit.initRecorder(
                        this._onstart.bind(this),
                        this.options.errorCallback
                    );
                }
            } else {
                this.options.errorCallback('Your browser doesn\'t implement Web Speech API');
            }
        },
        stop: function (cb) {
            if (this.recognition) {
                this.recognition.onend = function () {};
                this.recognition.stop();
            }
            if (this.recorder) {
                this.recorder.stop();
            }
            if (this.recognizer) {
                this.recognizer.close();
            }
            this.options.stopCallback();
            if (typeof cb !== 'undefined') {
                if (Object.prototype.toString.call(cb) == '[object Function]') {
                    cb();
                }
            }
        },
        pause: function () {
        },
        isPaused: function () {
            return false;
        },
        getAnalyserNode: function () {
            if (this.recorder) {
                return this.recorder.getAnalyserNode();
            }
        }
    };

    namespace.ya.speechkit.WebAudioRecognition = WebAudioRecognition;
}(this));

(function (namespace) {
    'use strict';

    if (typeof namespace.ya === 'undefined') {
        namespace.ya = {};
    }
    if (typeof namespace.ya.speechkit === 'undefined') {
        namespace.ya.speechkit = {};
    }

    namespace.ya.speechkit.Equalizer = function (target, recorder) {
        this.recorder = recorder;
        this.element = document.getElementById(target);
        this.element.style.textAlign = 'center';
        this.element.innerText = '';
        this.graf = document.createElement('canvas');
        this.graf.style.width = '100%';
        this.graf.style.height = '100%';
        this.graf.width = 1000;

        this.element.appendChild(this.graf);

        if (!navigator.cancelAnimationFrame) {
            navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame ||
                navigator.mozCancelAnimationFrame;
        }
        if (!navigator.requestAnimationFrame) {
            navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame ||
                navigator.mozRequestAnimationFrame;
        }

        this.refID = null;

        this.startDrawRealtime();
    };

    namespace.ya.speechkit.Equalizer.prototype = {
        destroy: function () {
            this.stopDrawRealtime();
            this.element.removeChild(this.graf);
        },
        stopDrawRealtime: function () {
            window.cancelAnimationFrame(this.rafID);
            this.rafID = null;
        },
        startDrawRealtime: function () {
            var _this = this;
            function updateAnalysers(time) {
                if (!_this.analyserNode) {
                    if (_this.recorder) {
                        _this.analyserNode = _this.recorder.getAnalyserNode();
                        _this.context = _this.recorder.context;
                    } else {
                        return;
                    }
                }

                var canvasWidth = _this.graf.width;
                var canvasHeight = _this.graf.height;
                var analyserContext = _this.graf.getContext('2d');

                var SPACING = 2;
                var BAR_WIDTH = 1;
                var numBars = Math.round(canvasWidth / SPACING);
                var freqByteData = new Uint8Array(_this.analyserNode.frequencyBinCount);

                _this.analyserNode.getByteFrequencyData(freqByteData);

                analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
                analyserContext.fillStyle = '#F6D565';
                analyserContext.lineCap = 'round';
                var multiplier = _this.analyserNode.frequencyBinCount / numBars;

                for (var i = 0; i < numBars; ++i) {
                    var magnitude = 0;
                    var offset = Math.floor(i * multiplier);
                    for (var j = 0; j < multiplier; j++) {
                        magnitude += freqByteData[offset + j];
                    }
                    magnitude = magnitude / multiplier / 2;
                    analyserContext.fillStyle = 'hsl( ' + Math.round(i * 60 / numBars) + ', 100%, 50%)';
                    analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
                }
                _this.rafID = window.requestAnimationFrame(updateAnalysers);
            }

            this.rafID = window.requestAnimationFrame(updateAnalysers);
        }
    };
}(this));

/*
кажись это лишнее
(function (namespace) {
    'use strict';

    if (typeof namespace.ya === 'undefined') {
        namespace.ya = {};
    }
    if (typeof namespace.ya.speechkit === 'undefined') {
        namespace.ya.speechkit = {};
    }

    namespace.ya.speechkit._mic_on = '<svg version="1.1" id="Layer_1" ' +
        ' xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"' +
        ' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
        ' x="0px" y="0px" viewBox="0 0 112 112"' +
        ' enable-background="new 0 0 112 112" xml:space="preserve">' +
        ' <g id="tuts" sketch:type="MSPage">' +
        ' <g id="mic_ff" sketch:type="MSLayerGroup">' +
        ' <g sketch:type="MSShapeGroup">' +
        ' <circle id="path-1" fill="rgb(255, 204, 0)" cx="56" cy="56" r="56"/>' +
        ' </g>' +
        ' <g id="speechkit_vector-9" transform="translate(39.000000, 32.000000)" ' +
        ' sketch:type="MSShapeGroup" opacity="0.9">' +
        ' <path id="Shape" d="M17,4c2.8,0,5,2.3,5,5.2v15.6c0,2.9-2.2,5.2-5,5.2s-5-2.3-5-5.2V9.2C12,6.3,14.2,4,17,4 M17,0' +
        ' c-5,0-9,4.1-9,9.2v15.6c0,5.1,4,9.2,9,9.2s9-4.1,9-9.2V9.2C26,4.1,22,0,17,0L17,0z"/>' +
        ' <path id="Shape_1_" ' +
        ' d="M34,23v1.1C34,34,26.4,42,17,42S0,34,0,24.1V23h4v0.1C4,31.3,9.8,38,17,38s13-6.7,13-14.9V23H34z"/>' +
        ' <rect id="Rectangle-311" x="15" y="41" width="4" height="10"/>' +
        ' </g>' +
        ' </g>' +
        ' </g>' +
        ' </svg>';

    namespace.ya.speechkit._mic_off = '<svg version="1.1" id="Layer_1" ' +
        ' xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"' +
        ' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
        ' x="0px" y="0px" viewBox="0 0 112 112"' +
        ' enable-background="new 0 0 112 112" xml:space="preserve">' +
        ' <g id="tuts" sketch:type="MSPage">' +
        ' <g id="mic_ff" sketch:type="MSLayerGroup">' +
        ' <g id="speechkit_vector-9" transform="translate(39.000000, 32.000000)" ' +
        ' sketch:type="MSShapeGroup" opacity="0.9">' +
        ' <path id="Shape" d="M17,4c2.8,0,5,2.3,5,5.2v15.6c0,2.9-2.2,5.2-5,5.2s-5-2.3-5-5.2V9.2C12,6.3,14.2,4,17,4 M17,0' +
        ' c-5,0-9,4.1-9,9.2v15.6c0,5.1,4,9.2,9,9.2s9-4.1,9-9.2V9.2C26,4.1,22,0,17,0L17,0z"/>' +
        ' <path id="Shape_1_" ' +
        ' d="M34,23v1.1C34,34,26.4,42,17,42S0,34,0,24.1V23h4v0.1C4,31.3,9.8,38,17,38s13-6.7,13-14.9V23H34z"/>' +
        ' <rect id="Rectangle-311" x="15" y="41" width="4" height="10"/>' +
        ' </g>' +
        ' </g>' +
        ' </g>' +
        ' </svg>';

    /**
     * Класс для добавления элемента управления "Поле для голосового ввода".
     * @name Textline
     * @class
     * @param {string} target Идентификатор div-контейрена, в котором будет размещен элемент управления.
     * @param {Object} [options] Опции распознавания.
     * @param {Object} [options.onInputFinished] Функция, которая будет вызвана после завершения распознавания. В качесве ее
     * аргументов передается финальный распознанный текст.
     * * @param {Boolean} [options.apiKey] API-ключ. Если не задан, то используется ключ, указанный
     * в настройках ya.speechkit.settings.apiKey.
     * @param {Boolean} [options.allowStrongLanguage=false] Следует ли отключить фильтрацию обсценной лексики.
     * @param {String} [options.model='notes'] Языковая модель для распознавания речи. Список доступных значений:
     * <ul>
     *     <li>'notes' (по умолчанию) — текст;</li>
     *     <li>'queries' — короткие запросы;</li>
     *     <li>'names' — имена; </li>
     *     <li>'dates' — даты; </li>
     *     <li>'maps' - топонимы;</li>
     *     <li>'notes' - тексты;</li>
     *     <li>'numbers' — числа.</li>
     * </ul>
     * <p>Если параметр не указан, то используется
     * значение, заданное в настройках ya.speechkit.model. Если в настройках значение не задано, то
     * используется модель по умолчанию - 'notes'. </p>
     * @param {String} [options.lang='ru-RU'] Язык, речь на котором следует распознавать. Если параметр не указан, то используется
     * значение, заданное в настройках ya.speechkit.lang. Если в настройках значение не задано, то по умолчанию
     * выбирается русский язык: 'ru-RU'.
     * @param {ya.speechkit.FORMAT} [options.format=ya.speechkit.FORMAT.PCM16] Формат передачи аудио-сигнала.
     *//*
    namespace.ya.speechkit.Textline = function (target, options) {
        if (!(this instanceof namespace.ya.speechkit.Textline)) {
            return new namespace.ya.speechkit.Textline(target, options);
        }

        var el = document.getElementById(target);
        if (el.tagName != 'INPUT') {
            this.element = el;
            this.textinput = document.createElement('input');
            this.textinput.style.height = '100%';
            this.textinput.style.width = '100%';
        } else {
            this.textinput = el;
            this.element = null;
        }
        this.textinput.style.backgroundImage = 'url(\'data:image/svg+xml;utf8,' +
            namespace.ya.speechkit._mic_off + '\')';
        this.textinput.style.backgroundRepeat = 'no-repeat';
        this.textinput.style.backgroundPosition = 'right center';
        if (this.element) {
            this.element.appendChild(this.textinput);
        }

        this.dict = null;

        this.final_result = '';

        var _this = this;

        this.textinput.onmousemove = function (event) {
            var rect = _this.textinput.getBoundingClientRect();
            if (event.clientX - rect.x > rect.width - rect.height)
            {
                _this.textinput.style.cursor = 'pointer';
            } else {
                _this.textinput.style.cursor = 'text';
            }
        };

        options = options || {};

        options.dataCallback = function (text, uttr, merge) {
            _this.textinput.value = text;
            if (uttr) {
                if (options.onInputFinished) {
                    _this.final_result = text;
                    options.onInputFinished(text);
                }
                _this.dict.abort();
            }
        };

        options.initCallback = function () {
            _this.textinput.style.backgroundImage = 'url(\'data:image/svg+xml;utf8,' + ya.speechkit._mic_on + '\')';
        };

        options.stopCallback = function () {
            _this.textinput.style.backgroundImage = 'url(\'data:image/svg+xml;utf8,' + ya.speechkit._mic_off + '\')';
            _this.dict = null;
        };

        this.textinput.onmousedown = function (event) {
            var rect = _this.textinput.getBoundingClientRect();

            if (event.clientX <= rect.width - rect.height) {
                return;
            }

            if (!_this.dict) {
                _this.dict = new ya.speechkit.SpeechRecognition();
            }
            if (_this.dict.isPaused())
            {
                _this.dict.start(options);
            } else {
                _this.dict.stop();
            }
        };

        return {
            /**
             * Удаляет элемент управления.
             * @name Textline.destroy
             * @function
             */
/*
            destroy: function () {
                if (_this.dict) {
                    _this.dict.stop();
                }
                _this.textinput.style.backgroundImage = '';
                _this.textinput.onmousedown = function () {};
                _this.textinput.onmousemove = function () {};

                if (_this.element) {
                    _this.element.removeChild(_this.textinput);
                }
            },
            /**
             * Получает финальный результат распознавания в синхронном режиме.
             * @name Textline.value
             * @function
             * @returns {string} Результат распознавания.
             *
             * @example
             * var textline = new ya.speechkit.Textline('myDiv');
             *
             * setTimeout(function () {
             *     console.log("Результат распознавания: " + textline.value());
             * }, 5000);
             */
/*
            value: function () {
                return _this.final_result;
            }
        };
    };
}(this));
*/





/*

window.onload = function() {

    ya.speechkit.recognize({
        doneCallback: function (text) {
            console.log("You've said: " + text);
        },
        initCallback: function () {
            console.log("You may speak now");
        },
        errorCallback: function (err) {
            console.log("Something gone wrong: " + err);
        },
        model: 'freeform', // Model name for recognition process
        lang: 'ru-RU', //Language for recognition process
        apiKey: 'ee18d8a0-5813-4657-9469-972ba94af634'
    });

};

*/
