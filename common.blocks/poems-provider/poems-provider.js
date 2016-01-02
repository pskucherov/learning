// TODO: переименовать poems-provider, в database-provider
modules.define(
    'poems-provider',
    ['inherit', 'vow', 'sg-dataprovider', 'poems-provider__storage'],
    function(provide, inherit, vow, DataProvider, PoemsStorage) {

        provide(inherit(DataProvider, {
            __constructor: function (data) {
                this.__base.apply(this, arguments);
                this._storage = new PoemsStorage(data);
            },

            /** @override */
            _getData: function (params) {
                //var query = this._buildQuery(params.val);
                var deferred = vow.defer();

                if (!_.isEmpty(params.val)) {
                    this._storage.find(params, function (err, data) {
                        err ? deferred.reject(err) : deferred.resolve(data);
                    });
                } else {
                    deferred.resolve([]);
                }

                return deferred.promise();
            },

            _buildQuery: function (val) {
                if (!val.length) return null;
                return [new RegExp('^' + val + '', 'i'), val];
            }
        }));

    }
);
