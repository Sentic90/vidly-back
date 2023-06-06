const express = require("express");
const { Customer, validate } = require("../models/customer");
const auth = require("../middleware/auth");
const router = express.Router();

// Customers Endpoint

// List customers
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

// create customer
router.post("/", async (req, res) => {
  // validate request body
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let customer = new Customer(req.body);
  customer = await customer.save();
  // Send back to client
  res.send(customer);
});

// get a customer
router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return res.status(404).send("The customer with given ID was not found.");
  }
  res.send(customer);
});

// update customer
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.send(customer);
});

// Delete customer
router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  res.send(customer).status(204);
});

module.exports = router;
