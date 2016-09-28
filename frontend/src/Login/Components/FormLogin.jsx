import React from 'react';
import { browserHistory } from 'react-router'

import InputText from './InputText.jsx';
import ButtonSubmit from './ButtonSubmit.jsx';

export default React.createClass({
    getInitialState: function() {
        return {};
    },
    handleSubmit: function(event) {
        event.preventDefault();
    },
    signup: function(event) {
        console.log("Signup")
        const req = new XMLHttpRequest();
        const data = {
            email: document.querySelector('input[name="email"]').value,
            password: document.querySelector('input[name="password"]').value
        };
        req.open(event.target.form.method, "/users", true);
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.onreadystatechange = function () {
            if (req.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (req.status !== 201) {
                alert(JSON.parse(req.responseText).error)
                return;
            }
            console.log(req.responseText);
        };
        req.send(JSON.stringify(data,null,''));
    },
    login: function(event) {
        console.log("Login")
        const req = new XMLHttpRequest();
        const data = {
            email: document.querySelector('input[name="email"]').value,
            password: document.querySelector('input[name="password"]').value
        };
        req.open(event.target.form.method, "/users/login", true);
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.onreadystatechange = function () {
            if (req.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (req.status !== 204) {
                alert(JSON.parse(req.responseText).error)
                return;
            }
            browserHistory.push('/dashboard')
        };
        req.send(JSON.stringify(data,null,''));
    },
    componentDidMount: function() {
        // Nothing
    },
    render: function() {
        return (
            <form encType="application/json" className="loginForm" onSubmit={this.handleSubmit} method="POST">
                <h2>Login/Signup</h2>
                <InputText placeholder="Email address" type="email" name="email" />
                <InputText placeholder="Password" type="password" name="password" />
                <ButtonSubmit onClick={this.login} value="Login" />
                <hr />
                <em>If you don't have an account, just hit 'Sign up'!</em><br />
                <ButtonSubmit onClick={this.signup} value="Sign up"/>
            </form>
            );
    }
});