
export function getInvitationHtml (page: string, token: string, email: string, projectId: string, hostname: string): string {
  return `
    <style>
      a:hover { color: #333; text-decoration: none; }
    </style>

    <article style="display: block; text-align: left; width: 650px; margin: 0 auto;">
      <h1 style="font-size: 40px;"><p style="color: #0000E6; font-weight: 600; font-family: Helvetica,Arial,sans-serif; text-align: center;">AI<sub style="color: #000;">4</sub>Belgium</p></h1>

      <div style="font: 20px Helvetica, sans-serif; color: #333;">
          <p>You have been invited for the assessment of an AI project!</p>
          <p>To accept the invite please click
            <a href='${hostname}/${page}?token=${token}&email=${email}&projectId=${projectId}' style="color: #dc8100; text-decoration: underline;">
              here
            </a>
          </p>
          <p>&mdash; The Team</p>
      </div>
    </article>
  `
}

export function resetPasswordHtml (token: string, hostname: string): string {
  return `
    <style>
      a:hover { color: #333; text-decoration: none; }
    </style>

    <article style="display: block; text-align: left; width: 650px; margin: 0 auto;">
      <h1 style="font-size: 40px;"><p style="color: #0000E6; font-weight: 600; font-family: Helvetica,Arial,sans-serif; text-align: center;">AI<sub style="color: #000;">4</sub>Belgium</p></h1>

      <div style="font: 20px Helvetica, sans-serif; color: #333;">
          <p>You have requested a password reset!</p>
          <p>To reset your password please click
            <a href='${hostname}/reset-password?token=${token}' style="color: #dc8100; text-decoration: underline;">
              here
            </a>
            .
          </p>
          <p>This link is valid for 2h!</p>
          <br />
          <p>If you didn't ask for a password reset you can ignore this email.</p>
          <p>&mdash; The Team</p>
      </div>
    </article>
  `
}

export function validateEmailHtml (code: string): string {
  return `
  <article style="display: block; text-align: center; width: 370px; margin: 0 auto;">
    <h1 style="font-size: 40px;">
      <p style="color: #0000E6; font-weight: 600; font-family: Helvetica,Arial,sans-serif; text-align: center;">
        AI<sub style="color: #000;">4</sub>Belgium
      </p>
    </h1>

    <div style="font: 20px Helvetica, sans-serif; color: #333; display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <p>Use this code to validate your email</p>
      <div style='display:flex; justify-content: center; align-items: center;'>
        <span style="padding: 10px; color: black; background-color: lightgrey; border-radius: 15px; font-size: 30px;" >
          ${code}
        </span>
      </div>
      <p>This code is valid for 24h!</p>
      <p>&mdash; The Team</p>
    </div>
  </article>
  `
}

const templates = {
  invitation: getInvitationHtml,
  resetPassword: resetPasswordHtml,
  validateEmailHtml
}

export default templates
