const { default: mongoose } = require("mongoose");
const { validateContact, Contact } = require("../models/Contact");
const auth = require("../middlewares/auth");

const router = require("express").Router();

// create contact
router.post("/contact", auth, async (req, res) => {
  const { error } = validateContact(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const contact = new Contact({
      ...req.body,
      postedBy: req.user._id,
    });

    const savedContact = await contact.save();
    return res.status(201).json(savedContact);
  } catch (error) {
    console.log(error);
  }
});

// fetch contact
router.get("/mycontacts", auth, async (req, res) => {
  try {
    const myContacts = await Contact.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "-password"
    );

    return res.status(200).json({ contacts: myContacts });
  } catch (error) {
    console.log(error);
  }
});

// update contact
// update contact
router.put("/contact/:id", auth, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "no id specified." });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });

  try {
    const contact = await Contact.findOne({ _id: id });

    if (!contact) return res.status(404).json({ error: "contact not found" });

    if (req.user._id.toString() !== contact.postedBy._id.toString())
      return res
        .status(401)
        .json({ error: "you can't edit other people contacts!" });

    const updatedData = { ...req.body };
    delete updatedData.id; // remove `id` from payload

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id },
      updatedData,
      { new: true } // returns the updated document
    );

    return res.status(200).json(updatedContact);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
});

// delete contact
router.delete("/delete/:id", auth, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "no id specified." });

  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "please enter a valid id" });
  try {
    const contact = await Contact.findOne({ _id: id });
    if (!contact) return res.status(400).json({ error: "no contact found" });

    if (req.user._id.toString() !== contact.postedBy._id.toString())
      return res
        .status(401)
        .json({ error: "you can't delete other people contacts!" });

    const deleted = await Contact.deleteOne({ _id: id });
    return res.status(200).json({ message: "deleted successfully", deleted });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
