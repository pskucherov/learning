# Learning

### Установка
```sh
git clone https://github.com/pskucherov/learning
npm i
```

### Запуск
```sh
npm start
```
Если собралось и запустилось без ошибок, то сайт будет доступен по адресу: <http://localhost:3000>

### База данных

Тестовая база данных расположена на удалённом сервере. Параметры для подключения уже прописаны в конфиге.
Так как база для разработки является общей, не нужно рассчитывать, что в ней будет что-то долго храниться.

Так как изначально использовался orm для mysql, после чего мигрировали на mongodb — часть новых методов orm не поддерживает,
в следствии чего пришлось дописать в API проксирующий метод, который пробрасывает запрос из orm напрямую в БД.
https://github.com/pskucherov/node-orm2/pull/1/files

Синхронизация моделей, данных в БД
```sh
node common.blocks/app/models/sync.js
```

###### Технологии
* [Orm]:  Object Relational Mapping 
* [MongoDb]: ...

### Тестирование
Запускаем тесты командой
```sh
npm test
```

Посмотреть покрытие контроллеров юнит-тестами
```sh
mocha test/unit/* --delay --require blanket --reporter html-cov  > coverage.html && open coverage.html
```

###### Unit тесты
* [Mocha]: Фреймворк для тестирования на nodejs
* [Chai]: BDD / TDD assertion library
* [Chai as Promised]: расширение [Chai], для асинхронного тестирования

### Lodash

Кастомная сборка:
```sh
npm install lodash-cli -g && \
cd common.blocks/i-lodash/ && \
lodash include=isEmpty,get,assign,forEach,isUndefined,defaultsDeep,debounce,pick,map,trim,every,shuffle -p && \
mv lodash.custom.min.js i-lodash.js
```

### JQuery UI

Кастомная сборка:
```
Desktop:
http://jqueryui.com/download/#!version=1.11.4&components=1110100000000000000000000000000000000
jquery-ui.js -> common.blocks/i-jquery/__ui/i-jquery__ui.js

+ Touch Punch:
https://github.com/furf/jquery-ui-touch-punch/blob/8f7559b6e65cdc3ee3648d5fe76d38c653f87ff5/jquery.ui.touch-punch.js
jquery.ui.touch-punch.js -> common.blocks/i-jquery/__ui/_touch/i-jquery__ui_touch.js
```

[issue в orm]: <https://github.com/dresende/node-orm2/issues/524>
[Orm]: <http://dresende.github.io/node-orm2/>
[MongoDb]: <https://docs.mongodb.com/manual/>
[Mocha]: <http://mochajs.org/>
[Chai]: <http://chaijs.com/api/assert/>
[Chai as Promised]: <https://github.com/domenic/chai-as-promised>
