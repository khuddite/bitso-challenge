import * as z from "zod";

const schema = z.object({
  totalSupply: z.string(),
  currentBalance: z.string(),
  address: z.string(),
  to: z.string().min(1, { message: "Recipient address is required." }),
  value: z.number().gt(0, { message: "Amount must be greater than 0." }),
});

export default schema;
