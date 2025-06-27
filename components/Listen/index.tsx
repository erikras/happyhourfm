import * as React from "react";
import { ListenLink } from "./ListenLink";
import { links } from "./links";

function Listen() {
  return (
    <div className="w-[300px] space-y-2">
      {links.map((link) => (
        <ListenLink key={link.text} {...link} />
      ))}
    </div>
  );
}

export default Listen;
