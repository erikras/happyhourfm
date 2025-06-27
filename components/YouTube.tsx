import React from "react";

type Props = {
  id: string;
};

export default function YouTube({ id }: Props) {
  return (
    <div className="max-w-2xl w-full mx-auto mb-6">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          frameBorder={0}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          className="absolute top-0 left-0 w-full h-full rounded-lg"
        />
      </div>
    </div>
  );
}
