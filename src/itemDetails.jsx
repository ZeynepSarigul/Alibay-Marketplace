import React, { Component } from "react";
import "./main.css";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import Cart from "./Cart.jsx";

class UnconnectedItemDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 0,
      itemId: "",
      displayCheckout: false
    };
  }

  // fetch the quantity in the cart and update the quantity in the state
  //   componentDidMount = ()=>{

  //   }

  addToCart = async () => {
    console.log("add to cart: id ", this.props.id);
    this.props.dispatch({
      type: "add-item-to-cart",
      itemId: this.props.id
    });

    this.setState(
      {
        ...this.state,
        quantity: (this.state.quantity += 1),
        itemId: this.props.id,
        displayCheckout: !this.state.displayCheckout
      },
      async () => {
        let data = new FormData();
        console.log("add to cart: id ", this.props.id);
        // data.append("itemId", this.props.id);
        data.append("itemId", this.state.itemId);
        data.append("quantity", 1);
        let response = await fetch("/add-to-cart", {
          method: "POST",
          body: data,
          credentials: "include"
        });
        let responseBody = await response.text();
        let body = JSON.parse(responseBody);
        if (body.success) {
          //   alert("item added to cart successfully");
          return;
        }
        alert("Oops an error occured");
      }
    );
  };
  handleCheckout = () => {
    <NavLink to="/cart" />;
  };

  render = () => {
    console.log("this.props.id", this.props.id);
    console.log("this.props.items", this.props.items);
    let displayItem = this.props.items.filter(item => {
      return item._id === this.props.id;
    });
    return (
      <div>
        <div>
          {displayItem.map(item => {
            return (
              <div>
                <img
                  className="ItemPicture"
                  src={item.filePath}
                  height="200px"
                  width="200px"
                />
                <div>{item.name}</div>
                <div>{item.description}</div>
                <div>{item.cost + "$"}</div>
                <div
                  style={{
                    display: this.state.quantity >= 1 ? "block" : "none"
                  }}
                >
                  <div>
                    {this.state.quantity > 1
                      ? this.state.quantity + " items in cart"
                      : this.state.quantity + " item in cart"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div />
        <button onClick={this.addToCart}>add to cart</button>
        <div style={{ display: this.state.quantity >= 1 ? "block" : "none" }}>
          <button onClick={this.handleCheckout}>
            checkout
            <Link to="/cart" />
            {console.log("this.state.itemId", this.state.itemId)}
            <div style={{ display: "none" }}>
              <Cart id={this.state.itemId} />
            </div>
          </button>
        </div>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    items: state.items,
    email: state.email,
    cart: state.cart,
    itemId: state.itemId
  };
};
let ItemDetails = connect(mapStateToProps)(UnconnectedItemDetails);

export default ItemDetails;
