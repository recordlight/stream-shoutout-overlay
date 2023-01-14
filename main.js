const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const shoutoutQueue = [];

const timer = 10000;



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
      
      if(shoutoutQueue.length === 0){
        let userInfo = getUsernameInfo(username).then((response)=>console.log(response));
        shoutoutQueue.push(username);
      } else {
        shoutoutQueue.push(username);
      }
    }

  });

  function extractUsername(message) {
    var rx = '^!so ([^\s]+)';
    var arr = message.match(rx);
    return arr[1]; 
  }
  
  function resetAnimation() {
    dialogElement.classList.remove(["fadeOutRight"]);
    dialogElement.style.animation = 'none';
    dialogElement.offsetHeight; /* trigger reflow */
    dialogElement.style.animation = null; 
  }

  function resetBox(){
    dialogElement.classList.add(["fadeOutRight"]);
    videoFrame.innerHTML = "";
    streamerName.innerHTML = " ";
    streamerCategory.innerHTML = "";
    profileImage.setAttribute("src","");
    shoutoutQueue.shift();
    if(shoutoutQueue.length > 0){
      getUsernameInfo(shoutoutQueue[0]).then((response)=>console.log(response));
    }
  }

  function getUsernameInfo(userId){
    
    console.log('getting username info');

    Promise.all([
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
          streamerName.innerHTML = response.data[0].display_name;
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
              streamerCategory.innerHTML = response.data[0].game_name;
              setTimeout(resetBox, timer);
            }
          );
        })
      })
      
      ,
      fetch("https://twitchapi.teklynk.com/getuserclips.php?channel="+userId+"&limit=100", {
        method: "GET",
        headers:{
        }
      }).then(response => response.json())
      .then(response => {
          console.log(response.data);
          if(response.data.length > 0){
            const random = Math.floor(Math.random() * response.data.length);
            chosenClip = response.data[random];

            console.log(chosenClip);

            console.log(videoFrame);
            videoFrame.innerHTML = `
                <video id="video-content" autoplay muted loop>
                  <source src="${chosenClip.clip_url}" type="video/mp4" />
                </video>`;
          } else {

          }
        }
      )
    ]).then(()=>{
      setTimeout(
        resetAnimation(),3000
      );
    })


    return token;
    
  }
}

mainfunction();