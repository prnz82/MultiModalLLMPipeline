const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

function fileToGenerativePart(buffer, mimeType) {
    return {
        inlineData: {
            data: buffer.toString('base64'),
            mimeType
        },
    };
}

async function geminiImageToText(imageBuffer, mimeType = 'image/jpeg') {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const imagePart = fileToGenerativePart(imageBuffer, mimeType);
        const prompt = "Describe this image in detail.";
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        return response.text();
    } catch (error) {
        throw new Error("Failed to caption image: " + error.message);
    }
}

async function geminiAudioToText(audioBuffer, mimeType = 'audio/wav') {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const audioPart = fileToGenerativePart(audioBuffer, mimeType);
        const prompt = "Transcribe this audio file exactly as spoken.";
        const result = await model.generateContent([prompt, audioPart]);
        const response = await result.response;
        return response.text();
    } catch (error) {
        throw new Error("Failed to transcribe audio: " + error.message);
    }
}

async function runMultiStepReasoning(intermediateText, modality, intent) {
    try {
        const analysisPrompt = `
        As an AI assistant, analyze the following raw output from a ${modality}-to-text model:
        "${intermediateText}"
        
        Tasks:
        1. Correct potential errors.
        2. Provide a detailed explanation.
        3. Identify key entities.
        
        Output Format:
        Validation: [Corrected text]
        Detailed Analysis: [Analysis]
        Key Elements: [List]
        `;

        const analysisResult = await model.generateContent(analysisPrompt);
        const analysisResponse = analysisResult.response.text();

        let intentPrompt = "";
        switch (intent.toLowerCase()) {
            case 'describe':
                intentPrompt = "Provide a rich, descriptive narrative based on the analysis.";
                break;
            case 'explain technically':
                intentPrompt = "Explain the content from a technical perspective, using precise terminology.";
                break;
            case 'simplify for a beginner':
                intentPrompt = "Explain the content as if to a 5-year-old or a complete beginner. Use analogies.";
                break;
            case 'summarize':
                intentPrompt = "Provide a concise summary in 1-2 sentences.";
                break;
            default:
                intentPrompt = "Describe the content clearly.";
        }

        const finalPrompt = `
        Role: Intelligent Assistant.
        Context: Analyzed ${modality} input.
        
        Raw Input: "${intermediateText}"
        Analysis: ${analysisResponse}
        
        User Intent: ${intent}
        Instruction: ${intentPrompt}
        
        Task: Generate the final response for the user based strictly on the User Intent.
        `;

        const finalResult = await model.generateContent(finalPrompt);
        const finalResponseText = finalResult.response.text();

        return {
            text: finalResponseText,
            usageMetadata: finalResult.response.usageMetadata
        };

    } catch (error) {
        throw new Error("Reasoning failed: " + error.message);
    }
}

module.exports = { runMultiStepReasoning, geminiImageToText, geminiAudioToText };
