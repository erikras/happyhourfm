import React from 'react';
import styled from 'styled-components';
import { MediaPlayer } from '@cassette/player';
const Player = ({ episode }) => (<Container>
    <MediaPlayer playlist={[
    {
        url: `https://dts.podtrac.com/redirect.mp3/happyhour.fm/media/${episode.frontmatter.slug}.mp3`,
        title: episode.frontmatter.title,
    },
]} controls={['playpause', 'spacer', 'progress']} style={{ width: '100%' }}/>
  </Container>);
const Container = styled.div `
  width: 100%;
  & > div {
    display: flex;
    flex-flow: row;
    & > .cassette {
      flex: 1;
    }
  }
`;
export default Player;
//# sourceMappingURL=Player.jsx.map