const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// استبدال YOUR_TELEGRAM_BOT_TOKEN بتوكين البوت الخاص بك
const bot = new TelegramBot('6451818384:AAHpi4CLY0COZz8dN3kfLPxOx09GJh-wS8Y', { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `مرحبًا بك في البوت! يمكنك استخدام الأمر /ip للحصول على معلومات عن عنوان IP معين.`;
  bot.sendMessage(chatId, welcomeMessage);
});

bot.on('message', async (msg) => {
  if (msg.reply_to_message && msg.reply_to_message.text === "قم بإرسال عنوان IP للحصول على المعلومات.") {
    const chatId = msg.chat.id;
    const ip = msg.text.trim();

    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}`);
      const data = response.data;

      // استخراج المعلومات التي ترغب في عرضها من الاستجابة
      const country = data.country;
      const city = data.city;
      const isp = data.isp;

      // إرسال المعلومات إلى المستخدم
      const message = `الدولة: ${country}\nالمدينة: ${city}\nمزود الخدمة: ${isp}`;
      bot.sendMessage(chatId, message);
    } catch (error) {
      console.log(error);
      bot.sendMessage(chatId, "حدث خطأ أثناء إرسال عنوان IP. يرجى التأكد من صحة عنوان IP وإعادة المحاولة.");
    }
  } else if (msg.text === "/ip") {
    const chatId = msg.chat.id;
    const options = {
      reply_markup: {
        force_reply: true
      }
    };

    bot.sendMessage(chatId, "قم بإرسال عنوان IP للحصول على المعلومات.", options);
  }
});