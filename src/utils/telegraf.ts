const {Telegraf} = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

const GROUP_ID = process.env.GROUP_ID;

export async function sendToGroup(messages: string[]) {
  try {
    const messageStr = messages.filter((message) => !!message).join(' | ');
    await bot.telegram.sendMessage(GROUP_ID, messageStr);
    console.log('Message sent successfully.');
  } catch (error) {
    console.error('Error sending message:', error);
  }
}
