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