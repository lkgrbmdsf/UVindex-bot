const { Telegraf } = require("telegraf");
const fetch = require("node-fetch");

const bot = new Telegraf("5555556848:AAFWejEC65nbTJNed4xFBwSmFwCVWN6R3eI");

bot.start((ctx) => {
  ctx.reply(
    "Welcome! Send me your location so I could tell you what UV id right now :^)"
  );
});

bot.on("location", (ctx) => {
  const lat = ctx.message.location.latitude;
  const lon = ctx.message.location.longitude;
  let lastUV;
  getUV(lat, lon)
    .then((res) => {
      {
        lastUV = res.current.uv;
        ctx.reply(`UV index in ${res.location.name} is ${res.current.uv} :)`);
      }
    })
    .catch((err) => {
      console.log("error: ", err);
      ctx.reply(`Wrong request`);
    });

  setInterval(() => {
    getUV(lat, lon)
      .then((res) => {
        if (lastUV !== res.current.uv) {
          ctx.reply(
            `UV index in ${res.location.name} is changed to ${res.current.uv} :)`
          );
          lastUV = res.current.uv;
        } else {
          return;
        }
      })
      .catch((err) => {
        console.log("error: ", err);
        ctx.reply(`Wrong request`);
      });
  }, 1000 * 60 * 60);
});

const getUV = async (lat, lon) => {
  const api = `http://api.weatherapi.com/v1/current.json?key=2c8a38ef924049e4bc5182111221807&q=${lat},${lon}`;
  const res = await fetch(api);
  const data = await res.json();
  console.log(data);
  return data;
};

bot.launch();
