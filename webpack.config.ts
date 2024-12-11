import * as path from "path";
import {Configuration} from "webpack";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin"; // Import the NodePolyfillPlugin

// Webpack Configuration
const webpackConfig: Configuration = {
  // Entry point
  entry: "./src/index.tsx",

  // Output configuration
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },

  // Resolve modules and polyfill missing Node.js modules
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    fallback: {
      url: require.resolve("url/"), // Polyfill for 'url' module
      util: require.resolve("util/"), // Polyfill for 'util' module
      buffer: require.resolve("buffer/"), // Polyfill for 'buffer' module
      assert: require.resolve("assert/"), // Polyfill for 'assert' module
      stream: require.resolve("stream-browserify"), // Polyfill for 'stream' module
      // Disable node:test if not needed
      test: false,
    },
  },

  // Module rules
  module: {
    rules: [
      {
        test: /\.tsx?$/, // TypeScript files
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/, // JavaScript files
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/, // CSS files
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  // Development server configuration
  devServer: {
    static: path.join(__dirname, "public"),
    port: 3000,
    open: true,
    hot: true,
  },

  // Development mode
  mode: "development",

  // Plugins section
  plugins: [
    new NodePolyfillPlugin(), // Add the polyfill plugin here
  ],
};

export default webpackConfig;
