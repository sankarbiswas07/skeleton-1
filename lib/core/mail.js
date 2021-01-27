const Email = require("email-templates")
const logger = require("./logger.js")
const { smtp, projectName } = require("../../config.js")
const {
  sender, host, port, auth
} = smtp

// "emailBase" will shift to helper file
const transport = ({ from, replyTo, send }) => new Email({
  message: {
    from,
    replyTo: replyTo || from,
  },
  send, // set to false for dry-runs
  transport: {
    host,
    port,
    secure: true, // use SSL
    auth: {
      user: auth.user,
      pass: auth.pass
    }
  },
  views: {
    options: {
      extension: "ejs"
    }
  }
})

const mailer = (template, request) => {
  // logger.debug(request)
  try {
    const {
      to,
      subject,
      locals,
      attachments = [],
      from = sender || null,
      replyTo = null,
      send = true
    } = request

    transport({
      from,
      replyTo,
      send
    })
      .send({
        template,
        message: {
          to,
          subject,
          attachments
        },
        locals
      })
      .then((data) => {
        // logger.debug(data)
        logger.debug(`${template} mail has been sent to ${to}`)
      })
      .catch((err) => {
        logger.error(err)
      })
  } catch (err) {
    logger.error(err)
  }
}

module.exports = {
  signupMail: (to, data, subject = "Signup") => mailer("welcome", { to, subject, locals: { ...data, ...{ brand: projectName } } }),

  invitationMail: (to, data, subject = "Invitation") => mailer("invitation", { to, subject, locals: { ...data, ...{ brand: projectName } } }),

  signupInviteMail: (to, data, subject = "Invitation for signup") => mailer("welcome", { to, subject, locals: { ...data, ...{ brand: projectName } } }),

  forgotMail: (to, data, subject = "Forgot password") => mailer("forgot-password", { to, subject, locals: { ...data, ...{ brand: projectName } } }),

  resetPasswordMail: (to, data, subject = "Password successfully reset") => mailer("reset-password", { to, subject, locals: { ...data, ...{ brand: projectName } } }),

  setPasswordMail: (to, data, subject = "Password successfully changed") => mailer("set-password", { to, subject, locals: { ...data, ...{ brand: projectName } } }),
}
