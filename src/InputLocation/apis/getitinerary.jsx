const GPT_KEY = process.env.GPT_API_KEY;

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${GPT_KEY}`,
};

export async function getItinerary(days, city) {
  try {
    if (days > 10) {
      days = 10;
    }

    const basePrompt = `What is an ideal itinerary for ${days} days in ${city}?`;

    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: basePrompt,
        temperature: 0,
        max_tokens: 550,
      }),
    });

    const data = await response.json();

    const itinerary =
      data.choices && data.choices.length > 0 ? data.choices[0].text : '';
    const pointsOfInterestPrompt =
      'Extract the points of interest out of this text, with no additional words, separated by commas: ' +
      itinerary;

    return {
      message: 'Success',
      pointsOfInterestPrompt,
      itinerary,
    };
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to fetch itinerary');
  }
}
