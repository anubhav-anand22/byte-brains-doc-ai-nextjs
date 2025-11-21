import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { API_KEY } from "@/const/apiKye";

const MEDICAL_KEYWORDS = [
  "fever",
  "cough",
  "pain",
  "headache",
  "rash",
  "nausea",
  "vomit",
  "bleed",
  "bleeding",
  "shortness of breath",
  "sob",
  "chest pain",
  "dizzy",
  "dizziness",
  "pregnancy",
  "pregnant",
  "blood pressure",
  "hypertension",
  "diabetes",
  "insulin",
  "allergy",
  "allergic",
  "infection",
  "infected",
  "antibiotic",
  "fracture",
  "broken",
  "surgery",
  "stroke",
  "heart attack",
  "psychosis",
  "depression",
  "suicide",
  "self-harm",
  "itch",
  "swelling",
  "severe",
  "urgent",
];

// simple heuristic: true if any medical keyword appears
function looksMedical(text = "") {
  const lower = text.toLowerCase();
  return MEDICAL_KEYWORDS.some((kw) => lower.includes(kw));
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ").at(1);

    if (!token) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    }

    const formData = await req.formData();
    const symp = (formData.get("symp") || "").toString().trim();
    const avatar = (formData.get("avatar") || null) as File | null;

    if (!symp || !avatar) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // quick heuristic check
    const heuristicMedical = looksMedical(symp);

    // Convert image to data URL (same as before)
    const base64Image = Buffer.from(await avatar.arrayBuffer()).toString("base64");
    const dataUrl = `data:${avatar.type};base64,${base64Image}`;

    const client = new Groq({
      apiKey: API_KEY.GROQ,
    });

    // Build system prompt that enforces structure & rules
    const systemPrompt = `
You are a clinical-assistant style medical responder. STRICT RULES:
1) First, determine if the user's input is a MEDICAL question about human health/problems. Output only JSON (no extra prose) with the keys:
   - "is_medical": boolean
   - "is_emergency": boolean
   - "emergency_reason": short string (if true)
   - "advice": short, focused medical advice (1-3 concise paragraphs).
   - "recommended_action": one of ["call_emergency", "see_primary", "self_care", "seek_urgent_care", "see_specialist"]
   - "confidence": number 0.0-1.0 (model confidence in classification)
   - "disclaimer": a single short sentence reminding user this is informational and not a substitute for professional care.

2) If the input is NOT a medical question, return JSON with is_medical:false and a short "advice" explaining you cannot help with non-medical questions. Do NOT provide non-medical content.

3) If is_medical is true, ONLY output medical advice (no marketing, no unrelated content). If dangerous or emergency features are present (e.g., chest pain, severe bleeding, difficulty breathing, unconsciousness, severe confusion, signs of stroke), set is_emergency:true and recommended_action:"call_emergency".

4) Keep the JSON valid and parsable. Do not output any extra commentary or markdown. Keep strings concise.

5) Use the provided user message and image to assess the problem. If image helps, mention that you used it in the "emergency_reason".

6) Always include a short "disclaimer" line in the JSON.

Respond only with the JSON object.
`;

    // If heuristic says non-medical, we can early-reject (optional) or still confirm via model.
    // Here: if heuristic is false, we still ask the model but emphasize classification step.
    // const userContent = ;

    const chatCompletion = await client.chat.completions.create({
      model: "meta-llama/llama-4-maverick-17b-128e-instruct",
      messages: [
        { role: "system", content: [{ type: "text", text: systemPrompt }] },
        {
          role: "user",
          content: [
            { type: "text", text: symp },
            { type: "image_url", image_url: { url: dataUrl } },
            {
              type: "text",
              text: `HeuristicMedical:${heuristicMedical}`, // inform model about heuristic
            },
          ],
        },
      ],
      // request 1 best answer
      max_tokens: 800,
      temperature: 0.0, // deterministic for safety
    });

    // The model is instructed to return JSON only. Try to parse it.
    const raw = chatCompletion.choices?.[0]?.message?.content;
    // content may be an array (per SDK); normalize to string
    let rawText = "";
    if (Array.isArray(raw)) {
      // join any text parts
      rawText = raw.map((part) => (part.type === "text" ? part.text : "")).join("");
    } else if (typeof raw === "string") {
      rawText = raw;
    } else if (raw && raw["type"] === "text") {
      rawText = raw["text"];
    }

    // attempt to find JSON in rawText
    let parsed;
    try {
      // Try direct JSON parse
      parsed = JSON.parse(rawText);
    } catch (e) {
      // attempt to extract first JSON substring
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch (e2) {
          parsed = null;
        }
      } else {
        parsed = null;
      }
    }

    if (!parsed) {
      // fallback error
      return NextResponse.json(
        { error: "Unable to parse model response as JSON", raw: rawText },
        { status: 502 }
      );
    }

    console.log(parsed);

    // If model classified as non-medical, reject
    if (!parsed.is_medical) {
      return NextResponse.json(
        {
          error: "Non-medical question detected. This endpoint accepts only medical questions.",
          model_output: parsed,
        },
        { status: 400 }
      );
    }

    // At this point it's medical. Return the structured advice.
    return NextResponse.json(
      {
        message: "success",
        data: parsed,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("route error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// // export const runtime = 'nodejs';
// // import firebaseAdmin from "firebase-admin";
// import { NextResponse } from "next/server";
// import { Groq } from "groq-sdk";
// import { API_KEY } from "@/const/apiKye";

// export async function POST(req: Request) {
//   try {
//     const token = req.headers.get("authorization")?.split(" ").at(1);

//     if (!token) {
//       return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
//     }

//     const formData = await req.formData();

//     const symp = formData.get("symp") as string;
//     const avatar = formData.get("avatar") as File | null;

//     if (
//       !symp ||
//       !avatar
//       //|| !avatar.type.includes("webp")
//     ) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const base64Image = Buffer.from(await avatar.arrayBuffer()).toString("base64");
//     const dataUrl = `data:${avatar.type};base64,${base64Image}`;

//     const client = new Groq({
//       apiKey: API_KEY.GROQ,
//     });

//     const chatCompletion = await client.chat.completions.create({
//       messages: [
//         {
//           role: "user",
//           content: [
//             {
//               type: "text",
//               text: symp,
//             },
//             {
//               type: "image_url",
//               image_url: {
//                 url: dataUrl,
//               },
//             },
//           ],
//         },
//       ],
//       model: "meta-llama/llama-4-maverick-17b-128e-instruct",
//       // model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
//     });

//     return NextResponse.json(
//       {
//         message: "successful",
//         data: chatCompletion.choices.map((e) => e.message.content),
//       },
//       { status: 200 }
//     );
//   } catch (e) {
//     console.log(e);
//     NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
