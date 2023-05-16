const { compile } = require('nexe')
// SOURCE: https://github.com/nexe/nexe
compile({
    input: './server/server.js',
    output: './server/react-spotify.exe',
    name: 'react-spotify',
    build: true, //required to use patches
    // ico: '', //path requires --build to be set
    // patches: [
    //     async (compiler, next) => {
    //     await compiler.setFileContentsAsync(
    //         'lib/new-native-module.js',
    //         'module.exports = 42'
    //     )
    //     return next()
    //     }
    // ]
    // snapshot: 'server.exe',
    rc: {
        FileDescription: "React Spotify API Server(RSAS)",
        CompanyName: "Friendly Neighborhood Geeks, LLC",
        FileVersion: "0,0,0,7"
        // CompanyName", "Node.js"
        // ProductName", "Node.js"
        // FileDescription", "Node.js JavaScript Runtime"
        // FileVersion", NODE_EXE_VERSION
        // ProductVersion", NODE_EXE_VERSION
        // OriginalFilename", "node.exe"
        // InternalName", "node"
        // LegalCopyright", "Copyright Node.js contributors. MIT license."
    },
    verbose: false // used for error details
}).then(() => {
  console.log('success')
})