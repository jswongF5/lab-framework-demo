// components/Collapsible.js
"use client";

import { Accordion, AccordionItem } from "@nextui-org/accordion";

export function Collapsible({ title, heading, children }) {
  return (
    <Accordion selectionMode="multiple">
      <AccordionItem style={{ backgroundColor: 'lightgray' }} title={title} HeadingComponent={heading}>
        {children}
      </AccordionItem>
    </Accordion>
  );

}
