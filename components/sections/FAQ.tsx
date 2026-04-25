import { FadeIn } from "@/components/FadeIn";
import { SectionHeader } from "@/components/SectionHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/data/faq";

export function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-slate-50 py-20 sm:py-24">
      <div className="container">
        <SectionHeader eyebrow="On vous répond" title="Questions fréquentes" />
        <h2 id="faq-title" className="sr-only">
          Questions fréquentes
        </h2>

        <FadeIn className="mx-auto mt-10 max-w-3xl">
          <Accordion type="single" collapsible className="rounded-xl border border-slate-200 bg-white px-4 sm:px-6">
            {FAQ_ITEMS.map((item, idx) => (
              <AccordionItem value={`item-${idx}`} key={item.q}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}
