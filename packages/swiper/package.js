Package.describe({
    name: 'dg:swiper',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.8.0.2');
    api.use('ecmascript');
    api.use(['templating'], 'client');

    api.addFiles([
        'swiper.js',
        '.npm/package/node_modules/swiper/dist/css/swiper.css',
    ], 'client');

    //api.mainModule('swiper.js');
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('dg:swiper');
    api.mainModule('swiper-tests.js');
});


Npm.depends({
    'swiper': '4.5.0',
});