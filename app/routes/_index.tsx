
export default function Home () {
  return (
    <div>
      <h1>Hello world!</h1>
      viewing _index.tsx in {process.env.NODE_ENV === "production" ? "production" : "development"} environment
    </div>
  );
}