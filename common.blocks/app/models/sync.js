var path = require('path'),
    models = require(path.resolve('./common.blocks/app/models/index')),
    _ = require('lodash'),
    BM25 = require('fts-js');


models(function (err, db) {

    //db.drop(function() {

        db.sync(function (err) {
            if (err) throw err;

            db.models.subjects.find({id: 1}).limit(1).run(function (err, subj) {

                if (_.isEmpty(subj)) {

                    db.models.subjects.create([
                        {name: 'Английский язык'},
                        {name: 'Биология'},
                        {name: 'География'},
                        {name: 'ИЗО'},
                        {name: 'Информатика'},
                        {name: 'История'},
                        {name: 'Литература'},
                        {name: 'Математика'},
                        {name: 'Музыка'},
                        {name: 'Немецкий язык'},
                        {name: 'ОБЖ'},
                        {name: 'Обществознание'},
                        {name: 'Окружающий мир'},
                        {name: 'ОРКСЭ'},
                        {name: 'Русский язык'},
                        {name: 'Технология'},
                        {name: 'Физика'},
                        {name: 'Физкультура'},
                        {name: 'Химия'}
                    ], function (err) {
                        err && console.log("\n\n\ err ", err);
                    });
                }

            });

            db.models['brain-tests'].find({id: 1}).limit(1).run(function (err, tests) {

                if (_.isEmpty(tests)) {

                    db.models['brain-tests'].create([
                        {
                            id: 1,
                            class: 10,
                            name: 'Тест по географии, 10 - 11 класс',
                            descr: 'Тест содержит вопросы, которые могут встретиться при тестировании на экзамене. Тест можно использовать на уроке во время повторения пройденного материала в 10 - 11 классах. За основу взяты вопросы для подготовки к тестированию. В тесте 14 вопросов, даются',
                            question: 'Земная поверхность более правильно изображена на',
                            answers: 'Глобусе||Физической карте||Политической карте||Экономической карте||Топографической карте',
                            rightanswernum: 0,
                            subj_id: 3
                        },
                        {
                            id: 2,
                            class: 10,
                            name: 'Die berьhmten Persцnlichkeiten',
                            descr: 'Landeskunde. 10-11 Klasse',
                            question: 'Der Familienname von zwei Brьdern - weltbekannten Gelehrten, einer war Naturforscher, der andere Sprachwissenschaftler.',
                            answers: 'Humbolt||Grimm||Mann',
                            rightanswernum: 0,
                            subj_id: 10
                        },
                        {
                            id: 3,
                            class: 10,
                            name: 'Multy chose',
                            descr: 'тест на множественный выбор',
                            question: 'They are ... dolphins.',
                            answers: '-||a||an||the||a few',
                            rightanswernum: 0,
                            subj_id: 1
                        },
                        {
                            id: 4,
                            class: 1,
                            name: 'Живая и неживая природа',
                            descr: 'Проверка знаний по теме: "Живая и неживая природа"',
                            question: 'Какое выражение правильно? природой называют всё то, ...',
                            answers: 'Что сделано руками человека;||Что окружает человека и не сделано его руками.||Что окружает человека;',
                            rightanswernum: 1,
                            subj_id: 13
                        },
                        {
                            id: 5,
                            class: 10,
                            name: 'Аминокислоты. Вариант 1.',
                            descr: 'Итоговый тест для подготовки к ГИА и ЕГЭ. Из предложенных вариантов ответов выбрать только один правильный.',
                            question: 'Сложные органические вещества, содержащие в своем составе одновременно амино- и карбоксильную группы называют:',
                            answers: 'сложными эфирами||альдолями||ацеталями||аминокислотами',
                            rightanswernum: 3,
                            subj_id: 2
                        },
                        {
                            id: 6,
                            class: 11,
                            name: 'ЕГЭ по истории часть А',
                            descr: 'часть А',
                            question: 'К какому году относится крещение Руси?',
                            answers: '882||988||945||962',
                            rightanswernum: 1,
                            subj_id: 6
                        },
                        {
                            id: 7,
                            class: 4,
                            name: 'Бог, Человек и Молитва',
                            descr: 'Весь путь человеческого развития - есть стремление познать бога.',
                            question: 'Кто родители Иисуса',
                            answers: 'Закхей и Руфь||Авраам и Сарра||Исаак и Ревека||Иосиф и Мария',
                            rightanswernum: 3,
                            subj_id: 14
                        },
                        {
                            id: 8,
                            class: 1,
                            name: 'Сколько слогов в слове?',
                            descr: 'Проверить навыки определения количества слогов в слове.',
                            question: 'Сколько слогов в слове?\r\n<bR>\r\n<a href="http://radikall.com/ZW2d" target="_blank"><img src="http://radikall.com/images/2014/04/05/BGyev.th.png" border="0" alt="Radikal" /></a>',
                            answers: '1||2||3||4',
                            rightanswernum: 2,
                            subj_id: 15
                        },
                        {
                            id: 9,
                            class: 11,
                            name: 'Вокал',
                            descr: 'Выражаем благодарность Виктории Полшковой за корректировку теста',
                            question: 'Какой из этих терминов не имеет отношения к вокалу?',
                            answers: 'Детонация||Пиццикато||Глиссандо||Мордент',
                            rightanswernum: 1,
                            subj_id: 9
                        },
                        {
                            id: 10,
                            class: 1,
                            name: 'Задачи на разностное сравнение',
                            descr: 'Проверка умения решать задачи на разностное сравнение',
                            question: 'Выбери правильный ответ.',
                            answers: 'Чтобы узнать, на сколько одно число больше или меньше другого, надо из большего числа вычесть меньшее.||Чтобы узнать, на сколько одно число больше или меньше другого, надо к большему числу прибавить меньшее.',
                            rightanswernum: 0,
                            subj_id: 8
                        },
                        {
                            id: 11,
                            class: 10,
                            name: 'Основы термодинамики 10 класс',
                            descr: 'Итоговый тест термодинамика',
                            question: 'Внутреннюю   энергию   системы  можно   изменить (выберите наиболее точное продолжение фразы',
                            answers: 'Только путем совершения работы||Только путем теплопередачи||Путем совершения работы и теплопередачи||Среди ответов нет правильного.',
                            rightanswernum: 2,
                            subj_id: 17
                        },
                        {
                            id: 12,
                            class: 10,
                            name: 'Химическое равновесие №2',
                            descr: 'Химическое равновесие',
                            question: 'Как повлияют на равновесие  увеличение молярной концентрации  хлороводорода \r\n<bR>\r\n4НСl(г) + О2(г)  =2Н2О(г) + 2Сl 2(г) + Q?',
                            answers: 'невозможно предсказать;||равновесие сместиться в сторону прямой реакции;||равновесие сместиться в сторону обратной реакции;||равновесие не сместиться.',
                            rightanswernum: 1,
                            subj_id: 19
                        },
                        {
                            id: 13,
                            class: 11,
                            name: 'Тест "Политическое поведение" 2 вариант',
                            descr: 'Тематический  тест',
                            question: '7. Среди правовых норм, регулирующих деятельность субъектов политики в современном демократическом государстве, наиболее важными являются:',
                            answers: 'нормы постановлений правительства||нормы указов президента||нормы конституции и базирующиеся на них нормы законов',
                            rightanswernum: 2,
                            subj_id: 12
                        },
                        {
                            id: 14,
                            class: 1,
                            name: 'Тест по Правилам дорожного движения',
                            descr: 'Данный тест позволит проверить знания учащихся по Правилам дорожного движения.',
                            question: 'Кого называют пешеходом?',
                            answers: 'Человек вне транспорта, находящийся на дороге, но не работающий на ней.||Человек вне транспорта, находящийся на дороге.||Человек внутри транспорта.',
                            rightanswernum: 0,
                            subj_id: 11
                        },
                        {
                            id: 15,
                            class: 10,
                            name: '"Искусство народов доколумбовой Америки"',
                            descr: 'Тест по МХК 10 класс "Искусство народов доколумбовой Америки"',
                            question: 'Древнейшей цивилизацией доколумбовой Америки является:\r\n<bR>',
                            answers: 'цивилизация ольмеков;||инков;||майя;||ацтеков.',
                            rightanswernum: 0,
                            subj_id: 4
                        },
                        {
                            id: 16,
                            class: 10,
                            name: 'Информация',
                            descr: 'Тест по информатике',
                            question: 'Информация-это...',
                            answers: 'То что нас окружает||Погодные явления||Сведения об окружающем нас мире||Преобразование графической информации',
                            rightanswernum: 2,
                            subj_id: 5
                        },
                        {
                            id: 17,
                            class: 1,
                            name: 'Доброта',
                            descr: 'Викторина на тему "Доброта"',
                            question: 'Как звали злую старушку, которая пела: "Кто людям помогает, тот тратит время зря"?',
                            answers: 'Снежная королева||Домоправительница||Шапокляк',
                            rightanswernum: 2,
                            subj_id: 7
                        },
                        {
                            id: 18,
                            class: 1,
                            name: 'Доброта',
                            descr: 'Викторина на тему "Доброта"',
                            question: 'Как звали злую старушку, которая пела: "Кто людям помогает, тот тратит время зря"?',
                            answers: 'Снежная королева||Домоправительница||Шапокляк',
                            rightanswernum: 2,
                            subj_id: 7
                        },
                        {
                            id: 19,
                            class: 10,
                            name: 'Аминокислоты. Вариант 1.',
                            descr: 'Итоговый тест для подготовки к ГИА и ЕГЭ. Из предложенных вариантов ответов выбрать только один правильный.',
                            question: 'Сложные органические вещества, содержащие в своем составе одновременно амино- и карбоксильную группы называют:',
                            answers: 'сложными эфирами||альдолями||ацеталями||аминокислотами',
                            rightanswernum: 3,
                            subj_id: 2
                        },
                        {
                            id: 20,
                            class: 8,
                            name: 'Мочевыделительная система',
                            descr: 'Строение и функции мочевыделительной системы',
                            question: 'Как называется орган, который служит для удаления мочи из организма?',
                            answers: 'мочевой пузырь||мочеточник||мочеиспускательный канал||аппендикс',
                            rightanswernum: 2,
                            subj_id: 2
                        },
                        {
                            id: 21,
                            class: 4,
                            name: 'Отечественная Война 1812 года',
                            descr: 'Отечественная Война 1812 года',
                            question: 'Кому перешло управление государством в начале 19 века?',
                            answers: 'Екатерине Великой||Императору Александру Первому||Петру Первому',
                            rightanswernum: 1,
                            subj_id: 6
                        },
                        {
                            id: 22,
                            class: 2,
                            name: 'Артикли',
                            descr: 'Поставьте неопределенный артикль',
                            question: '...tiger',
                            answers: 'an||a',
                            rightanswernum: 1,
                            subj_id: 1
                        },
                        {
                            id: 23,
                            class: 11,
                            name: 'Учение Ч. Дарвина.',
                            descr: 'Учение Ч. Дарвина и его развитие. Предпосылки учения: ламаркизм.',
                            question: 'Из перечисленных организмов НЕ может эволюционировать:',
                            answers: 'самка пчелы||пчелы в улье||пара голубей||лабораторная колония бактерий',
                            rightanswernum: 0,
                            subj_id: 2
                        },
                        {
                            id: 24,
                            class: 6,
                            name: 'Почвенное питание растений',
                            descr: 'Выберите один верный ответ. "5" ставится, если вы набрали не менее 90%',
                            question: 'процесс получения воды и минеральных солей растением из почвы с помощью корней - это...',
                            answers: 'гетеротроф||фотосинтез||почвенное питание||воздушное питание',
                            rightanswernum: 2,
                            subj_id: 2
                        },
                        {
                            id: 25,
                            class: 9,
                            name: 'Этапы развития жизни на Земле',
                            descr: 'Этапы развития жизни на Земле',
                            question: 'Как называется наибольшая единица геологического летоисчисления?',
                            answers: 'эпоха||период||эра||век',
                            rightanswernum: 2,
                            subj_id: 2
                        },
                        {
                            id: 26,
                            class: 3,
                            name: 'Власть и народ Российской империи',
                            descr: 'Тест к уроку "Власть и народ Российской империи"',
                            question: 'В каком веке правила Екатерина Вторая?',
                            answers: 'в XVIII веке||в XVII веке||в XIX веке',
                            rightanswernum: 0,
                            subj_id: 6
                        },
                        {
                            id: 27,
                            class: 7,
                            name: 'Итоговый за 1 полугодие по биологии 7 класса',
                            descr: 'Общие вопросы за первое полугодие.',
                            question: 'Наука изучающая животных',
                            answers: 'Зоология||Морфология||Анатомия||Экология',
                            rightanswernum: 0,
                            subj_id: 2
                        },
                        {
                            id: 28,
                            class: 5,
                            name: 'Растения',
                            descr: 'Академик К.А.Тимирязев писал – «Растение – посредник между небом и Землёй. Оно поистине Прометей, похитивший огонь с неба. Похищенный им луч солнца приводит в движение и чудовищный маховик гигантской паровой машины и кисть художника, и перо поэта». Как',
                            question: 'Растения растущие сами по себе в природе.',
                            answers: 'культурные||дикорастущие||светолюбивые',
                            rightanswernum: 1,
                            subj_id: 2
                        }
                    ], function (err) {
                        err && console.log("\n\n\ err ", err);
                    });


                    db.models['poems'].find({id: 1}).limit(1).run(function (err, poems) {
                        if (_.isEmpty(poems)) {
                            db.models['poems'].create([
                                {
                                    id: 1,
                                    name: 'Осень',
                                    author: 'С. А. Есенин',
                                    class: 0,
                                    userId: 1
                                }
                            ], function (err) {
                                err && console.log("\n\n\ err ", err);
                            });

                            var lines = [
                                'Тихо в чаще можжевеля по обрыву.',
                                'Осень, рыжая кобыла, чешет гриву.',
                                'Над речным покровом берегов',
                                'Слышен синий лязг ее подков.',
                                'Схимник-ветер шагом осторожным',
                                'Мнет листву по выступам дорожным',
                                'И целует на рябиновом кусту',
                                'Язвы красные незримому Христу.'
                            ];

                            db.models['poem-text'].create([
                                {
                                    id: 1,
                                    line_num: 0,
                                    line: lines[0],
                                    'fts-tokens': JSON.stringify(BM25.Tokenize(lines[0])),
                                    imageUrl: 'https://im2-tub-ru.yandex.net/i?id=c8202e77d14c1983c9ea116b1b679987&n=13',
                                    nextEmpLine: false,
                                    poem_id: 1
                                },
                                {
                                    id: 2,
                                    line_num: 1,
                                    line: lines[1],
                                    'fts-tokens': JSON.stringify(BM25.Tokenize(lines[1])),
                                    imageUrl: 'https://avatars.yandex.net/get-images-search/keWT4CGsPPPhXgZ-qR_9TQ/preview',
                                    nextEmpLine: true,
                                    poem_id: 1
                                },
                                {
                                    id: 3,
                                    line_num: 2,
                                    line: lines[2],
                                    'fts-tokens': JSON.stringify(BM25.Tokenize(lines[2])),
                                    imageUrl: 'https://im1-tub-ru.yandex.net/i?id=f87931288ac819a4bfadfd1c270548bc&n=13',
                                    nextEmpLine: false,
                                    poem_id: 1
                                },
                                {
                                    id: 4,
                                    line_num: 3,
                                    line: lines[3],
                                    'fts-tokens': JSON.stringify(BM25.Tokenize(lines[3])),
                                    imageUrl: 'http://www.stihi.ru/pics/2013/09/13/820.jpg',
                                    nextEmpLine: true,
                                    poem_id: 1
                                },


                                {
                                    id: 5,
                                    line_num: 4,
                                    line: lines[4],
                                    'fts-tokens': JSON.stringify(BM25.Tokenize(lines[4])),
                                    imageUrl: 'http://rilmark.ru/catalog/20141005/20141005:965-167-341/855f1deaf55e4daf14e65655ae2feafe-download.jpg',
                                    nextEmpLine: false,
                                    poem_id: 1
                                },
                                {
                                    id: 6,
                                    line_num: 5,
                                    line: lines[5],
                                    'fts-tokens': JSON.stringify(BM25.Tokenize(lines[5])),
                                    imageUrl: 'http://cs403626.vk.me/v403626094/296c/vfYY72ekDP4.jpg',
                                    nextEmpLine: true,
                                    poem_id: 1
                                },
                                {
                                    id: 7,
                                    line_num: 6,
                                    line: lines[6],
                                    'fts-tokens': JSON.stringify(BM25.Tokenize(lines[6])),
                                    imageUrl: 'http://www.stihi.ru/pics/2013/10/23/6605.jpg',
                                    nextEmpLine: false,
                                    poem_id: 1
                                },
                                {
                                    id: 8,
                                    line_num: 7,
                                    line: lines[7],
                                    'fts-tokens': JSON.stringify(BM25.Tokenize(lines[7])),
                                    imageUrl: 'http://www.supwom.ru/uploads/posts/2011-01/1294991868_7e71ca3e0b76f481174ce5baf49fd269_big.jpg',
                                    nextEmpLine: false,
                                    poem_id: 1
                                }
                            ], function (err) {
                                err && console.log("\n\n\ err ", err);
                            });
                        }
                    });

                }

            });


        });

    //});

});
