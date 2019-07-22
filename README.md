# Glowworm
Glowworm is a 3D LED mapping software.
It runs on Windows, MacOS and Linux.


## Precompiled binaries
Precompiled binaries for Windows, MacOS and Linux can be found in the dist directory.


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