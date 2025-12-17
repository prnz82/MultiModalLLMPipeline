const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { runMultiStepReasoning, geminiImageToText, geminiAudioToText } = require('./utils/geminiClient');
const { getFromCache, setInCache } = require('./utils/cache');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
    console.error("ERROR: Missing GEMINI_API_KEY in .env file.");
    process.exit(1);
}

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

app.post('/api/process', upload.single('file'), async (req, res) => {
    const startTime = Date.now();
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const { intent } = req.body;
        if (!intent) {
            return res.status(400).json({ error: 'Intent is required.' });
        }

        const mimeType = req.file.mimetype;
        const fileBuffer = req.file.buffer;

        let intermediateText = '';
        let modality = '';

        if (mimeType.startsWith('image/')) {
            modality = 'image';
            intermediateText = await geminiImageToText(fileBuffer, mimeType);
        } else if (mimeType.startsWith('audio/')) {
            modality = 'audio';
            intermediateText = await geminiAudioToText(fileBuffer, mimeType);
        } else {
            return res.status(400).json({ error: 'Unsupported file type. Please upload Image or Audio.' });
        }

        const cacheKey = `${modality}:${intent}:${intermediateText}`;

        const cachedResult = getFromCache(cacheKey);
        if (cachedResult) {
            const endTime = Date.now();
            return res.json({
                ...cachedResult,
                latencyMs: endTime - startTime,
                cached: true
            });
        }

        const llmResult = await runMultiStepReasoning(intermediateText, modality, intent);

        const endTime = Date.now();
        const latencyMs = endTime - startTime;

        const finalResponse = {
            result: llmResult.text,
            tokenEstimate: llmResult.usageMetadata ? llmResult.usageMetadata.totalTokenCount : estimateTokens(llmResult.text),
            latencyMs: latencyMs,
            intermediateText: intermediateText,
            cached: false
        };

        setInCache(cacheKey, {
            result: finalResponse.result,
            tokenEstimate: finalResponse.tokenEstimate,
            intermediateText: finalResponse.intermediateText
        });

        res.json(finalResponse);

    } catch (error) {
        console.error('Error in /api/process:', error);
        res.status(500).json({
            error: error.message || 'Internal Server Error',
            details: error.response ? error.response.data : null
        });
    }
});

function estimateTokens(text) {
    return Math.ceil(text.length / 4);
}

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
