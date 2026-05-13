const { geminiModel } = require("../config/gemini");

const getAIResponse = async (prompt) => {
  try {
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();

    // Strip markdown code fences if Gemini wraps response in ```json
    const clean = text.replace(/```json|```/g, "").trim();

    return JSON.parse(clean);
  } catch (error) {
    // Handle JSON parse errors separately
    if (error instanceof SyntaxError) {
      console.error("AI Service JSON Parse Error - Raw response was not valid JSON");
      throw new Error("AI returned invalid JSON. Please try again.");
    }
    console.error("AI Service Error:", error.message);
    throw error;
  }
};

module.exports = { getAIResponse };