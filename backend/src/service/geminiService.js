
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const analyzeImage = async (imageBuffer, mimeType) => {
    try {

        const prompt = `
            You are a waste management and recycling assistant.

            Analyze the provided image and identify the waste/material shown.

            Then suggest practical ways to:
            1. Reuse the item
            2. Make crafts or useful products from it
            3. Recycle it if reuse is not practical

            Return the response in JSON format:

            {
                "item": "name of the item",
                "material": "material type",
                "condition": "usable/damaged/etc",
                "reuseIdeas": [
                    {
                        "title": "idea name",
                        "description": "short explanation",
                        "difficulty": "Easy/Medium/Hard",
                        "materials": [],
                        "steps": []
                    }
                ],
                "recyclingAdvice": "recycling or disposal advice"
            }

            Only return valid JSON.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    text: prompt
                },
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: imageBuffer.toString("base64")
                    }
                }
            ]
        });

        const text = response.text;

        // Remove markdown code fences if Gemini adds them
        const cleanedText = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleanedText);

    } catch (error) {
        console.error("Gemini image analysis error:", error);
        throw new Error("Failed to analyze image with Gemini");
    }
};

module.exports = {
    analyzeImage
};
