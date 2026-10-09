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

  // console.log("GEMINI STEPS:", JSON.stringify(interaction.steps, null, 2));

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
  // if (!functionCall) {
  //   console.log("Gemini did not request a product search.");
  //   return interaction.output_text || "Sorry, I couldn't generate a response.";
  // }

  if (functionCall.name !== "search_nexora_products") {
    throw new Error(`Unexpected tool: ${functionCall.name}`);
  }

  const args = functionCall.arguments || {};

  // console.log("PRODUCT TOOL ARGUMENTS:", args);

  const products = await searchProducts({
    search: String(args.search || ""),
    maxPrice:
      args.maxPrice === undefined || args.maxPrice === null
        ? null
        : Number(args.maxPrice),
  });

  // console.log("PRODUCTS RETURNED FROM MYSQL:", products.length);

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

module.exports = {
  generateAIResponse,
};
