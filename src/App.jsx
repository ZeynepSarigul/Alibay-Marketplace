import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  withRouter,
  Link,
  Redirect
} from "react-router-dom";
import { browserHistory } from "react-router";
import {
  syncHistoryWithStore,
  routerReducer,
  routerMiddleware,
  push
} from "react-router-redux";
import { connect } from "react-redux";

// components
import Cart from "./Cart.jsx";
import NewItem from "./NewItem.jsx";
import Items from "./Items.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import ItemDetails from "./itemDetails.jsx";
import Checkout from "./Checkout.jsx";

import "./Item.css";
import { FiShoppingCart } from "react-icons/fi";
import { FaHome } from "react-icons/fa";

// testing cronjob
class UnconnectedNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      color: "#101010"
    };
  }
  listenScrollEvent = e => {
    if (window.scrollY > 400) {
      this.setState({ color: "#101010" });
    } else {
      this.setState({ color: "#101010" });
    }
  };

  componentDidMount() {
    window.addEventListener("scroll", this.listenScrollEvent);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.listenScrollEvent);
  }

  logout = async () => {
    console.log("clicked logout");
    let response = await (await fetch("/logout", { method: "POST" })).text();
    let body = JSON.parse(response);
    if (body.success) {
      this.props.history.push("/");
    }
  };
  render = () => {
    console.log("this.state.email", this.state.email);
    return (
      <nav style={{ backgroundColor: this.state.color }}>
        <div className="myNavbar">
          <div className="entryNav">
            <NavLink to="/all-items" className="hvr-bounce-to-right">
              <FaHome />
            </NavLink>
            <NavLink to="/new-item" className="hvr-bounce-to-right">
              Sell an item
            </NavLink>
          </div>
          <div className="styleLogo">
            <NavLink to="/all-items" className="hvr-bounce-to-right">
              <em> ~ Fash·ion·is·ta ~ </em>
            </NavLink>
          </div>
          <div className="secondPart">
            <NavLink className="hvr-bounce-to-right" to="/cart">
              <FiShoppingCart />
            </NavLink>

            <button onClick={this.logout} className="hvr-bounce-to-right">
              Log out
            </button>
          </div>
        </div>
      </nav>
    );
  };
}

let renderItemDetails = routerData => {
  return (
    <div>
      <ItemDetails
        id={routerData.match.params.id}
        history={routerData.history}
        location={routerData.location}
      />
    </div>
  );
};

class UnconnectedApp extends Component {
  render = () => {
    return (
      <div>
        <div>
          <Router>
            <Navigation />
            <Route exact={true} path="/" component={Login} />

            {this.props.loggedIn ? (
              <Route exact={true} path="/cart" component={Cart} />
            ) : (
              <Redirect
                to={{
                  pathname: "/"
                }}
              />
            )}
            {this.props.loggedIn ? (
              <Route exact={true} path="/new-item" component={NewItem} />
            ) : (
              <Redirect
                to={{
                  pathname: "/"
                }}
              />
            )}
            {this.props.loggedIn ? (
              <Route exact={true} path="/item/:id" render={renderItemDetails} />
            ) : (
              <Redirect
                to={{
                  pathname: "/"
                }}
              />
            )}
            {this.props.loggedIn ? (
              <Route exact={true} path="/checkout" component={Checkout} />
            ) : (
              <Redirect
                to={{
                  pathname: "/"
                }}
              />
            )}
            {/* <Route path="/cart" component={Cart} /> */}
            {/* <Route path="/new-item" component={NewItem} /> */}
            {/* <Route path="/item/:id" render={renderItemDetails} /> */}
            {/* <Route exact={true} path="/checkout" component={Checkout} /> */}
            <Route exact={true} path="/all-items" component={Items} />
            <Route exact={true} path="/signup" component={Signup} />
          </Router>
        </div>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    email: state.email,
    loggedIn: state.loggedIn
  };
};

let Navigation = withRouter(UnconnectedNavigation);
let App = connect(mapStateToProps)(UnconnectedApp);
export default App;
