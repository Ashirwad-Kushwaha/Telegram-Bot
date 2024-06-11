import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import fetch from "node-fetch";
import http from "http";
import https from "https";

dotenv.config();

const httpAgent = new http.Agent({ timeout: 30000 }); // 30 seconds timeout
const httpsAgent = new https.Agent({ timeout: 30000 }); // 30 seconds timeout

const bot = new Telegraf(process.env.TELEGRAM_BOT_API_TOKEN, {
    telegram: {
        agent: (parsedUrl) => parsedUrl.protocol === 'http:' ? httpAgent : httpsAgent,
    },
});

const promotionalText = `Stay connected with us:-
https://t.me/filmy_duniya_main_channel

For 18+ viral videos just click on the bot and press start
🔞@Terabox_viral_movies_series_bot🔞
🔞@Mdisk_movies_serieshd_bot🔞`;

// Function to remove URLs from a string
const removeURLs = (text) => {
    if (!text) return '';
    const urlPattern = /(https?:\/\/[^\s]+|@[^\s]+)/g;
    return text.replace(urlPattern, '');
};

// Handling all media types
bot.on("message", async (ctx) => {
    try {
        const from = ctx.update.message.from;
        const message = ctx.update.message;

        const options = {};

        if (message.photo) {
            const photo = message.photo;
            const caption = ctx.message.caption ? removeURLs(ctx.message.caption) : 'photo';
            options.caption = `${caption}\n\n${promotionalText}`;
            await ctx.telegram.sendPhoto(from.id, photo[photo.length - 1].file_id, options);
        } else if (message.video) {
            const video = message.video;
            const caption = video.caption ? removeURLs(video.caption) : (video.file_name || 'video');
            options.caption = `${caption}\n\n${promotionalText}`;
            await ctx.telegram.sendVideo(from.id, video.file_id, options);
        } else if (message.audio) {
            const audio = message.audio;
            const caption = audio.caption ? removeURLs(audio.caption) : (audio.file_name || 'audio');
            options.caption = `${caption}\n\n${promotionalText}`;
            await ctx.telegram.sendAudio(from.id, audio.file_id, options);
        } else if (message.document) {
            const document = message.document;
            const caption = document.caption ? removeURLs(document.caption) : (document.file_name || 'document');
            options.caption = `${caption}\n\n${promotionalText}`;
            await ctx.telegram.sendDocument(from.id, document.file_id, options);
        } else if (message.voice) {
            const caption = ctx.message.caption ? removeURLs(ctx.message.caption) : 'voice message';
            options.caption = `${caption}\n\n${promotionalText}`;
            await ctx.telegram.sendVoice(from.id, message.voice.file_id, options);
        } else if (message.sticker) {
            await ctx.telegram.sendSticker(from.id, message.sticker.file_id);
        } else if (message.video_note) {
            const caption = ctx.message.caption ? removeURLs(ctx.message.caption) : 'video note';
            options.caption = `${caption}\n\n${promotionalText}`;
            await ctx.telegram.sendVideoNote(from.id, message.video_note.file_id, options);
        } else if (message.text) {
            const text = removeURLs(ctx.message.text) + `\n\n${promotionalText}`;
            await ctx.telegram.sendMessage(from.id, text);
        } else {
            await ctx.reply("Unsupported media type");
        }
    } catch (error) {
        console.error("Error in media message handler: ", error);
    }
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
