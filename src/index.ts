// Require the necessary discord.js classes
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { handleMessage } from './routes';
const { Guilds, GuildMessages, MessageContent } = GatewayIntentBits;
config();

const token = process.env.DISCORD_TOKEN;
console.log('Token:', token);

// Create a new client instance
const client = new Client({ intents: [Guilds, GuildMessages, MessageContent] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// メッセージを受信したときのイベントリスナー
client.on(Events.MessageCreate, handleMessage);

// Log in to Discord with your client's token
client.login(token);
