import { gql } from "graphql-request";
import { useSession } from "next-auth/client";
import { useState, useEffect } from "react";
import { graphQLClient } from "../../../lib/graphql-client";
import dynamic from "next/dynamic";
import styles from "../../../styles/slug.module.scss";
import { Router, useRouter } from "next/router";
import Layout from "../../../components/Layout";
import useSWR from "swr";

const EditorComponent = dynamic(() => import("../../../components/Editor"), {
  ssr: false,
});

const UniquePost = () => {
  const [session, loading] = useSession();
  const [mounted, setMounted] = useState(false);
  const [loadEditor, setLoadEditor] = useState(false);
  const [initialData, setInitialData] = useState({
    _id: "",
    content: "",
    title: "",
    excerpt: "",
  });
  const router = useRouter();

  const fetcher = (query, variables) =>
    graphQLClient.request(query, {
      id: router.query?.slug ?? "",
    });

  const { data, error } = useSWR(
    mounted
      ? `query findPostByID($id: ID!) {
    findPostByID(id: $id) {
      _id
      title
      excerpt
      created_at
      author {
        _id
        email
        name
        authId
      }
      tags {
        tag
      }
      content {
        data {
          caption
          withBorder
          withBackground
          code
          stretched
          text
          style
          items
          file {
            url
          }
          level
        }
        type
      }
    }
  }
`
      : null,
    fetcher
  );

  useEffect(() => {
    if (router && session && session.id !== undefined) {
      setMounted(true);
    }
  }, [session, router]);

  useEffect(() => {
    if (data && data.findPostByID._id !== null) {
      console.log(data.findPostByID);
      setInitialData(data.findPostByID);
      setLoadEditor(true);
    }
  }, [data]);

  if (loading || router.isFallback) {
    return (
      <Layout>
        <div className={styles.slugWrapper}>
          <h1>Loading...</h1>
        </div>
      </Layout>
    );
  }
  if (!session) {
    router.push("/");
    return (
      <Layout>
        <div className={styles.slugWrapper}>
          <h1>Loading...</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.slugWrapper}>
        {/* <button onClick={submit}> Publicar </button>
        <input
          name="title"
          value={inputs.title}
          onChange={(e) => handleInputs(e)}
        />
        <textarea
          name="excerpt"
          value={inputs.excerpt}
          onChange={(e) => handleInputs(e)}
        /> */}
        {loadEditor ? (
          <EditorComponent
            idpost={initialData._id}
            content={initialData.content}
            title={initialData.title}
            excerpt={initialData.excerpt}
          />
        ) : (
          <h1>loading...</h1>
        )}
      </div>
    </Layout>
  );
};

export default UniquePost;

// const query = gql`
//   query findPostByID($id: ID!) {
//     findPostByID(id: $id) {
//       _id
//       title
//       excerpt
//       created_at
//       author {
//         _id
//         email
//         name
//         authId
//       }
//       tags {
//         tag
//       }
//       content {
//         data {
//           caption
//           withBorder
//           withBackground
//           code
//           stretched
//           text
//           style
//           items
//           file {
//             url
//           }
//           level
//         }
//         type
//       }
//     }
//   }
// `;

// const variables = {
//   slug: context.params.slug,
// };

// const response = await graphQLClient.request(query, variables);
