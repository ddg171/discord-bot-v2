import { TooBusyError } from '@/helpers/command';
import {
  IgnorableError,
  PermissionError,
  StatusError,
} from '@/helpers/permission';
import { ValidationError } from '@/utils/validator';
import { Message } from 'discord.js';

export function handleError(error: Error, message: Message) {
  if (error instanceof IgnorableError) {
    return;
  }
  if (error instanceof ValidationError) {
    message.reply(`入力内容がおかしい。 ${error.message}`);
  }
  if (error instanceof StatusError) {
    message.reply(`答える必要はない`);
  }
  if (error instanceof TooBusyError) {
    message.reply('今忙しい');
    return;
  }
  if (error instanceof PermissionError) {
    message.reply('その資格はない');
    return;
  }
  message.reply('何が言いたいのかわからん');
}
