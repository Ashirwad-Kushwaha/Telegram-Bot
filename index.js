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
    try {
        const from = ctx.update.message.from;
        await ctx.replyWithHTML(`Hello <b>${from.first_name}</b> kaise ho`);
    } catch (error) {
        console.error("Error in bot.start: ", error);
    }
});

bot.on(message("text"), async (ctx) => {
    try {
        const from = ctx.update.message.from;
        const text = ctx.update.message.text;
        // console.log(text);
    } catch (error) {
        console.error("Error in text message handler: ", error);
    }
});

// Handling photos
bot.on(message("photo"), async (ctx) => {
    try {
        const from = ctx.update.message.from;
        const photo = ctx.update.message.photo;
        console.log(photo);
        await ctx.telegram.sendPhoto(from.id, photo[photo.length - 1].file_id, { caption: promotionalText });
    } catch (error) {
        console.error("Error in photo message handler: ", error);
    }
});

// Handling videos
bot.on(message("video"), async (ctx) => {
    try {
        const from = ctx.update.message.from;
        const video = ctx.update.message.video;

        // console.log(video)

        const fileName = video.file_name || 'video.mp4'; 
        const caption = `${fileName}\n\n${promotionalText}`;

        await ctx.telegram.sendVideo(from.id, video.file_id, {
            caption
        });
    } catch (error) {
        console.error("Error in video message handler: ", error);
    }
});

// Handling audio
bot.on(message("audio"), async (ctx) => {
    try {
        const from = ctx.update.message.from;
        const audio = ctx.update.message.audio;

        const fileName = audio.file_name || 'audio.mp3'; // Default to 'audio.mp3' if filename is not available

        await ctx.telegram.sendAudio(from.id, audio.file_id, {
            caption: promotionalText,
            filename: fileName,
        });
    } catch (error) {
        console.error("Error in audio message handler: ", error);
    }
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
