const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const logger = require("./logger.js");
const { smtp, projectName } = require("../../config.js");

const { sender, host, port, auth } = smtp;

// Create reusable transporter object
const createTransporter = () => {
  return nodemailer.createTransport({
    host,
    port,
    secure: true, // true for SSL
    auth: {
      user: auth.user,
      pass: auth.pass,
    },
  });
};

// Helper to render EJS template
const renderTemplate = async (templateName, data) => {
  const templatePath = path.join(__dirname, "..", "..", "emails", `${templateName}.ejs`);
  try {
    return await ejs.renderFile(templatePath, data);
  } catch (err) {
    logger.error(`Error rendering template ${templateName}: ${err}`);
    throw err;
  }
};

// Generalized mailer function
const mailer = async (template, request) => {
  const {
    to,
    subject,
    locals,
    attachments = [],
    from = sender || null,
    replyTo = null,
    send = true,
  } = request;

  try {
    // Render email content using EJS
    const emailBody = await renderTemplate(template, locals);

    const transporter = createTransporter();

    // Email options
    const mailOptions = {
      from,
      to,
      subject,
      html: emailBody, // Rendered EJS template as HTML
      attachments,
      replyTo: replyTo || from,
    };

    if (send) {
      const info = await transporter.sendMail(mailOptions);
      logger.debug(`Email sent: ${to} | ${info.messageId}`);
    } else {
      logger.debug(`Dry-run: Email not sent to ${to}`);
    }
  } catch (err) {
    logger.error(err);
  }
};

// Exporting mailer functions for different use cases
module.exports = {
  signupMail: (to, data, subject = "Signup") =>
    mailer("welcome", { to, subject, locals: { ...data, brand: projectName } }),

  invitationMail: (to, data, subject = "Invitation") =>
    mailer("invitation", { to, subject, locals: { ...data, brand: projectName } }),

  signupInviteMail: (to, data, subject = "Invitation for signup") =>
    mailer("welcome", { to, subject, locals: { ...data, brand: projectName } }),

  forgotMail: (to, data, subject = "Forgot password") =>
    mailer("forgot-password", { to, subject, locals: { ...data, brand: projectName } }),

  resetPasswordMail: (to, data, subject = "Password successfully reset") =>
    mailer("reset-password", { to, subject, locals: { ...data, brand: projectName } }),

  setPasswordMail: (to, data, subject = "Password successfully changed") =>
    mailer("set-password", { to, subject, locals: { ...data, brand: projectName } }),
};
