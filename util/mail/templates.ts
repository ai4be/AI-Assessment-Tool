
function getInvitationHtml (page: string, token: string, email: string, projectId: string, hostname: string): string {
  return `
    <div>
     <div style="height:100px; background-color:#26292c; color: white">
       <p>AI<sub>4<sub>Belgium</p>
     <div>
     <div style="height:200px; background-color:#0079bf;">
       <a href='${hostname}/${page}?token=${token}&email=${email}&projectId=${projectId}'>Your are invited to a project in AI<sub>4<sub>Belgium.</a>
     </div>
     <div style="height:100px; background-color:#26292c;">
  `
}

const templates = {
  invitation: getInvitationHtml
}

export default templates
