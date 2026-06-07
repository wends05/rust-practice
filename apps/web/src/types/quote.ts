export type Quote = {
  id: string;
  text: string;
  author: string;
};

export type CreateQuoteInput = {
  text: string;
  author: string;
};
