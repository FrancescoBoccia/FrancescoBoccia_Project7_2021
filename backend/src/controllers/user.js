const db = require("../../src/models");
const jwt = require("jsonwebtoken");
const { User } = db.sequelize.models;

const newToken = (user) => {
  token = jwt.sign({ userId: user.id }, "RANDOM_TOKEN_SECRET", {
    expiresIn: "12h",
  });
  return { user, token };
};

exports.signUp = (req, res, next) => {
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  })
    .then((user) => res.status(201).json(newToken(user)))
    .catch((error) => res.status(401).json({ error: error }));
};

exports.login = async (req, res, next) => {
  try {
    const response = await User.authenticate(req.body.email, req.body.password);

    if (response.valid) {
      res.status(201).json(newToken(response.user));
    } else {
      res.status(401).json({ error: response.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = (req, res, next) => {
  try {
    const userObject = req.file
      ? {
          ...JSON.parse(req.body.user),
          imageUrl: `${req.protocol}://${req.get("host")}/public/${
            req.file.filename
          }`,
        }
      : { ...req.body };

    console.log(userObject);
    req.user.update(userObject).then((user) => res.status(200).json({ user }));
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getOneUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then((user) => res.status(200).json({ user }))
    .catch((error) => res.status(404).json({ error }));
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const user = req.user.admin
      ? await User.findOne({ where: { id: req.params.id } })
      : req.user;
    await user.softDestroy();
    res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    res.status(400).json({ error });
  }
};
