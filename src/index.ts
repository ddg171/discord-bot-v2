// Require the necessary discord.js classes
import { Client, Events, GatewayIntentBits, Message } from 'discord.js';
import { config } from 'dotenv';
import { handleError } from './feature/error';
import { notifyBotReady } from './feature/status';
import { isBotMentioned, parseMessage } from './helpers/command';
import { IgnorableError } from './helpers/permission';
import { handleRoute, routes } from './routes';
import { isValidCommand, showErrorInfo, showMessageInfo } from './utils';
const { Guilds, GuildMessages, MessageContent, GuildMembers } =
  GatewayIntentBits;
config();

const token = process.env.DISCORD_TOKEN;
const isDebug = process.env.DEBUG === 'true';

// Create a new client instance
const client = new Client({
  intents: [Guilds, GuildMessages, MessageContent, GuildMembers],
});

async function handleMessage(message: Message) {
  // botは無視
  if (message.author.bot) return;
  // 編集も無視
  if (message.editedTimestamp) return;
  // 自分自身が送信したメッセージも無視
  if (message.author.id === client.user?.id) return;

  if (isDebug) {
    showMessageInfo(message);
    console.log(message.author.id === client.user?.id);
  }
  try {
    const isMentioned = isBotMentioned(message);
    if (!isMentioned) {
      return;
    }

    const commandArgs = { ...parseMessage(message), client };
    if (!isValidCommand(routes, commandArgs.command)) {
      throw new Error('Invalid command');
    }
    const resultMessage = await handleRoute(commandArgs)(commandArgs);
    message.reply(resultMessage);
  } catch (error) {
    if (isDebug) {
      showErrorInfo(error);
      if (error instanceof IgnorableError) {
        console.warn(`Ignorable error: ${error.message}`);
      }
    }
    handleError(error, message);
  }
}

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}/debug:${isDebug}`);
  if (!isDebug) {
    await notifyBotReady(readyClient);
  }
});

// メッセージを受信したときのイベントリスナー
client.on(Events.MessageCreate, handleMessage);

// Log in to Discord with your client's token
client.login(token);
