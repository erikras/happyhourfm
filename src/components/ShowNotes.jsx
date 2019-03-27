import React from 'react';
import { Box, Paragraph } from 'grommet';
import { withRouteData } from 'react-static';
export default withRouteData(({ content, episode }) => {
    const ep = episode || content;
    if (!ep || !ep.body)
        return 'no content';
    return (<Box fill>
      <Paragraph key={ep.frontmatter.slug}>
        <div dangerouslySetInnerHTML={{ __html: ep.body }}/>
      </Paragraph>
    </Box>);
});
//# sourceMappingURL=ShowNotes.jsx.map