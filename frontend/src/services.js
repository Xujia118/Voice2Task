const API_BASE_URL = "http://localhost:3000"; // To update at production

function chainPromise(promise) {
  return promise
    .catch((err) => Promise.reject({ error: "network-error" }))
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => Promise.reject(err));
      }
      return response.json();
    });
}

// Store audio file to S3
export function storeAudioToS3(file) {
  const formData = new FormData();
  formData.append("audioFile", file);

  const fetched = fetch(`${API_BASE_URL}/api/store-audio-file`, {
    method: "POST",
    body: formData,
  });

  return chainPromise(fetched);
}

// Convert audio to text
export function transcribeAudioToText(audioFileName) {
  const fetched = fetch(`${API_BASE_URL}/api/transcribe-audio-file`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ audioFileName }),
  });
  return chainPromise(fetched);
}

// Get summary
export function fetchSummary(fileName) {
//   const fetched = fetch(`${BACKEND_URL}/api/get-summary`);
//   return chainPromise(fetched);

  const url = new URL(`${API_BASE_URL}/api/get-summary`);
  url.searchParams.append("fileName", fileName);

  const fetched = fetch(url);
  return chainPromise(fetched);
}
