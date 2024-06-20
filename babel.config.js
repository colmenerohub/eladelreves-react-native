module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    alias: {
                        src: './src',
                        '@assets': './assets',
                        '@components': './src/components',
                        '@helpers': './src/helpers',
                        '@hooks': './src/hooks',
                        '@nav': './src/nav',
                        '@screens': './src/screens',
                        '@contexts': './src/contexts',
                        '@services': './src/services',
                        '@themes': './src/themes',
                        '@utils': './src/utils',
                        '@config': './src/config',
                    },
                },
            ],
        ],

    };
};
