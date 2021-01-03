import fetch from "node-fetch";

export class Discord {
  uri: string;
  username: string;
  constructor(uri: string, username: string) {
    this.uri = uri;
    this.username = username;
  };

  send = async (message: string) => {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const body = {
      username: this.username,
      content: message,
    };

    const result = await fetch(this.uri, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
  };
};
