import React, { Component } from "react";
import { fire } from "../utilities/firebase";
import { Redirect } from "react-router-dom";
import { Button, Position, Toaster, Intent } from "@blueprintjs/core";
// Toaster for warning message
import { connect } from "react-redux";
// import {dispatch} from "redux";

import { setCurrentUser } from '../actionCreators';

const loginStyle = {
  width: "90%",
  maxWidth: "315px",
  margin: "20px auto",
  border: "1px solid #ddd",
  borderRadius: "5px",
  padding: "10px"
};

class Login extends Component {
  constructor() {
    super();
    this.state = {
      redirect: false
    };
  }
  // authWithFacebook = () =>  {
  //     ( fire.auth()
  //         .signInWithPopup(facebookProvider)
  //         .then((result, error) => {
  //             if (error) {
  //                 this.toaster.show({
  //                     intent: Intent.DANGER,
  //                     message: "Unable to sign in with Facebook",
  //                     timeout: 5000
  //                 });
  //             } else {
  //                 this.setState({ redirect: true });
  //             }
  //         })
  //     )
  // }
  authWithEmailPassword = (event) => {
    event.preventDefault();
    // using form's ref={input => {this.passwordInput = input;}}
    const emailInput = this.emailInput.value
    const passwordInput = this.passwordInput.value

    fire.auth().fetchProvidersForEmail(emailInput)
      .then((providers) => {
        if (providers.length === 0) {
          // if firebase can't find any providers with emailInput = create new user
          return fire.auth().createUserWithEmailAndPassword(emailInput, passwordInput)
        } else if (providers.indexOf("password") === -1) {
          // user signed up with facebook
          this.loginForm.reset()
          this.toaster.show({ intent: Intent.WARNING, message: "Try alternative login." })
        } else {
          // sign user in
          return fire.auth().signInWithEmailAndPassword(emailInput, passwordInput)
        }
      })
      .then((user) => {
        if (user && user.email) {
          this.loginForm.reset()
          let currentUser = {
            username: user.email,
            uid: user.uid
          }
          debugger
          this.props.setUser(currentUser)
          debugger
          this.setState({ redirect: true })
        }
      })
      .catch((error) => {
        debugger
        this.toaster.show({ intent: Intent.DANGER, message: error.message })
      })
  }

  render() {
    if (this.state.redirect === true) {
      return <Redirect to="/" />;
    }

    return (
      <div style={loginStyle}>
        <Toaster
          position={Position.BOTTOM_RIGHT}
          ref={element => {
            this.toaster = element;
          }}
        />
        <Button
          style={{ width: "100%" }}
          className="pt-button pt-intent-primary"
          onClick={() => { this.authWithFacebook(); }}
        > Log In with Facebook </Button>
        <hr
          style={{
            marginTop: "12px",
            marginBottom: "12px"
          }}
        />
        <form
          ref={form => { this.loginForm = form; }}
          onSubmit={event => { this.authWithEmailPassword(event); }}
        >
          <div
            style={{ marginBottom: "10px" }}
            className="pt-callout pt-icon-info-sign"
          >
            <h5>Note</h5>
            If you don't have an account already, this form will create your account.
          </div>
          <label className="pt-label">
            Email
            <input
              style={{ width: "100%" }}
              className="pt-input"
              name="email"
              type="email"
              ref={input => { this.emailInput = input; }}
              placeholder="Email"
            />
          </label>
          <label className="pt-label">
            Password
            <input
              style={{ width: "100%" }}
              className="pt-input"
              name="password"
              type="password"
              ref={input => { this.passwordInput = input; }}
              placeholder="Password"
            />
          </label>
          <input
            style={{ width: "100%" }}
            type="submit"
            className="pt-button pt-intent-primary"
            value="Log In"
          />
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setUser(user) {
    dispatch(setCurrentUser(user));
  }
});

export default connect(null, mapDispatchToProps)(Login);;
