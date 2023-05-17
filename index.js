const mySecret = process.env['TG_API'];
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const { getImage, getChat } = require("./Helper/functions");
const { Telegraf } = require("telegraf");

const configuration = new Configuration({ apiKey: process.env.API });
const openai = new OpenAIApi(configuration);
module.exports = openai;

const bot = new Telegraf(process.env.TG_API);

bot.start((ctx) => ctx.reply("Bienvenue, je suis CleverCodex, vous pouvez me demander n'importe quoi"));
bot.help((ctx) => {
  ctx.reply("Ce bot peut exécuter la commande suivante \n /image -> pour créer une image à partir du texte \n /ask -> ank any from me ");
});

// Commande d'image
bot.command("image", async (ctx) => {
  const text = ctx.message.text?.replace("/image", "")?.trim().toLowerCase();
  if (text) {
    const res = await getImage(text);
    if (res) {
      ctx.sendChatAction("upload_photo");
      ctx.telegram.sendPhoto(ctx.message.chat.id, res, { reply_to_message_id: ctx.message.message_id });
    }
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "Vous devez donner une description après /image",
      { reply_to_message_id: ctx.message.message_id }
    );
  }
});

// Commande de chat
bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  if (text) {
    ctx.sendChatAction("typing");
    if (text.toLowerCase().includes("quel est ton nom")) {
      ctx.telegram.sendMessage(ctx.message.chat.id, "Mon nom est Clever.", { reply_to_message_id: ctx.message.message_id });
    } else if (text.toLowerCase().includes("qui est ton développeur")) {
      ctx.telegram.sendMessage(ctx.message.chat.id, "Je suis développé par Dekscrypt.", { reply_to_message_id: ctx.message.message_id });
    } else if (text.toLowerCase().includes("qui est dekscrypt")) {
      ctx.telegram.sendMessage(ctx.message.chat.id, "Dekscrypt est un développeur informatique Full Stack passionné et talentueux. Il a réalisé de nombreux projets variés qui ont contribué à résoudre des problèmes et à apporter des solutions innovantes. Sa maîtrise des langages de programmation tant côté front-end que back-end lui permet de créer des applications web robustes et performantes. Si vous avez besoin d'un développeur compétent et fiable pour réaliser vos projets, n'hésitez pas à le contacter via https://t.me/dekscrypt.", { reply_to_message_id: ctx.message.message_id });
    } else {
      const res = await getChat(text);
      if (res) {
        ctx.telegram.sendMessage(ctx.message.chat.id, res, { reply_to_message_id: ctx.message.message_id });
      }
    }
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "Veuillez demander quelque chose après /ask",
      { reply_to_message_id: ctx.message.message_id }
    );
  }
});

bot.launch();
