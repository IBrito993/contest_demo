import { z } from "zod";

export const CATEGORIES = [
  "Italian",
  "Mexican",
  "Bakery",
  "Fast Food",
  "Seafood",
  "Steakhouse",
  "Vegan",
  "Other",
] as const;

export const registrationSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(7, "Phone must be at least 7 digits")
    .max(20)
    .regex(/^[+\d\s\-(). ]+$/, "Invalid phone number"),
  restaurantName: z
    .string()
    .min(2, "Restaurant name must be at least 2 characters")
    .max(150),
  category: z.enum(CATEGORIES, { message: "Please select a valid category" }),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const voteSchema = z.object({
  participantId: z.string().min(1),
  voterEmail: z.string().email("Invalid email address"),
});

export type VoteInput = z.infer<typeof voteSchema>;
