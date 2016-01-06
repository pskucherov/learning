# Learning

### Установка
```sh
git clone https://github.com/phpprog/learning
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

Была возможность заиспользовать модуль подключения orm к express из коробки, но такая схема не подошла для тестов,
из-за чего переписал всё на ручное подключение. По мотивам [issue в orm].

Синхронизация моделей, данных в БД
```sh
node common.blocks/app/models/sync.js
```

###### Технологии
* [Orm]:  Object Relational Mapping 
* [MySQL]: Единственное, что сподвигло использовать MySQL — быстрая настройка на удалённом сервере + [phpMyAdmin]
* [phpMyAdmin]: Возможность посмотреть, как выглядит БД и потыкать на разные кнопочки — иногда бесценно

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
lodash include=isEmpty,get,assign,forEach,isUndefined,defaultsDeep,debounce,pick,map,trim,every -p && \
mv lodash.custom.min.js i-lodash.js
```

[issue в orm]: <https://github.com/dresende/node-orm2/issues/524>
[Orm]: <http://dresende.github.io/node-orm2/>
[MySQL]: <http://www.mysql.com/>
[phpMyAdmin]: <http://77.120.103.67/myadmin/>
[Mocha]: <http://mochajs.org/>
[Chai]: <http://chaijs.com/api/assert/>
[Chai as Promised]: <https://github.com/domenic/chai-as-promised>
