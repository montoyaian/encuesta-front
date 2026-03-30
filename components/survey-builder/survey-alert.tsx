type SurveyAlertProps = {
  messages: string[];
};

export function SurveyAlert({ messages }: SurveyAlertProps) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-red-200/60 bg-red-50 p-5">
      <ul className="space-y-1 text-sm text-red-600">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
