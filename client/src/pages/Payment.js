import React, { useState } from "react";
// import logo from "./logo.svg";
import "../App.css";
import StripeCheckout from "react-stripe-checkout";
function Payment(props) {
  const [item, setItem] = useState({
    name: props.product.name,
    price: props.product.price,
    description: props.product.description,
  });

  const makePayment = (token) => {
    const body = {
      token,
      item,
    };
    const headers = {
      "Content-Type": "application/json",
    };

    //must be https for hosted website for stripe to work
    return fetch(`http://localhost:5000/payment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log("RESPONSE: ", response);
        const { status } = response;
        console.log("STATUS ", status);
      })
      .catch((error) => console.log(error));
  };

  return (
    <StripeCheckout
      stripeKey={process.env.REACT_APP_KEY}
      token={makePayment}
      name="Complete Your Payment !!!"
      amount={props.product.price * 100}
      shippingAddress
    >
      <a className="btn-primary" id="payment">
        Buy now $ {props.product.price}
      </a>
    </StripeCheckout>
  );
}

export default Payment;
