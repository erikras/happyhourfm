import * as React from 'react';
import { ListenLink } from './ListenLink';
import { links } from './links';
import { Box } from 'grommet';
function Listen() {
    return (<Box width="300px" gap="xsmall">
      {links.map(link => (<ListenLink key={link.text} {...link}/>))}
    </Box>);
}
export default Listen;
//# sourceMappingURL=index.jsx.map