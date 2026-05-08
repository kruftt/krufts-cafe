import { useState } from "react";

export function useRequest() {
  const [inProgress, setInProgress] = useState(false);
  const [error, setError] = useState("");

  return {
    inProgress,
    error,
    onRequest () {
      setInProgress(true);
      setError("");
    },
    onResponse () {
      setInProgress(false);
    },
    onError (msg: string) {
      setInProgress(false);
      setError(msg)
    }
  }
}