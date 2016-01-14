angular.module('mean.system').config(['$stateProvider', 'utilsconfig', function ($stateProvider, utilsconfig ) {
        $stateProvider.decorator('views', function (state, parent) {
            var result = {},
                views = parent(state);
            angular.forEach(views, function (config, name) {
                if (!!utilsconfig.overrides && !!utilsconfig.overrides[config.templateUrl]) {
                    config.templateUrl = utilsconfig.overrides[config.templateUrl];
                }
                result[name] = config;
            });
            return result;
        });
    }]
);
