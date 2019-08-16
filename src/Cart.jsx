import React, { Component } from "react";
import StripeCheckout from "react-stripe-checkout";
import { connect } from "react-redux";
import "./main.css";

class UnconnectedCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: this.props.cart,
      items: this.props.items
    };
  }

  componentDidMount = () => {
    let updateCartItems = async () => {
      // get all cart items from the server
      let response = await fetch("/cart-items");
      let responseBody = await response.text();
      //   console.log("responseBody", responseBody);
      let parsed = JSON.parse(responseBody);
      console.log("parsed", parsed);
      this.props.dispatch({ type: "set-cart", cart: parsed });
    };
    setInterval(updateCartItems, 500);
  };

  onToken = token => {
    fetch("/save-stripe-token", {
      method: "POST",
      body: JSON.stringify(token)
    }).then(response => {
      response.json().then(data => {
        // alert(`Thank you for your purchase! ${data.email}`);
        // add username/email below
        alert(`Thank you for your purchase ${this.props.email}! `);
      });
    });
  };

  clearCart = async () => {
    let response = await (await fetch("/delete-cart", {
      method: "POST"
    })).text();
    let body = JSON.parse(response);
  };
  render = () => {
    // console.log("itemFindDetails", itemFindDetails);
    console.log("this.props.items", this.props.items);
    console.log("this.props.email", this.props.email);
    console.log("this.props.cart", this.props.cart);
    return (
      <div>
        <div className="cart">
          <div className="shopping-bag">
            <h1>Shopping Bag</h1>
            {this.props.cart.map(cartItem => {
              let itemDetails = this.props.items.filter(item => {
                console.log("item._id", item._id);
                console.log("cartItem.itemId", cartItem.itemId);
                return item._id === cartItem.itemId;
              })[0];

              console.log("itemDetails", itemDetails);
              return (
                <div>
                  <div>
                    <img
                      className="ItemPicture"
                      src={itemDetails.filePath}
                      height="200px"
                      width="200px"
                    />
                    <div>{itemDetails.name}</div>
                    <div>{itemDetails.description}</div>
                    <div>{itemDetails.cost + "$ "} </div>
                    quantity: {cartItem.quantity}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="checkout">
            <h1>
              Checkout
              <div id="stripeButton">
                <button onClick={this.clearCart} style={{ border: "0px" }}>
                  <StripeCheckout
                    // {<button className="btn btn-primary">checkout now!
                    // </button>}
                    token={this.onToken}
                    stripeKey="pk_test_O9HT5wBse32v6Ev3y8xDbYnQ00SpdfFqSl"
                  />
                </button>
              </div>
            </h1>
          </div>
        </div>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    email: state.email,
    cart: state.cart,
    items: state.items
  };
};
let Cart = connect(mapStateToProps)(UnconnectedCart);
export default Cart;
