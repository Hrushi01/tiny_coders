const GPT_KEY = "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";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${GPT_KEY}`,
};

export async function getPointsOfInterest(pointsOfInterestPrompt) {
  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: pointsOfInterestPrompt,
        temperature: 0,
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    let pointsOfInterest = [];

    if (data.choices && data.choices.length > 0) {
      const text = data.choices[0].text;
      pointsOfInterest = text.split("\n");
      pointsOfInterest = pointsOfInterest[pointsOfInterest.length - 1]
        .split(",")
        .map((item) => item.trim());
    }

    return pointsOfInterest;
  } catch (error) {
    console.log("Error:", error);
    throw new Error("Failed to fetch points of interest");
  }
}
