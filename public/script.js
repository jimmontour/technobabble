const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443',
});

let myVideoStream;

const roomInput = document.querySelector('.dummy-input');
roomInput.value = window.location.href;



const myVideo = document.createElement('video');

myVideo.muted = true;

const peers = {};

// Get access to video and audio in browser
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    myPeer.on('call', (call) => {
      call.answer(stream);
      const video = document.createElement('video');
      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on('user-connected', (userId) => {
      connectToNewUser(userId, stream);
    });
    // input value
    const text = $('input');
    // press enter send message
    $('html').keydown(function (e) {
      if (e.which === 13 && text.val().length !== 0) {
        socket.emit('message', text.val());
        text.val('');
      }
    });
    socket.on('createMessage', (message) => {
      $('ul').append(
        `<li class="message"><b>user-name</b><br/>${message}</li>`
      );
      scrollToBottom();
    });
  });

socket.on('user-disconnected', (userId) => {
  if (peers[userId]) peers[userId].close();
});

myPeer.on('open', (id) => {
  socket.emit('join-room', ROOM_ID, id);
});

// Call another user.  When they also call, streams connected.
function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement('video');
  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on('close', () => {
    video.remove();
  });

  peers[userId] = call;
}

// Plays the video stream in the browser
function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}

// Scrolling text in the chat div
const scrollToBottom = () => {
  const d = $('.main__chat_window');
  d.scrollTop(d.prop('scrollHeight'));
};

// Toggle mute audio
const muteUnmute = () => {
  const { enabled } = myVideoStream.getAudioTracks()[0];
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

// Toggle video
const playStop = () => {
  const { enabled } = myVideoStream.getVideoTracks()[0];
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

// Copy Room Address
const shareRoom = () => {
   const roomInput = document.querySelector('.dummy-input');
   roomInput.value = window.location.href;
   roomInput.select();
   document.execCommand("copy");
};

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `;
  document.querySelector('.main__mute_button').innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `;
  document.querySelector('.main__mute_button').innerHTML = html;
};

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `;
  document.querySelector('.main__video_button').innerHTML = html;
};

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `;
  document.querySelector('.main__video_button').innerHTML = html;
};

// Matrix animation
const canvas_1 = document.getElementById("canvas_1");
(width = canvas_1.width = window.innerWidth),
  (height = canvas_1.height = window.innerHeight),
  (ctx = canvas_1.getContext("2d")),
  (backgroundColor = "rgba(0, 0, 0, .1)"),
  (textColor = "#c1f0db"),
  (text =
    "0123456789qwertyuiopasdfghjklzxcvbnm,./;'[]QWERTYUIOP{}ASDFGHJHJKL:ZXCVBBNM<>?"),
  (textArr = text.split("")),
  (fontSize = 18),
  (col = width / fontSize),
  (row = []);

for (let i = 0; i < col; i++) {
  row[i] = 1;
}

function matrix() {
  ctx.save();
  ctx.fillStyle = textColor;
  ctx.font = `${fontSize}px Arial`;

  for (let i = 0; i < col; i++) {
    const char = textArr[Math.floor(Math.random() * textArr.length)];
    ctx.fillText(char, i * fontSize, row[i] * fontSize);
    if (row[i] * fontSize > height && Math.random() > 0.98) {
      row[i] = 1;
    } else {
      row[i]++;
    }
  }

  ctx.restore();
}

setInterval(function () {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
  matrix();
}, 50);


//  Dish controls;

// Area:
function Area(Increment, Count, Width, Height, Margin = 10) {
  let i = (w = 0);
  let h = Increment * 0.75 + Margin * 2;
  while (i < Count) {
    if (w + Increment > Width) {
      w = 0;
      h = h + Increment * 0.75 + Margin * 2;
    }
    w = w + Increment + Margin * 2;
    i++;
  }
  if (h > Height) return false;
  else return Increment;
}
// Dish:
// function Dish() {
//   // variables:
//   let Margin = 2;
//   let Scenary = document.getElementById("Dish");
//   let Width = Scenary.offsetWidth - Margin * 2;
//   let Height = Scenary.offsetHeight - Margin * 2;
//   let Cameras = document.getElementsByClassName("Camera");
//   let max = 0;

//   // loop (i recommend you optimize this)
//   let i = 1;
//   while (i < 5000) {
//     let w = Area(i, Cameras.length, Width, Height, Margin);
//     if (w === false) {
//       max = i - 1;
//       break;
//     }
//     i++;
//   }

//   // set styles
//   max = max - Margin * 2;
//   setWidth(max, Margin);
// }

// // Set Width and Margin
// function setWidth(width, margin) {
//   let Cameras = document.getElementsByClassName("Camera");
//   for (var s = 0; s < Cameras.length; s++) {
//     Cameras[s].style.width = width + "px";
//     Cameras[s].style.margin = margin + "px";
//     Cameras[s].style.height = width * 0.75 + "px";
//   }
// }

// // Load and Resize Event
// window.addEventListener(
//   "load",
//   function (event) {
//     Dish();
//     window.onresize = Dish;
//   },
//   false
// );
