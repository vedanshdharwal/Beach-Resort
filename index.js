const cors = require("cors");
const express = require("express");
require("dotenv").config();
const stripe = require("stripe")(process.env.SECRET_KEY);

//new method of checkout
// const stripe = require("stripe")(
//   "SECRET_KEY"
// );

const { uuid } = require("uuidv4");

const app = express();
const PORT = process.env.PORT || 5000;
//middleware

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(cors());

//routes
app.get("/", (req, res) => {
  res.send("IT Works !!!!!!!!!");
});

app.post("/payment", (req, res) => {
  //token will contain product details - price etc
  // console.log(req.body);
  const { item, token } = req.body;
  console.log("token: ", token);
  // console.log("Price: ", item.price);

  // to avoid double charging the same item
  const idempotencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: item.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchase of ${item.name}`,
          shipping: {
            name: token.card.name,
            address: {
              line1: token.card.address_line1,
              country: token.card.address_country,
            },
          },
        },
        { idempotencyKey }
      );
    })
    .then((result) => {
      alert("Payment Successful");
      res.status(200).json(result);
    })
    .catch((err) => console.log(err));
});

// app.post("/payment", async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: "T-shirt",
//           },
//           unit_amount: 2000,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     success_url: "https://example.com/success",
//     cancel_url: "https://example.com/cancel",
//   });

//   res.json({ id: session.id });
// });

//listen

app.listen(PORT, () => console.log(`LISTENING AT PORT ${PORT}`));
