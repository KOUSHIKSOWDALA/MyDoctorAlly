import { OpenAI } from 'openai';

import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.API_KEY,
});

const report_gen = async (clean_text) => {
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: "You are a Doctor assistant. Analyze the conversation between Doctor and Patient given as input and generate the diagnosis and prescription and required medical test for the patient as a report and format the report."
            },
            {
                role: "user",
                content: clean_text
            }
        ]
    });

    return response.choices[0].message.content;
};


export default report_gen;