import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface MathSolution {
  problemStatement: string;
  strategy: string;
  steps: {
    desc: string;
    latex: string;
    explanation: string;
  }[];
  finalAnswer: string;
  proTip: string;
  coreConcept: string;
  level: string;
}

export async function solveWithAI(problem: string): Promise<MathSolution> {
  const prompt = `
    You are a World-Class Mathematics Tutor and Computational Logic Expert. 
    Objective: Solve the following mathematical problem for a student.
    
    Problem: "${problem}"
    
    Instructions:
    1. Identify the grade level (e.g., Primary Arithmetic, Secondary Algebra, AP Calculus).
    2. Provide a "Strategy" (The Why). Keep it extremely concise and direct.
    3. Breakdown into Steps: Keep explanation of each step extremely brief (1-2 sentences max) to ensure lightning-fast generation.
    4. Explain the "Core Concept". Keep it concise.
    5. Provide a "Pro-Tip". Keep it short.
    
    Ensure all mathematical notation in "latex" fields is valid LaTeX (standard KaTeX format).
    Do NOT include $ or $$ packaging markers inside the "latex" properties; just the formulas themselves.
    The "latex" field for each step should contain the relevant portion of the math.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problemStatement: { type: Type.STRING },
            strategy: { type: Type.STRING },
            coreConcept: { type: Type.STRING },
            level: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  desc: { type: Type.STRING },
                  latex: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ['desc', 'latex', 'explanation']
              }
            },
            finalAnswer: { type: Type.STRING },
            proTip: { type: Type.STRING }
          },
          required: [
            'problemStatement',
            'strategy',
            'coreConcept',
            'level',
            'steps',
            'finalAnswer',
            'proTip'
          ]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");
    
    return JSON.parse(text) as MathSolution;
  } catch (error: any) {
    console.error("Gemini Math Solving Error:", error);
    // Extract more detail if available from the SDK error
    const message = error.message || (error.error && error.error.message) || String(error);
    const detailedError = new Error(message);
    (detailedError as any).status = error.status || (error.error && error.error.code);
    throw detailedError;
  }
}

/**
 * Explains a mathematical concept in Khmer, adjusted to the student's grade level.
 */
export async function explainConceptWithAI(conceptName: string, gradeLevel: string, userQuestion?: string): Promise<string> {
  const prompt = `
    You are a friendly, encouraging Cambodian Mathematics Teacher (គ្រូបង្រៀនគណិតវិទ្យាជនជាតិខ្មែរដ៏រួសរាយ និងពូកែពន្យល់).
    Objective: Explain the mathematical concept or lesson clearly to a student at the Grade Level: "${gradeLevel}".
    
    Concept/Lesson to explain: "${conceptName}"
    Student's specific question: "${userQuestion || 'សូមជួយសម្រាយ និងពន្យល់មេរៀននេះឱ្យបានលម្អិត និងងាយយល់បំផុត។'}"
    
    Instructions:
    1. Response Language: ALWAYS reply strictly in beautiful, polite, grammatically correct Khmer language (ភាសាខ្មែរ).
    2. Tone: Highly encouraging, motivating, clear, and perfectly tailored to the pedagogical needs of a student at "${gradeLevel}".
    3. Formatting: Output clean Markdown. Use headings, bullet points, bold text, and math blocks (KaTeX notation) where appropriate. Keep it highly readable and visually spaced.
    4. Elements of the explanation:
       - 🎯 សេចក្ដីពន្យល់ងាយយល់ (Clear & Simple Explanation)
       - 💡 រូបមន្តគ្រឹះ ឬទ្រឹស្ដីបទ (Basic Formula / Theorem with explanation of each symbol in Khmer)
       - 📈 ឧទាហរណ៍ជាក់ស្ដែង និងរបៀបដោះស្រាយជំហានៗ (A step-by-step practical example)
       - 🧠 គន្លឹះដោះស្រាយរហ័ស ឬវិធីចងចាំ (Smart shortcut or memory tip)
       - 🏆 លំហាត់អនុវត្តសាកល្បងខ្នាតតូចសម្រាប់សិស្ស (A tiny interactive exercise to try)
       
    Make sure the Khmer explanation is completely natural, clear, and doesn't sound like literal machine translation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    return response.text || "សូមអភ័យទោស៖ មិនទាន់មានចម្លើយពន្យល់ពី AI នៅឡើយទេ។";
  } catch (error: any) {
    console.error("Gemini Explanation Error:", error);
    return "សូមអភ័យទោស៖ មានបញ្ហាបច្ចេកទេសក្នុងការភ្ជាប់ទៅកាន់ AI គ្រូបង្រៀន។ សូមព្យាយាមម្ដងទៀតនៅពេលក្រោយ។";
  }
}


