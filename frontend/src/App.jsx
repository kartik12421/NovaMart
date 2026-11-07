import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";

function App() {
  return (
    <>
      <header>
        <Show when="signed-out">
          <SignInButton mode="modal" />
          <SignUpButton mode="modal" />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>

      <p className="text-red-500 font-bold text-4xl bg-blue">Hey...</p>
      <button className="btn btn-neutral">Submit</button>
      <button className="btn btn-primary">Submit</button>
      <button className="btn btn-info">Submit</button>
    </>
  );
}

export default App;
