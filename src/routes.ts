import {
  assignRole,
  createRole,
  deleteRole,
  listRoles,
  listUsersWithRole,
  removeRole,
} from './feature/role';
import { sendStatus, setupBot, startWatching } from './feature/status';

export const routes = {
  setup: setupBot,
  watch: startWatching,
  poripori: sendStatus,
  role: {
    create: createRole,
    delete: deleteRole,
    list: listRoles,
    user: listUsersWithRole,
    as: assignRole,
    remove: removeRole,
  },
};
