# Glowworm
Glowworm is a 3D LED mapping software.
It runs on Windows, MacOS and Linux.

[![Glowworm demo video](https://i.vimeocdn.com/video/808213767.jpg)](https://vimeo.com/350381548)

## Precompiled binaries
Precompiled binaries for Windows, MacOS and Linux can be found in the [dist](https://github.com/Braunbart/glowworm/tree/master/dist) directory or under the [releases](https://github.com/Braunbart/glowworm/releases) tab.


## Development setup
First install Node.js and Python 2 (if thy aren't installed already). Then clone the project and open it's folder in your terminal. From there run the following commands:

### Install required dependencies
```
npm install
```

### Compile and hot-reload for development
On Linux:
```
npm run dev
```

On Windows:
```
npm run start:vue
npm run start:electron
```

### Compile and minify for production
```
npm run build
```

### Build the app into an executable
```
npm run dist
```
