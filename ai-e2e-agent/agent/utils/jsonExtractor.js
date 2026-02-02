function extractJSON(text) {
  if (!text) return null;

  // Remove markdown fences
  const cleaned = text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  // Try direct parse first
  try {
    return JSON.parse(cleaned);
  } catch (_) {}

  // Fallback: extract first JSON object
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch (_) {
    return null;
  }
}

module.exports = { extractJSON };
