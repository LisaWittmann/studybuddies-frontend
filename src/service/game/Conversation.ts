export class Message {
  id: string;
  text: string;
  itemName: string | undefined;
  responses: Array<Response>;

  constructor(
    id: string,
    text: string,
    itemName: string | undefined,
    responses: Array<Response>
  ) {
    this.id = id;
    this.text = text;
    this.itemName = itemName;
    this.responses = responses;
  }
}

export class Response {
  id: string;
  text: string;
  redirect: string | undefined;

  constructor(id: string, text: string, redirect?: string) {
    this.id = id;
    this.text = text;
    this.redirect = redirect;
  }
}
