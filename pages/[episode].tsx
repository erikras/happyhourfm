import React from "react";
import Link from "next/link";
import Head from "../components/Head";
import { Box } from "grommet";
import Listen from "../components/Listen";
import { FMType } from "../components/ShowList";
import Footer from "../components/Footer";
import contents from "../util/content";
import { GetStaticPaths, GetStaticProps } from "next";
import { DownloadBar } from "../components/DownloadBar";
import Player from "../components/Player";
import ShowNotes from "../components/ShowNotes";
import { defaultImage, url } from "../util/constants";
import YouTube from "../components/YouTube";

export interface Ep {
  frontmatter: FMType;
  body: any;
}

interface EpisodeProps {
  episode: string;
}

const Episode = ({ episode }) => {
  const ep: Ep = JSON.parse(episode);
  return (
    <Box gap="medium">
      <Head
        content={ep}
        title={ep.frontmatter.title}
        description={ep.frontmatter.description}
        url={`${url}/${ep.frontmatter.slug}`}
        image={
          ep.frontmatter.art ? `${url}/${ep.frontmatter.art}` : defaultImage
        }
        twitterCard={`${url}/card/${ep.frontmatter.slug}`}
      />

      <Box direction="row-responsive" wrap flex="grow">
        <Listen />
        <Box align="center" flex gap="xsmall" pad={{ horizontal: "medium" }}>
          <DownloadBar frontmatter={ep.frontmatter} />
          {ep.frontmatter.episode >= 146 && (
            <div
              style={{
                fontSize: 20,
                lineHeight: "1.5em",
                marginBottom: 20,
              }}
            >
              <a href="https://patreon.com/happyhour">
                Become a Patron at the Gin Martinis tier to watch the video
                recording of this episode.
              </a>
            </div>
          )}
          {ep.frontmatter.youtube ? (
            <YouTube id={ep.frontmatter.youtube} />
          ) : (
            <Player episode={ep} />
          )}
          <ShowNotes episode={ep} />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { episode },
}) => {
  return {
    props: {
      episode: JSON.stringify(
        contents.find((content) => content.frontmatter.slug === episode),
      ),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: contents.map((content) => ({
    params: { episode: content.frontmatter.slug },
  })),
  fallback: false,
});

export default Episode;
