const Email = require("email-templates")
const logger = require("./logger.js")
const { smtp } = require("../../config.js")
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

module.exports = mailer
