const cors = require("cors");
const express = require("express");
require("dotenv").config();
const stripe = require("stripe")(process.env.SECRET_KEY);
const path = require("path");
const { uuid } = require("uuidv4");

const app = express();

//middleware

// app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(cors());

//routes
// app.get("/", (req, res) => {
//   res.send("IT Works !!!!!!!!!");
// });

app.post("/payment", (req, res) => {
  //token will contain product details - price etc

  const { item, token } = req.body;
  // console.log("token: ", token);
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

// serve static files if we are in production mode
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`LISTENING AT PORT ${PORT}`));
