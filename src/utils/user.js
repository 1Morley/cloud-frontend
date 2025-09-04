export function hasValidToken(){
  let session = localStorage.getItem("SessionInformation");

  if(session != null){
    let session_json = JSON.parse(session);
    let access_token = session_json.AccessToken;

    if (access_token) {
      let decoded_token = JSON.parse(atob(access_token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      if (decoded_token.exp > now) {
        return (
          true
        )
      }
    }
  }

  return false
}