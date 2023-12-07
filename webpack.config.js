const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        login: './src/index.js', // Path to the entry file for the login page
        signUp: './src/signUp.js',
        userProfile: './src/userProfile.js',
        messaging: './src/messaging.js' // Path to the entry file for the messaging page
        // Add more entry points for other pages as needed
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js' // This will create individual bundles for each entry
    },
    watch: true
    // Include any other configurations like loaders, plugins, etc.
};
