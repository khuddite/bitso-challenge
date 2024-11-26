import * as z from "zod";

const schema = z.object({
  totalSupply: z.string(),
  currentBalance: z.string(),
  address: z.string(),
  to: z.string().min(1, { message: "Recipient address is required." }),
  value: z.string().min(1, { message: "Amount is required." }),
});

export default schema;
