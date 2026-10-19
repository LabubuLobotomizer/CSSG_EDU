import type { ReactNode } from "react";

type SectionProps = {
  title: string;
  children: ReactNode; // whatever is written between <Section> and </Section>
};

function Section({ title, children }: SectionProps) {
  return (
    <section className="section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default Section;
