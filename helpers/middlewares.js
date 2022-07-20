const fetch = require("node-fetch");
require("dotenv").config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

const getUVbyLocation = async (lat, lon) => {
  const api = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}`;
  const res = await fetch(api);
  const data = await res.json();
  return data;
};

const getUVByTownName = async (town) => {
  const api = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${town}`;
  res = await fetch(api);
  const data = await res.json();
  return data;
};

const replies = (ctx, index) => {
  if (index > 2) {
    ctx.reply(
      "Ну, это не сама хорошо. " +
        "Лучше 8-и, конечно, но тем не менее: незабудьте надеть очки и панамку. " +
        "А лучше зонтиком накрыться вообще... Или крем!"
    );
  } else if (index > 7) {
    ctx.reply(
      "Во такое уже даже не прикол... " +
        "Не уверен что на улице вообще можно что-то делать. " +
        "К слову, больше восьми только на солнце :^("
    );
  } else {
    ctx.reply("Всё топ! Ходите как хотите");
  }
};

module.exports = {
  getUVbyLocation: getUVbyLocation,
  getUVByTownName: getUVByTownName,
  replies: replies,
};
