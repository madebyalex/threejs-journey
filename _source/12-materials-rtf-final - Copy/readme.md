# Three.js Journey

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

## REACT THREE FIBER Additions

### Package.json changes

```
npm i react react-dom react-three-fiber @babel/preset-react
```
"babel": {
      "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
    ]
  },

  ### Webpack.common changes

entry: path.resolve(__dirname, '../src/index.jsx'),

resolve: {
    extensions: ['.js', '.jsx'], // allows webpack to resolve .jsx files
},

// JS
{
    test: /\.(js|jsx)$/,
    exclude: /node_modules/, // updated to allow for jsx
    use:
    [
        'babel-loader'
    ]
},
