const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);



let dialogElement = document.getElementById("dialog-box");
let profileImage = document.getElementById("profile-image");
let streamerName = document.getElementById("streamer-name");
let streamerCategory = document.getElementById("streamer-category");
let videoContent = document.getElementById("video-content");

let videoFrame = document.getElementById("video-frame");
let mainChannel = urlParams.get('channel');
let messageExist = false;

const mainfunction = async function(){
  const opts = {
    options: { debug: true },
      channels: [mainChannel]
    };
    
  token = getToken().access_token;
  console.log(token);

  const client = new tmi.Client( opts );
  client.connect().catch(console.error);


  client.on('message', (channel, tags, message, self) => {
    console.log(channel);
    console.log(tags.username);
    console.log(mainChannel === channel);
    if(message.startsWith("!so ")) {
      let username = extractUsername(message);
      let userInfo = getUsernameInfo(username).then((response)=>console.log(response));
      console.log(userInfo);
    }
  });

  function extractUsername(message) {
    var rx = '^!so ([^\s]+)';
    var arr = message.match(rx);
    return arr[1]; 
  }

  function getUsernameInfo(userId){
    console.log('getting username info');
    token = getToken().then((token) => {
        console.log("abcd");
        result = fetch("https://api.twitch.tv/helix/users?login="+userId, {
        method: "GET",
        headers:{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ token.access_token,
          'Client-Id': clientId
        }
      })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        streamerName.innerHTML = response.data[0].login;
        profileImage.setAttribute("src", response.data[0].profile_image_url);
        fetch("https://api.twitch.tv/helix/channels?broadcaster_id="+response.data[0].id, {
          method: "GET",
          headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ token.access_token,
            'Client-Id': clientId
          }
        }).then(response => response.json())
        .then(response => {
            console.log(response);
            streamerCategory.innerHTML = response.data[0].game_name;
          }
        );

        fetch("https://api.twitch.tv/helix/clips?broadcaster_id="+response.data[0].id, {
          method: "GET",
          headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ token.access_token,
            'Client-Id': clientId
          }
        }).then(response => response.json())
        .then(response => {
            console.log(response.data);
            const random = Math.floor(Math.random() * response.data.length);
            chosenClip = response.data[random];

            videoContent.innerHTML = response.data[0].embed_url;
          }
        );
      })
    })

    return token;
    
  }
}

mainfunction();