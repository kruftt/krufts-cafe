
export default function Home () {
  return (
    <div>
      <h1>Hello world!</h1>
      {process.env.NODE_ENV === "production" ? "production" : "development"}
    </div>
  );
}