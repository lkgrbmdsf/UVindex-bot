const {
  replies,
  getUVbyLocation,
  getUVByTownName,
} = require("./helpers/middlewares");
const { Telegraf } = require("telegraf");
require("dotenv").config();

const tg = process.env.TELEGRAM_API_KEY;

const bot = new Telegraf(tg);

bot.start((ctx) => {
  ctx.reply(
    "Привет! " +
      "Я проверяю ультрофиолетовый индекс, что бы вы решали, " +
      "стоит ли идти жарится на солнце и болеть раком или лучше посмотреть нетфликс с подружкой. " +
      "Пришлите мне свою локацию, или напиши в каком городе находишься, а я скажу шо там на улице. " +
      "Если не буду чудить, то буду проверять индекс каждый час и, если он изменится, конечно сообщу. " +
      "В любом случае, вы всегда можете проверить это ручками, прислав повторно мне свою гео-точку:^)"
  );
});

bot.on("location", (ctx) => {
  const lat = ctx.message.location.latitude;
  const lon = ctx.message.location.longitude;
  let lastUV;
  getUVbyLocation(lat, lon)
    .then((res) => {
      let currentUV = res.current.uv;
      {
        lastUV = currentUV;
        ctx.reply(`УФ индекс в ${res.location.name} равен ${currentUV}.`);

        setTimeout(() => {
          replies(ctx, currentUV);
        }, 2000);
      }
    })
    .catch((err) => {
      console.log("error: ", err);
      ctx.reply(`Что-то пошло не по плану, сори..`);
      ctx.reply(`Попробуйте еще`);
    });

  setInterval(() => {
    getUVbyLocation(lat, lon)
      .then((res) => {
        let currentUV = res.current.uv;
        if (currentUV !== lastUV) {
          ctx.reply(
            `УФ индекс изменился в ${res.location.name} до ${currentUV}.`
          );

          setTimeout(() => {
            replies(ctx, currentUV);
          }, 2000);

          lastUV = currentUV;
        } else {
          console.log("index didnt change");
        }
      })
      .catch((err) => {
        console.log("error: ", err);
      });
  }, 1000 * 60 * 60);
});

bot.on("message", (ctx) => {
  const town = ctx.message.text;
  let lastUV;
  getUVByTownName(town)
    .then((res) => {
      let currentUV = res.current.uv;
      {
        lastUV = currentUV;
        ctx.reply(`УФ индекс в ${res.location.name} равен ${currentUV}.`);

        setTimeout(() => {
          replies(ctx, currentUV);
        }, 2000);
      }
    })
    .catch((err) => {
      console.log("error: ", err);
      ctx.reply(`Что-то пошло не по плану, сори..`);
      ctx.reply(`Попробуйте еще`);
    });

  setInterval(() => {
    getUVbyLocation(lat, lon)
      .then((res) => {
        let currentUV = res.current.uv;
        if (currentUV !== lastUV) {
          ctx.reply(
            `УФ индекс изменился в ${res.location.name} до ${currentUV}.`
          );

          setTimeout(() => {
            replies(ctx, currentUV);
          }, 2000);

          lastUV = currentUV;
        } else {
          console.log("index didnt change");
        }
      })
      .catch((err) => {
        console.log("error: ", err);
      });
  }, 1000 * 60 * 60);
});

bot.launch();
