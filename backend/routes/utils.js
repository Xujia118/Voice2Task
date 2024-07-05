export function getSummaryAudioURL(url) {
    console.log("audio url received:", url);
  return url;
}

export function getSummaryText(summary) {
    console.log("summary text received:", summary);
    return summary
}

export function getSummaryInfo() {
  const summaryAudioURL = getSummaryAudioURL(url);
  const summaryText = getSummaryText(summary);
  return [summaryText, summaryAudioURL];
}
