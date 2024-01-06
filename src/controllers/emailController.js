const jwt = require("jsonwebtoken");
const { error } = require("winston");
const transporter = require("../utils/nodemailer");

async function getEmail(req, res) {
  res.render("email");
}

const isValidEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

async function postEmail(req, res) {
  const { email } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).send("Dirección de correo electrónico no válida");
  }

  const token = jwt.sign({ email }, process.env.JWTPASS, { expiresIn: "1h" });

  const mailOptions = {
    from: "mariomastroviti1@gmail.com",
    to: email,
    subject: "Restablecer contraseña",
    html: `
      <div>
          <h2>Ingresa al enlace para recuperar la contraseña</h2>
          <h2>
            <a href="http://localhost:8080/api/sessions/restore?token=${token}">Link</a>   
          </h2>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      req.logger.warn(`error al enviar a  ${email}`);
      res.status(500).send("Error de envío");
    } else {
      console.log("Correo enviado", info.response);
      res.send(`Correo enviado con éxito a ${email}`);
    }
  });
}


module.exports = {
  getEmail,
  postEmail,
};
