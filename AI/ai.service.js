const { GoogleGenAI } = require("@google/genai");
const { searchProducts } = require("./productTools");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-3.5-flash-lite";

const searchProductsTool = {
  type: "function",
  name: "search_nexora_products",
  description:
    "Search the real Nexora product database whenever a customer asks to find, recommend, or compare products, or asks for products within a budget.",
  parameters: {
    type: "object",
    properties: {
      search: {
        type: "string",
        description:
          "A keyword describing the desired product, such as shoes, shirt, laptop, bag, or watch.",
      },
      maxPrice: {
        type: "number",
        description:
          "The maximum price in Indian rupees, if the customer specifies a budget.",
      },
    },
    required: ["search"],
  },
};

const generateAIResponse = async (message) => {
  const interaction = await ai.interactions.create({
    model: MODEL,
    system_instruction: `
You are Nexora AI, an e-commerce shopping assistant.

When a customer asks to find, recommend, or search for products,
you MUST call the search_nexora_products tool before answering.

Use the customer's product keyword and budget in the tool arguments.

Only recommend products returned by the tool.
Never invent product names, prices, stock, ratings, or reviews.
If no matching products are returned, say so clearly.
Prices are in Indian rupees.

After receiving the tool results, summarize the most relevant products.
If the customer asks a general question unrelated to products,
answer conversationally.
`,
    input: message,
    tools: [searchProductsTool],
  });
  const functionCall = interaction.steps?.find(
    (step) => step.type === "function_call",
  );

  if (!functionCall) {
    return {
      reply:
        interaction.output_text || "Sorry, I couldn't generate a response.",
      products: [],
    };
  }
  if (functionCall.name !== "search_nexora_products") {
    throw new Error(`Unexpected tool: ${functionCall.name}`);
  }

  const args = functionCall.arguments || {};
  const products = await searchProducts({
    search: String(args.search || ""),
    maxPrice:
      args.maxPrice === undefined || args.maxPrice === null
        ? null
        : Number(args.maxPrice),
  });

  const finalInteraction = await ai.interactions.create({
    model: MODEL,
    previous_interaction_id: interaction.id,
    input: [
      {
        type: "function_result",
        name: functionCall.name,
        call_id: functionCall.id,
        result: [
          {
            type: "text",
            text: JSON.stringify(products),
          },
        ],
      },
    ],
  });

  return {
    reply:
      finalInteraction.output_text || "Here are the products I found for you.",
    products,
  };
};

const generateProductDescription = async ({
  name,
  category,
  price,
  features,
}) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  const prompt = ` You are a professional e-commerce product copywriter for Nexora. Generate a clear, attractive product description using the details below. Product name: ${name} Category: ${category || "Not specified"} Price: ${price ? `₹${price}` : "Not specified"} Product features: ${features || "Not specified"} Rules: - Write in simple, professional English. - Keep the description between 80 and 120 words. - Highlight the product's usefulness and key features. - Do not invent specifications, materials, warranties, ratings, or benefits. - Do not repeat the product name excessively. - Return only the description, without a heading or quotation marks. `;

  const interaction = await ai.interactions.create({
    model: "gemini-3.8-flash",
    input: prompt,
  });

  const description = interaction.output_text?.trim();

  if (!description) {
    throw new Error("AI could not generate a product description");
  }
  return description;
};

module.exports = {
  generateAIResponse,
  generateProductDescription,
};
