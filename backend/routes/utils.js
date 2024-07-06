export function getSummaryAudioURL(url) {
    console.log("audio url received:", url);
  return url;
}

export function getSummaryText(summary) {
    console.log("summary text received:", summary);
    return summary
} 

const summaryAudioURL = getSummaryAudioURL(url);
const summaryText = getSummaryText(summary);

export function getSummaryInfo() {
  return [summaryText, summaryAudioURL];
}
