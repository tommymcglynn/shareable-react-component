# Create Shareable React Component as NPM Module

React has become a popular way to build a complex UI made up of many discrete components. Components are great because they organize responsibility into reusable and sharable blocks of code. One way to share React components across any number of apps is by publishing them in an NPM module. This article will walk through the process of building a simple React component that is published to NPM and can be easily implemented in other apps.

[Source code for completed project](https://github.com/tommymcglynn/shareable-react-component)

## Table of Contents
* [Project Structure](#project-structure)
* [Create Component](#create-component)
* [Create Sample App](#create-sample-app)
* [Bundling with Webpack](#bundling-with-webpack)
* [Publish to NPM](#publish-to-npm)

## Project Structure
Start by creating a new folder for this project. You should use your own name instead of "shareable-react-component". If you actually publish this project to npm, the name will need to be unique.

    mkdir shareable-react-component
    cd shareable-react-component

The main pieces of this project will be source code, transpiled code, configuration files and a sample app where we can see the component in action. Here is the folder structure:

    shareable-react-component
    │   (source code and configuration files)
    │
    └───dist
    │   │   (transpiled source code)
    │   
    └───dist-sample
        │   (sample app)

You can create the required directories.

    mkdir dist
    mkdir dist-sample

## Create Component
We'll use npm to install dependencies and ultimately publish the component as a shareable module. If you don't have npm already, see [Get npm](https://www.npmjs.com/get-npm). Then initialize npm for this project.

    // inside project folder
    npm init -y

Then install React dependencies.

    npm install --save react react-dom

Now we’ll create a simple React component called “MyComponent.js” in the project folder. Here is what it looks like:

    var React = require('react');

    export default class MyComponent extends React.Component {

        render() {
            return (
                <div>
                    <h1>Hello React Component!</h1>
                </div>
            );
        }
    }

This is the basic structure of a React component. It will simply render a div containing an h1 element. Of course, components can be much more powerful than this but I'll focus on the process of publishing and sharing a component. If you want to learn more about React components, [go here](https://reactjs.org/docs/react-component.html).

## Create Sample App
We'll now create a sample app so we can see the component in action. Create a "sample-app.js" in the project folder.

    import React from 'react';
    import ReactDOM from 'react-dom';
    import MyComponent from "./MyComponent";

    const root = (
        <div>
            <MyComponent />
        </div>
    );

    ReactDOM.render(
        root,
        document.getElementById('app')
    );

This creates a root element div that contains the "MyComponent" and renders it inside the "app" DOM element. We'll create the "app" element in a simple html file "index.html" inside "dist-sample".

    <!DOCTYPE html>
    <html>
    <head>
        <title>My React Component</title>
    </head>
    <body>
    <div id="app"></div>
    <script src="/bundle.js"></script>
    </body>
    </html>

When the sample app runs, it will serve the "index.html" file and load "bundle.js" which contains the code from "sample-app.js" which will ultimately render the React component. The next section will describe how we generate "bundle.js".

## Bundling with Webpack
We'll use Webpack for a couple reasons.
    * It will transpile our code. We want to transpile because the project uses ES6 style Javascript which is not yet fully supported in all browsers and environments. Transpiling will convert all of the ES6 source into ES5 code.
    * It will create a local dev server that is capable of serving the React sample app so we can try out the component.

Let's install Webpack dependencies.

    npm install --save-dev babel-cli babel-core babel-loader babel-preset-env babel-preset-react webpack webpack-cli webpack-dev-server

Now we'll create a Webpack configuration "sample-webpack.config.js" in the project folder.

    module.exports = {
        entry: [
            './sample-app.js'
        ],
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                "env",
                                "react"
                            ]
                        }
                    }
                }
            ]
        },
        resolve: {
            extensions: ['*', '.js', '.jsx']
        },
        output: {
            path: __dirname + '/dist-sample',
            publicPath: '/',
            filename: 'bundle.js'
        },
        devServer: {
            contentBase: './dist-sample'
        }
    };

This tells Webpack the entry point for the sample app "./sample-app.js". It also says which file types to include and how to load/transpile those files. We're using babel to transpile ES6 Javascript to more widely supported ES5. Learn more about [babel here](https://github.com/babel/babel-loader). Then it says to place the bundled code into "/dist-sample" and serve it from the local dev server. You can also learn more about [Webpack Configuration here](https://webpack.js.org/concepts/configuration/).

Now we need a way to run the Webpack dev server. To handle this, we'll create an npm script in "package.json".

    "scripts": {
        ...
        "start": "webpack-dev-server --config ./sample-webpack.config.js --mode development"
    }

You can start the dev server and view the sample app, using the following command.

    npm run start

Then open http://localhost:8080 in your browser. If port 8080 is already in-use, the dev server may start on a different port. Look for the following log output: "Project is running at" to determine the correct port.

## Publish to NPM
When we're happy with the functionality of the component, we're almost ready to publish it to NPM. Let's make a few changes to "package.json"; add a new "prepare" script, add "files" whitelist and change the "main" parameter.

    "main": "dist/MyComponent.js",
    "scripts": {
        ...
        "prepare": "babel ./MyComponent.js --out-dir dist --presets=env,react"
    },
    "files": [
        "dist"
    ]

The "prepare" script will ensure that source files are always transpiled before publishing to npm. The "files" whitelist will ensure that only the "dist" folder is published to npm and not any of the non-transpiled code. The only thing left to do now is publish the React component to npm.

    npm publish

The component should now be published to npm for anyone to use in their own apps. For more inormation on publishing and updating existing modules [go here](https://docs.npmjs.com/getting-started/publishing-npm-packages). Once the component has been published, it's easy for anyone to implement in their app.

    // install in another project
    npm install --save shareable-react-component

    import MyComponent from "shareable-react-component";

    const reactElement = (
        <div>
            <MyComponent/>
        </div>
    );
