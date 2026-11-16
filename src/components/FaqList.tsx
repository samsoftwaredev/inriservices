import type { Faq } from '../data/services';
export function FaqList({ questions }: { questions: readonly Faq[] }) {
  return (
    <div className="faq-list">
      {questions.map(({ question, answer }) => (
        <details key={question} className="faq-item">
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
  );
}
