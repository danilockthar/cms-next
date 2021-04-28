import { getSession, signIn, signOut, useSession } from "next-auth/client";
import SideLayout from "../components/SideLayout";
import styles from "../styles/create.module.scss";
import styled from "styled-components";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import { ContextState } from "../context/global";
import Router from "next/router";
import Layout from "../components/Layout";

const EditorComponent = dynamic(() => import("../components/Editor"), {
  ssr: false,
});

function Create() {
  const [session, loading] = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !session?.token) {
      Router.push("/");
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loading, session]);

  if (loading || !session || isLoading) {
    return (
      <Layout>
        <div>
          <h1>Loading...</h1>
        </div>
      </Layout>
    );
  }

  if (session && session.token) {
    return (
      <Layout>
        <div className={styles.wrapper}>
          <TitleCreate> Crear</TitleCreate>
          <EditorComponent />
        </div>
      </Layout>
    );
  } else {
    return <div></div>;
  }
}
export default Create;

export const TitleCreate = styled.h1`
  font-family: "Inter", sans-serif;
  font-size: 2rem;
  color: black;
`;
// export async function getStaticProps(context) {
//   console.log(context);
//   const res = await fetch(`http://localhost:3000/api/items`, {
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//   });
//   const data = await res.json();
//   console.log(data, "data");
//   return {
//     props: {
//       data: data.items,
//     },
//     revalidate: 10,
//   };
// }
// export async function getServerSideProps(context) {
//   const session = await getSession(context);
//   let data = [];
//   let error = { exist: false };
//   if (!session || !session.token) {
//     context.res.setHeader("Location", `http://localhost:3000/`); // Replace <link> with your url link
//     context.res.statusCode = 302;
//     return {
//       props: {
//         data: [],
//       },
//     };
//   }

//   if (session && session.token) {
//     const res = await fetch(`http://localhost:3000/api/items`, {
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + session.token,
//       },
//     });
//     switch (res.status) {
//       case 409:
//         console.log("409");
//         context.res.setHeader("Location", `http://localhost:3000/`); // Replace <link> with your url link
//         context.res.statusCode = 302;
//         return {
//           props: {
//             data: [],
//           },
//         };
//         break;
//     }
//     data = await res.json();
//   }
//   return {
//     props: {
//       session,
//       fuser: data.userdata,
//       data: data.items || [],
//       error,
//     },
//   };
// }
