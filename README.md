This repository demonstrates a very simple setup, using Vite and React XR, to
bring your display into the WebXR session, and enable truly fast iteration.

### Prerequisite

When you test this project, please make sure your computer and the HMD device are connected to the same WiFi

### Setup

##### Configuring Vite

`npm install vite`

### Launch

Run the below command in the terminal

`npx vite`

------

then you will see the terminal output like this

![terminal](images/terminal.png)

### Stream

1. Choose one of the network url (e.g. https://10.186.210.189:10086/)
2. Open https://10.186.210.189:10086/ in Meta Quest Browser
3. Run https://10.186.210.189:10086/stream.html on your desktop
4. (Optional) run https://10.186.210.189:10086/desktop.html on your desktop
5. In `stream.html`, connect and stream the webpage you choose
6. In HMD, click `enter AR` button
7. Now you can enjoy this fantastic application🎉
8. Aim at the target point on the screen, pinch your hand, then you will see the emerging object.

⚠️ **Warning**: Please do not open https://10.186.210.189:10086/ in desktop and HMD simultaneously

### Feature

##### Object manipulation

1. Drag
2. Rotate
3. Scale

##### synchronization (Todo)

1. Virtual screen and XR workspace

### Key Files

This project includes a simple 3D scene to provide some context when demonstrating the result.

The key files implementing the remote display logic are:

- `vite.config.ts`, where message passing is configured
- `stream.html`, a single-file JavaScript app loaded by the dev machine
- `src\connectRemoteDisplay.ts`, logic on the immersive app side for connecting to
  the WebRTC stream
- `src\RemoteDisplay.tsx`, a React component rendering the display in the WebXR
  session
- `src\TwoHandScale.tsx`, define the object manipulation logic
- `src\RetriveObject.tsx`, deal with the object emerging
- `src\Holodeck.tsx`, define the black and yellow VR background

‼️To quickly understand the framework and structure of this project, I recommend looking at `src\ARApp.tsx` first.



