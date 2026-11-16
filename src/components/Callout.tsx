import { ContactActions } from './ContactActions';
export function Callout({ title = 'Ready to discuss your project?', message = 'Tell us what you want painted or repaired and where the work is located. We can talk through the next step.' }: { title?: string; message?: string }) {
  return <section className="callout"><div><p className="eyebrow">Start with a conversation</p><h2>{title}</h2><p>{message}</p></div><ContactActions compact /></section>;
}
