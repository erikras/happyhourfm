import React from 'react';
import { withSiteData } from 'react-static';
import { Box } from 'grommet';
import Header from '@src/components/Header';
import Listen from '@src/components/Listen';
import Footer from '@src/components/Footer';
import ShowList from '@src/components/ShowList';
export default withSiteData(({ frontmatters, title, description, myURL, image }) => {
    return (<Box gap="medium">
        <Header siteData={{
        title,
        description,
        myURL,
        image,
    }}/>
        <Box direction="row-responsive" wrap flex="grow">
          <Listen />
          <Box align="center" flex gap="xsmall" pad={{ horizontal: 'medium' }}>
            <Box flex>
              <ShowList frontmatters={frontmatters}/>
            </Box>
          </Box>
        </Box>
        <Footer />
      </Box>);
});
//# sourceMappingURL=index.jsx.map