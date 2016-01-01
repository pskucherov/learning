modules.define(
    's-speaker',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {
            onSetMod: {
                js: {
                    inited: function () {

                        //this._getPoem(1);

                        this.currentPoem = {};
                        this.modal = this.findBlockInside('modal');

                        var elem = this.modal.elem('content');

                        BEMDOM.destruct(elem, true);
                        BEMDOM.update(elem, BEMHTML.apply({
                            block : 'suggest',
                            mods : {
                                theme : 'islands',
                                size : 'l',
                                'has-dataprovider' : 'timezone'
                            },
                            name : 'timezone',
                            dataprovider : {
                                data : [
                                    'Africa/Abidjan',
                                    'Africa/Accra',
                                    'Africa/Addis_Ababa',
                                    'Africa/Algiers',
                                    'Africa/Asmara',
                                    'Africa/Bamako',
                                    'Africa/Bangui',
                                    'Africa/Banjul',
                                    'Africa/Bissau',
                                    'Africa/Blantyre',
                                    'Africa/Brazzaville',
                                    'Africa/Bujumbura',
                                    'Africa/Cairo',
                                    'Africa/Casablanca',
                                    'Africa/Ceuta',
                                    'Africa/Conakry',
                                    'Africa/Dakar',
                                    'Africa/Dar_es_Salaam',
                                    'Africa/Djibouti',
                                    'Africa/Douala',
                                    'Africa/El_Aaiun',
                                    'Africa/Freetown',
                                    'Africa/Gaborone',
                                    'Africa/Harare',
                                    'Africa/Johannesburg',
                                    'Africa/Juba',
                                    'Africa/Kampala',
                                    'Africa/Khartoum',
                                    'Africa/Kigali',
                                    'Africa/Kinshasa',
                                    'Africa/Lagos',
                                    'Africa/Libreville',
                                    'Africa/Lome',
                                    'Africa/Luanda',
                                    'Africa/Lubumbashi',
                                    'Africa/Lusaka',
                                    'Africa/Malabo',
                                    'Africa/Maputo',
                                    'Africa/Maseru',
                                    'Africa/Mbabane',
                                    'Africa/Mogadishu',
                                    'Africa/Monrovia',
                                    'Africa/Nairobi',
                                    'Africa/Ndjamena',
                                    'Africa/Niamey',
                                    'Africa/Nouakchott',
                                    'Africa/Ouagadougou',
                                    'Africa/Porto',
                                    'Africa/Sao_Tome',
                                    'Africa/Tripoli',
                                    'Africa/Tunis',
                                    'Africa/Windhoek',
                                    'America/Adak',
                                    'America/Anchorage',
                                    'America/Anguilla',
                                    'America/Antigua',
                                    'America/Araguaina',
                                    'America/Argentina',
                                    'America/Argentina',
                                    'America/Argentina',
                                    'America/Argentina',
                                    'America/Argentina',
                                    'America/Argentina',
                                    'America/Argentina',
                                    'America/Argentina',
                                    'America/Argentina',
                                    'America/Argentina',
                                    'America/Argentina',
                                    'America/Argentina',
                                    'America/Aruba',
                                    'America/Asuncion',
                                    'America/Atikokan',
                                    'America/Bahia',
                                    'America/Bahia_Banderas',
                                    'America/Barbados',
                                    'America/Belem',
                                    'America/Belize',
                                    'America/Blanc',
                                    'America/Boa_Vista',
                                    'America/Bogota',
                                    'America/Boise',
                                    'America/Cambridge_Bay',
                                    'America/Campo_Grande',
                                    'America/Cancun',
                                    'America/Caracas',
                                    'America/Cayenne',
                                    'America/Cayman',
                                    'America/Chicago',
                                    'America/Chihuahua',
                                    'America/Costa_Rica',
                                    'America/Creston',
                                    'America/Cuiaba',
                                    'America/Curacao',
                                    'America/Danmarkshavn',
                                    'America/Dawson',
                                    'America/Dawson_Creek',
                                    'America/Denver',
                                    'America/Detroit',
                                    'America/Dominica',
                                    'America/Edmonton',
                                    'America/Eirunepe',
                                    'America/El_Salvador',
                                    'America/Fortaleza',
                                    'America/Glace_Bay',
                                    'America/Godthab',
                                    'America/Goose_Bay',
                                    'America/Grand_Turk',
                                    'America/Grenada',
                                    'America/Guadeloupe',
                                    'America/Guatemala',
                                    'America/Guayaquil',
                                    'America/Guyana',
                                    'America/Halifax',
                                    'America/Havana',
                                    'America/Hermosillo',
                                    'America/Indiana',
                                    'America/Indiana',
                                    'America/Indiana',
                                    'America/Indiana',
                                    'America/Indiana',
                                    'America/Indiana',
                                    'America/Indiana',
                                    'America/Indiana',
                                    'America/Inuvik',
                                    'America/Iqaluit',
                                    'America/Jamaica',
                                    'America/Juneau',
                                    'America/Kentucky',
                                    'America/Kentucky',
                                    'America/Kralendijk',
                                    'America/La_Paz',
                                    'America/Lima',
                                    'America/Los_Angeles',
                                    'America/Lower_Princes',
                                    'America/Maceio',
                                    'America/Managua',
                                    'America/Manaus',
                                    'America/Marigot',
                                    'America/Martinique',
                                    'America/Matamoros',
                                    'America/Mazatlan',
                                    'America/Menominee',
                                    'America/Merida',
                                    'America/Metlakatla',
                                    'America/Mexico_City',
                                    'America/Miquelon',
                                    'America/Moncton',
                                    'America/Monterrey',
                                    'America/Montevideo',
                                    'America/Montserrat',
                                    'America/Nassau',
                                    'America/New_York',
                                    'America/Nipigon',
                                    'America/Nome',
                                    'America/Noronha',
                                    'America/North_Dakota',
                                    'America/North_Dakota',
                                    'America/North_Dakota',
                                    'America/Ojinaga',
                                    'America/Panama',
                                    'America/Pangnirtung',
                                    'America/Paramaribo',
                                    'America/Phoenix',
                                    'America/Port',
                                    'America/Port_of_Spain',
                                    'America/Porto_Velho',
                                    'America/Puerto_Rico',
                                    'America/Rainy_River',
                                    'America/Rankin_Inlet',
                                    'America/Recife',
                                    'America/Regina',
                                    'America/Resolute',
                                    'America/Rio_Branco',
                                    'America/Santa_Isabel',
                                    'America/Santarem',
                                    'America/Santiago',
                                    'America/Santo_Domingo',
                                    'America/Sao_Paulo',
                                    'America/Scoresbysund',
                                    'America/Sitka',
                                    'America/St_Barthelemy',
                                    'America/St_Johns',
                                    'America/St_Kitts',
                                    'America/St_Lucia',
                                    'America/St_Thomas',
                                    'America/St_Vincent',
                                    'America/Swift_Current',
                                    'America/Tegucigalpa',
                                    'America/Thule',
                                    'America/Thunder_Bay',
                                    'America/Tijuana',
                                    'America/Toronto',
                                    'America/Tortola',
                                    'America/Vancouver',
                                    'America/Whitehorse',
                                    'America/Winnipeg',
                                    'America/Yakutat',
                                    'America/Yellowknife',
                                    'Antarctica/Casey',
                                    'Antarctica/Davis',
                                    'Antarctica/DumontDUrville',
                                    'Antarctica/Macquarie',
                                    'Antarctica/Mawson',
                                    'Antarctica/McMurdo',
                                    'Antarctica/Palmer',
                                    'Antarctica/Rothera',
                                    'Antarctica/Syowa',
                                    'Antarctica/Troll',
                                    'Antarctica/Vostok',
                                    'Arctic/Longyearbyen',
                                    'Asia/Aden',
                                    'Asia/Almaty',
                                    'Asia/Amman',
                                    'Asia/Anadyr',
                                    'Asia/Aqtau',
                                    'Asia/Aqtobe',
                                    'Asia/Ashgabat',
                                    'Asia/Baghdad',
                                    'Asia/Bahrain',
                                    'Asia/Baku',
                                    'Asia/Bangkok',
                                    'Asia/Beirut',
                                    'Asia/Bishkek',
                                    'Asia/Brunei',
                                    'Asia/Chita',
                                    'Asia/Choibalsan',
                                    'Asia/Colombo',
                                    'Asia/Damascus',
                                    'Asia/Dhaka',
                                    'Asia/Dili',
                                    'Asia/Dubai',
                                    'Asia/Dushanbe',
                                    'Asia/Gaza',
                                    'Asia/Hebron',
                                    'Asia/Ho_Chi_Minh',
                                    'Asia/Hong_Kong',
                                    'Asia/Hovd',
                                    'Asia/Irkutsk',
                                    'Asia/Jakarta',
                                    'Asia/Jayapura',
                                    'Asia/Jerusalem',
                                    'Asia/Kabul',
                                    'Asia/Kamchatka',
                                    'Asia/Karachi',
                                    'Asia/Kathmandu',
                                    'Asia/Khandyga',
                                    'Asia/Kolkata',
                                    'Asia/Krasnoyarsk',
                                    'Asia/Kuala_Lumpur',
                                    'Asia/Kuching',
                                    'Asia/Kuwait',
                                    'Asia/Macau',
                                    'Asia/Magadan',
                                    'Asia/Makassar',
                                    'Asia/Manila',
                                    'Asia/Muscat',
                                    'Asia/Nicosia',
                                    'Asia/Novokuznetsk',
                                    'Asia/Novosibirsk',
                                    'Asia/Omsk',
                                    'Asia/Oral',
                                    'Asia/Phnom_Penh',
                                    'Asia/Pontianak',
                                    'Asia/Pyongyang',
                                    'Asia/Qatar',
                                    'Asia/Qyzylorda',
                                    'Asia/Rangoon',
                                    'Asia/Riyadh',
                                    'Asia/Sakhalin',
                                    'Asia/Samarkand',
                                    'Asia/Seoul',
                                    'Asia/Shanghai',
                                    'Asia/Singapore',
                                    'Asia/Srednekolymsk',
                                    'Asia/Taipei',
                                    'Asia/Tashkent',
                                    'Asia/Tbilisi',
                                    'Asia/Tehran',
                                    'Asia/Thimphu',
                                    'Asia/Tokyo',
                                    'Asia/Ulaanbaatar',
                                    'Asia/Urumqi',
                                    'Asia/Ust',
                                    'Asia/Vientiane',
                                    'Asia/Vladivostok',
                                    'Asia/Yakutsk',
                                    'Asia/Yekaterinburg',
                                    'Asia/Yerevan',
                                    'Atlantic/Azores',
                                    'Atlantic/Bermuda',
                                    'Atlantic/Canary',
                                    'Atlantic/Cape_Verde',
                                    'Atlantic/Faroe',
                                    'Atlantic/Madeira',
                                    'Atlantic/Reykjavik',
                                    'Atlantic/South_Georgia',
                                    'Atlantic/St_Helena',
                                    'Atlantic/Stanley',
                                    'Australia/Adelaide',
                                    'Australia/Brisbane',
                                    'Australia/Broken_Hill',
                                    'Australia/Currie',
                                    'Australia/Darwin',
                                    'Australia/Eucla',
                                    'Australia/Hobart',
                                    'Australia/Lindeman',
                                    'Australia/Lord_Howe',
                                    'Australia/Melbourne',
                                    'Australia/Perth',
                                    'Australia/Sydney',
                                    'Europe/Amsterdam',
                                    'Europe/Andorra',
                                    'Europe/Athens',
                                    'Europe/Belgrade',
                                    'Europe/Berlin',
                                    'Europe/Bratislava',
                                    'Europe/Brussels',
                                    'Europe/Bucharest',
                                    'Europe/Budapest',
                                    'Europe/Busingen',
                                    'Europe/Chisinau',
                                    'Europe/Copenhagen',
                                    'Europe/Dublin',
                                    'Europe/Gibraltar',
                                    'Europe/Guernsey',
                                    'Europe/Helsinki',
                                    'Europe/Isle_of_Man',
                                    'Europe/Istanbul',
                                    'Europe/Jersey',
                                    'Europe/Kaliningrad',
                                    'Europe/Kiev',
                                    'Europe/Lisbon',
                                    'Europe/Ljubljana',
                                    'Europe/London',
                                    'Europe/Luxembourg',
                                    'Europe/Madrid',
                                    'Europe/Malta',
                                    'Europe/Mariehamn',
                                    'Europe/Minsk',
                                    'Europe/Monaco',
                                    'Europe/Moscow',
                                    'Europe/Oslo',
                                    'Europe/Paris',
                                    'Europe/Podgorica',
                                    'Europe/Prague',
                                    'Europe/Riga',
                                    'Europe/Rome',
                                    'Europe/Samara',
                                    'Europe/San_Marino',
                                    'Europe/Sarajevo',
                                    'Europe/Simferopol',
                                    'Europe/Skopje',
                                    'Europe/Sofia',
                                    'Europe/Stockholm',
                                    'Europe/Tallinn',
                                    'Europe/Tirane',
                                    'Europe/Uzhgorod',
                                    'Europe/Vaduz',
                                    'Europe/Vatican',
                                    'Europe/Vienna',
                                    'Europe/Vilnius',
                                    'Europe/Volgograd',
                                    'Europe/Warsaw',
                                    'Europe/Zagreb',
                                    'Europe/Zaporozhye',
                                    'Europe/Zurich',
                                    'Indian/Antananarivo',
                                    'Indian/Chagos',
                                    'Indian/Christmas',
                                    'Indian/Cocos',
                                    'Indian/Comoro',
                                    'Indian/Kerguelen',
                                    'Indian/Mahe',
                                    'Indian/Maldives',
                                    'Indian/Mauritius',
                                    'Indian/Mayotte',
                                    'Indian/Reunion',
                                    'Pacific/Apia',
                                    'Pacific/Auckland',
                                    'Pacific/Bougainville',
                                    'Pacific/Chatham',
                                    'Pacific/Chuuk',
                                    'Pacific/Easter',
                                    'Pacific/Efate',
                                    'Pacific/Enderbury',
                                    'Pacific/Fakaofo',
                                    'Pacific/Fiji',
                                    'Pacific/Funafuti',
                                    'Pacific/Galapagos',
                                    'Pacific/Gambier',
                                    'Pacific/Guadalcanal',
                                    'Pacific/Guam',
                                    'Pacific/Honolulu',
                                    'Pacific/Johnston',
                                    'Pacific/Kiritimati',
                                    'Pacific/Kosrae',
                                    'Pacific/Kwajalein',
                                    'Pacific/Majuro',
                                    'Pacific/Marquesas',
                                    'Pacific/Midway',
                                    'Pacific/Nauru',
                                    'Pacific/Niue',
                                    'Pacific/Norfolk',
                                    'Pacific/Noumea',
                                    'Pacific/Pago_Pago',
                                    'Pacific/Palau',
                                    'Pacific/Pitcairn',
                                    'Pacific/Pohnpei',
                                    'Pacific/Port_Moresby',
                                    'Pacific/Rarotonga',
                                    'Pacific/Saipan',
                                    'Pacific/Tahiti',
                                    'Pacific/Tarawa',
                                    'Pacific/Tongatapu',
                                    'Pacific/Wake',
                                    'Pacific/Wallis'
                                ]
                            }
                        }));
                        this.modal.setMod('visible', true);

                        window.socket.on('s-speaker:poem', this._sSpeakerPoem.bind(this));

                    }

                }

            },

            unbindEvents: function() {
                window.socket.removeAllListeners('s-speaker:poem');
            },

            _sSpeakerPoem: function(poem) {

                console.log(poem);

                this.currentPoem = poem;

                BEMDOM.update(this.elem('poem-text'), BEMHTML.apply([
                    {
                        block: 's-speaker',
                        elem: 'poem-title',
                        content: poem.name
                    },
                    {
                        tag: 'br'
                    },
                    poem.poem.map(function(item) {
                        var i = new Image;

                        i.src = item.imageUrl;

                        this.bm.addDocument({ id: item.line_num, body: item.line });

                        return [
                            {
                                block: 's-speaker',
                                elem: 'line',
                                mods: {
                                    num: item.line_num
                                },
                                content: item.line
                            },
                            item.nextEmpLine ? {
                                tag: 'br'
                            } : ''
                        ];
                    }.bind(this)),
                    {
                        tag: 'br'
                    },
                    {
                        block: 's-speaker',
                        elem: 'poem-author',
                        content: poem.author
                    }
                ]));


                ya.speechkit.recognize({
                    resultCallBackBuf: function(text) {
                        if (!text) {
                            return;
                        }
                        var num = this.bm.search(text);

                        if (typeof num === 'number' && num >= 0) {
                            console.log(num);
                            this._setImage(num + 1);
                        }

                        //console.log('here ' + text);
                    }.bind(this),
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


                this._setImage(0);

            },

            _getPoem: function(poemId) {
                this.bm = new BM25();
                window.socket.emit('s-speaker:get-poem', poemId);
            },

            _setImage: function(line) {

                if (line === this.currentLine) {
                    //return;
                }

                var v = this.elem('visualisation');
                this.currentLine = line;

                this.delMod(this.elem('line'), 'selected');

                if (line) {
                    this.setMod(this.elem('line', 'num', (line-1)), 'selected', 'yes');
                }

                /*
                if (!v.css('opacity')) {
                    v.css({
                        'background-image': 'url(' + this.currentPoem.poem[line].imageUrl + ')',
                        'background-size': 'contain',
                        'background-repeat': 'no-repeat',
                        'background-position': 'center'
                    });
                    v.animate({opacity: 1}, 500);
                } else {
                    v.animate({opacity: 0}, 500, function () {
                        v.css({
                            'background-image': 'url(' + this.currentPoem.poem[line].imageUrl + ')',
                            'background-size': 'contain',
                            'background-repeat': 'no-repeat',
                            'background-position': 'center'
                        });
                        v.animate({opacity: 1}, 500);
                    }.bind(this));
                }
                */

                return this;
            },

            _onPointerClick: function(e) {
                var num = +this.getMod($(e.currentTarget), 'num');

                this._setImage(num + 1);

                return this;
            },

            _destruct: function() {
                this.unbindEvents();
                this.__base.apply(this, arguments);
            }

        }, {
            live: function() {

                this
                    .liveBindTo('line', 'mouseover pointerclick', function (e) {
                        this._onPointerClick(e);
                    })
                    .liveBindTo('line', 'mouseout', function (e) {
                        this.delMod(this.elem('line'), 'selected');
                    });

                return false;
            }
        }));
    }
);
