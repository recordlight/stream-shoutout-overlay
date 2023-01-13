let clientId = '9ira4la96fxl7t1jxmtgdtj8blgdml'
let clientSecret = 'hn9zxb5u361reg1wdozhwswxlcgoxx'

async function getToken() {
    const credential = {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
    }

    const response = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },    
        body: new URLSearchParams(credential)
    });

    return response.json();
}