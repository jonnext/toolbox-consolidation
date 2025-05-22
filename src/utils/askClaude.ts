// Utility to call the Claude (Anthropic) API proxy
// Returns the Claude response text or throws an error

export interface AskClaudeResponse {
  success: boolean;
  ai?: string;
  error?: string;
}

export async function askClaude(message: string): Promise<string> {
  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
    const data: AskClaudeResponse = await response.json();
    if (!data.success || !data.ai) {
      throw new Error(data.error || "Unknown error from Claude API");
    }
    return data.ai;
  } catch (error: any) {
    throw new Error(error.message || "Failed to contact Claude API");
  }
}
