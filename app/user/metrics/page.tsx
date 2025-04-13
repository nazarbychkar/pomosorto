export default function Page() {
  const userData = () => {}
  const focusTime = () => {}
  return (
    <main>
      <h1>Metrics</h1>
      <div>
        <table>{userData && userData.map((metric) => <th>{metric}</th>)}</table>
      </div>
    </main>
  );
}
