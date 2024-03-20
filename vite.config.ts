import { PluginOption, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import ssl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  server: { host: true, https: true, port: 8080 },
  plugins: [ssl(), react(), rtcMessaging(), clickMessaging()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        handlers: "handlers.html",
        freehand: "freehand.html"
      },
    },
  },
});

// Custom message passing plugin
function rtcMessaging(): PluginOption {
  return {
    name: "rtc",
    configureServer(server) {
      function forwardMessage(event: string) {
        server.ws.on(event, (data, client) => {
          console.log("forwarding", event);
          server.ws.clients.forEach((c) => {
            if (c !== client) c.send(event, data);
          });
        });
      }
      forwardMessage("rtc:offer");
      forwardMessage("rtc:answer");
      forwardMessage("rtc:ice");
      forwardMessage("rtc:connect");
    },
  };
}


function clickMessaging(): PluginOption {
  return {
    name: 'click',
    configureServer(server) {
      // should forward all events with click: prefix to all clients
      server.ws.on('click:event', (data, client) => {
        console.log('forwarding click');
        server.ws.clients.forEach(c => {
          if (c !== client) c.send('click:event', data);
        });
      });
    }
  }
}