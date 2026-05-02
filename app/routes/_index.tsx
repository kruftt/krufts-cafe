
import { ContentContainer, ContentHeader } from "@components/app";

export default function Home () {
  return (
    <ContentContainer>
      <ContentHeader>
        <h1>Hello world!</h1>
      </ContentHeader>
      viewing _index.tsx in{" "}
      {process.env.NODE_ENV === "production" ? "production" : "development"}{" "}
      environment
    </ContentContainer>
  );
}