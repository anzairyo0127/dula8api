import { Pool } from "pg";

import { Posts } from "./Models/Posts";
import { DelPosts } from "./Models/DelPosts";
export let postsClient: Posts;
export let delPostsClient: DelPosts;

export function create_posts(uri: string) {
  const conn1 = new Pool({ connectionString: uri });
  postsClient = new Posts(conn1);
  delPostsClient = new DelPosts(conn1);
  postsClient.insertPassword = async (a, b) => {
    await delPostsClient.insertDelPassword(a, b);
  };
}
