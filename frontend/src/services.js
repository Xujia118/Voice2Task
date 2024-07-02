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

  console.log("url:", url);
  console.log("search params:", url.searchParams);

  const fetched = fetch(url);
  return chainPromise(fetched);
}

// Get/Post/Patch client data
export function fetchClientData(clientObj) {
  const fetched = fetch(`${API_BASE_URL}/api/user-data`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ clientObj }),
  });
  return chainPromise(fetched);
}