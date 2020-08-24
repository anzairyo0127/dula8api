/* eslint @typescript-eslint/camelcase: 0 */
import schema from '../../Models/schema';

declare interface HyDatabase {
  users: typeof schema.users.Users,
  programs: typeof schema.programs.Programs;
}