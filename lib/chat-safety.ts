import { callBothBranches } from "@/lib/clinic";

export const healthQuestionReply = `I’m not qualified to answer medical or health questions. Please speak directly with the hospital team for guidance: ${callBothBranches}. I can also help you book an appointment.`;

const medicalQuestionPattern =
  /\b(?:medical advice|health advice|health question|medical question|symptom(?:s)?|diagnos(?:e|is|tic)|treat(?:ment|ing)?|medicat(?:ion|ions)|medicine|drug dosage|dosage|prescri(?:be|bed|ption)|cure|remed(?:y|ies)|side effects?|test results?|lab results?|scan results?|blood pressure|blood sugar|blood test results?|what(?:'s| is) wrong|is it normal|is it safe|am i pregnant|pregnan(?:t|cy)|miscarriage|bleed(?:ing)?|fever|pain|headache|cough|rash|vomit(?:ing)?|nausea|dizz(?:y|iness)|breath|injur(?:y|ies)|wound|fracture|sick|illness|disease|condition|malaria|infection|cancer|tumou?r|diabetes|asthma|hypertension|migraine|stroke|heart attack|hiv|aids|ulcer|allerg(?:y|ic)|mental health|anxiety|depression|can i (?:take|use|stop|start)|should i (?:take|use|stop|start)|what can i do for|lose weight|vaccine side effects?)\b/i;

export function isMedicalQuestion(text: string) {
  return medicalQuestionPattern.test(text);
}
