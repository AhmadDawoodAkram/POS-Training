// "use client";
// import Image from "next/image";
// import styles from "./page.module.css";
// import { useState } from "react";
// import React from "react";
// import { signIn } from "next-auth/react";

// const Button = React.memo(
//   ({
//     setCount,
//   }: {
//     setCount: React.Dispatch<React.SetStateAction<number>>;
//   }) => {
//     return (
//       <button onClick={() => setCount((prev: number) => prev + 1)}>
//         Click me
//       </button>
//     );
//   }
// );

// export default function Home() {
//   const [count, setCount] = useState(0);
//   return (
//     <div>
//       <h1>Hello World</h1>
//       <Button setCount={setCount} />
//       <p>Count: {count}</p>
//       <button onClick={() => signIn("square")}>Sign in with Square</button>
//     </div>
//   );
// }

"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  console.log(session);

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    return (
      <div>
        <p>Not signed in</p>
        <button onClick={() => signIn("square")}>Sign in with Square</button>
      </div>
    );
  }

  return (
    <div>
      <p>Signed in as {session.user?.name}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
