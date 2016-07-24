let path = require('path'),
    fs = require('fs'),
    vk = require('./controllers/vk'),
    _ = require('lodash'),
    settings = require('./settings'),
    models = require('./models');

models((err, db) => {
    let promises = [];

    // Сбор данных про конкурс репостов из группы в ВК
    vk.request('wall.get', {
        owner_id: '-' + settings.vk.groupId,
        count: 100,
        offset: 1000
    }, getWallPasts.bind(this, 0));

    /**
     * Получаем данные из ВК, если есть ещё — создаём рекурсивный запрос.
     *
     * @param offset
     * @param posts
     * @returns {boolean}
     */
    function getWallPasts(offset, posts) {
        offset || (offset = 0);

        let respons = posts && posts.response;

        // Если в данных нет нужных параметров — закрываем соединение и выходим
        if (!respons || !respons.count || !respons.items || !respons.items.length) {
            closeDb(promises);
        }

        // Сохраняем данные о постах в БД
        _.forEach(respons.items, (item) => {
            saveWallPosts(item);
        });

        offset += respons.items.length;

        // Если есть ещё посты — делаем запрос, иначе закрываем соединение и выходим
        if (offset < respons.count) {
            vk.request('wall.get', { owner_id: '-83561592', count: 100, offset: offset }, getWallPasts.bind(this, offset));
        } else {
            closeDb(promises);
        }
    }

    /**
     * Создаём в базе запись с параметрами поста,
     * если запись об этом посте есть в бд, то обновляем запись.
     *
     * @param post
     */
    function saveWallPosts(post) {

        promises.push(new Promise((resolve, reject) => {
            db.models['vk-group-wall'].find({post_id: post.id}).limit(1).run((err, data) => {
                if (err) throw err;

                let postData = {
                    post: post,
                    post_id: post.id,
                    from_id: post.from_id,
                    date: post.date,
                    commentsCount: post.comments.count,
                    repostsCount: post.likes.count,
                    likeCount: post.reposts.count
                };

                if (_.isEmpty(data)) {
                    db.models['vk-group-wall'].create(postData, () => {
                        resolve();
                    });
                } else {
                    _.forEach(postData, (val, key) => {
                        data[0][key] = val;
                    });
                    data[0].save(() => {
                        resolve();
                    });
                }

            });
        }));

    }

    /**
     * Закрываем соединение с базой, чтобы скрипт завершил работу.
     * Иначе он подвиснет и его придётся закрывать руками.
     *
     * @param promises
     */
    function closeDb(promises) {
        Promise
            .all(promises)
            .then(function() {
                db.close();
            });
    }
});
