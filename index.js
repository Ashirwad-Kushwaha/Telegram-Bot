import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_API_TOKEN);

const promotionalText = `Stay connected with us:-
 https://t.me/filmy_duniya_main_channel

 For 18+ viral videos just click on the bot and press start
 🔞@Terabox_viral_movies_series_bot🔞
 🔞@Mdisk_movies_serieshd_bot🔞`;

bot.start(async (ctx) => {
    const from = ctx.update.message.from;
    await ctx.replyWithHTML(`Hello <b>${from.first_name}</b> kaise ho`);
});

bot.on(message("text"), async (ctx) => {
    const from = ctx.update.message.from;
    const text = ctx.update.message.text;
    console.log(text);
});

// Handling photos
bot.on(message("photo"), async (ctx) => {
    const from = ctx.update.message.from;
    const photo = ctx.update.message.photo;
    console.log(photo);
    await ctx.telegram.sendPhoto(from.id, photo[photo.length - 1].file_id, { caption: promotionalText });
});

// Handling videos
bot.on(message("video"), async (ctx) => {
    const from = ctx.update.message.from;
    const video = ctx.update.message.video;

    // console.log(video)

    const fileName = video.file_name || 'video.mp4'; 
    const caption = fileName + "\n\n" +promotionalText
    // promotionalText =fileName + "\n\n" +promotionalText


    await ctx.telegram.sendVideo(from.id, video.file_id, {
        caption
    });
});

// Handling audio
bot.on(message("audio"), async (ctx) => {
    const from = ctx.update.message.from;
    const audio = ctx.update.message.audio;

    const fileName = audio.file_name || 'audio.mp3'; // Default to 'audio.mp3' if filename is not available

    await ctx.telegram.sendAudio(from.id, audio.file_id, {
        caption: promotionalText,
        filename: fileName,
    });
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
