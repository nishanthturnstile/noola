import { useRef, useState } from "react";
export function useAction() {
  const [feedback, setFeedback] = useState({ message: "", error: false });
  const [pending, setPending] = useState(false);
  const run = async (work: () => Promise<unknown>, message = "Saved.") => {
    setPending(true);
    setFeedback({ message: "", error: false });
    try {
      await work();
      setFeedback({ message, error: false });
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError")
        return false;
      setFeedback({
        message:
          error instanceof Error
            ? error.message
            : "The request could not be confirmed. Try again.",
        error: true,
      });
      return false;
    } finally {
      setPending(false);
    }
  };
  return { run, pending, feedback };
}
export function useRequestIdentity() {
  const previous = useRef<{ input: string; id: string } | undefined>(undefined);
  return async <const Input, T>(
    input: Input,
    work: (requestId: string, input: Input) => Promise<T>,
  ): Promise<T> => {
    const value = JSON.stringify(input);
    if (!previous.current || previous.current.input !== value)
      previous.current = { input: value, id: crypto.randomUUID() };
    const attempt = previous.current;
    const result = await work(attempt.id, input);
    if (previous.current === attempt) previous.current = undefined;
    return result;
  };
}
