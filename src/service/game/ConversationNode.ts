import { Item } from "@/service/labyrinth/Item";

export class ConversationNode {
  key: string;
  text: string | undefined;
  answer: string | undefined;
  item: Item | undefined;

  leftNode: ConversationNode | undefined;
  rightNode: ConversationNode | undefined;

  constructor(
    key: string,
    answer?: string,
    text?: string,
    leftNode?: ConversationNode,
    rightNode?: ConversationNode,
    item?: Item
  ) {
    this.key = key;
    this.text = text;
    this.answer = answer;
    this.leftNode = leftNode;
    this.rightNode = rightNode;
    this.item = item;
  }
}
