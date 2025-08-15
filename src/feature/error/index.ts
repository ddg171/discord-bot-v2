import { Message } from 'discord.js';
import { TooBusyError } from '../../helpers/command';
import {
  IgnorableError,
  PermissionError,
  StatusError,
} from '../../helpers/permission';
import { ValidationError } from '../../utils/validator';

export function handleError(error: Error, message: Message) {
  console.error('Error occurred:', error);
  if (error instanceof IgnorableError) {
    return;
  }
  if (error instanceof ValidationError) {
    message.reply(`入力内容がおかしい。 ${error.message}`);
    return;
  }
  if (error instanceof StatusError) {
    message.reply(`答える必要はない`);
    return;
  }
  if (error instanceof TooBusyError) {
    message.reply('今忙しい');
    return;
  }
  if (error instanceof PermissionError) {
    message.reply('その資格はない');
    return;
  }
  // 指定されたチャンネル内でエラー
  message.reply('何が言いたいのかわからん');
}
