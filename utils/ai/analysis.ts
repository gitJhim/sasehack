export const analyzeImage = async (path: string) => {
  const COMPUTER_VISION_ENDPOINT =
    "https://sasehack.cognitiveservices.azure.com/";
  const COMPUTER_VISION_KEY = `${process.env.COMPUTER_VISION_KEY}`;
  try {
    const response = await fetch(
      `${COMPUTER_VISION_ENDPOINT}vision/v3.2/analyze?visualFeatures=Objects,Tags,Description`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": COMPUTER_VISION_KEY,
        },
        body: JSON.stringify({ url: path }),
      },
    );

    const data = await response.json();

    const recyclingBins =
      data.objects?.filter((obj: any) =>
        [
          "bin",
          "container",
          "recycling bin",
          "waste container",
          "trash can",
        ].includes(obj.object.toLowerCase()),
      ) || [];

    const isRecyclingBin =
      recyclingBins.length > 0 ||
      data.tags?.some((tag: { name: string }) =>
        ["recycling bin", "waste container"].includes(tag.name.toLowerCase()),
      );

    const recyclableItems =
      data.objects?.filter((obj: any) =>
        ["bottle", "can", "paper", "cardboard", "plastic"].includes(
          obj.object.toLowerCase(),
        ),
      ) || [];

    let fullness = "Unable to determine";
    if (isRecyclingBin) {
      const bin = recyclingBins[0] || {
        rectangle: { w: data.metadata.width, h: data.metadata.height },
      };
      const binArea = bin.rectangle.w * bin.rectangle.h;
      const imageArea = data.metadata.width * data.metadata.height;
      const fillPercentage = (binArea / imageArea) * 100;

      if (fillPercentage < 25) fullness = "0-25% full (Nearly Empty)";
      else if (fillPercentage < 50) fullness = "26-50% full (Partially Full)";
      else if (fillPercentage < 75) fullness = "51-75% full (Mostly Full)";
      else fullness = "76-100% full (Very Full)";
    }

    const analysisResult = {
      binsDetected: isRecyclingBin ? 1 : 0,
      recyclableItemsDetected: recyclableItems.length,
      binFullness: fullness,
      detectedObjects: data.objects?.map((obj: any) => obj.object) || [],
      tags: data.tags?.map((tag: any) => tag.name) || [],
      description:
        data.description?.captions[0]?.text || "No description available",
      confidence: isRecyclingBin ? "High" : "Low",
      recommendations: isRecyclingBin
        ? "Recycling bin detected successfully."
        : "This may not be a recycling bin. Please check the image.",
    };
    console.log("Analysis result:", analysisResult);
    return analysisResult;
  } catch (error) {
    console.error("Error analyzing image:", error);
  }
};
