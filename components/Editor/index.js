import { gql } from "graphql-request";
import { useSession } from "next-auth/client";
import { useState, useRef, useContext } from "react";
import EditorJs from "react-editor-js";
import { ContextState } from "../../context/global";
import { createOnePost } from "../../graphql/api";
import { EDITOR_JS_TOOLS } from "../../lib/editor";
import { getDateNow } from "../../lib/getDateNow";
import { graphQLClient } from "../../lib/graphql-client";
import { slugify } from "../../lib/slugify";
import styles from "./style.module.scss";

const EditorJS = ({ idpost, content, title, excerpt }) => {
  console.log(content, title);
  const [session] = useSession();
  const { faunaUser, setFaunaUser, refreshData } = useContext(ContextState);
  const [inputs, setInputs] = useState({
    title: title ?? "",
    excerpt: excerpt ?? "description",
  });
  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef(null);

  let contenido = {};
  if (content) {
    contenido = {
      time: 1556098174501,
      blocks: content,
      version: "2.20.1",
    };
  } else {
    contenido = {
      time: 1556098174501,
      blocks: [
        {
          type: "header",
          data: {
            text: "Nueva nota.",
            level: 2,
          },
        },
        {
          type: "paragraph",
          data: {
            text: "Crea tu primer artículo",
          },
        },
      ],
      version: "2.12.4",
    };
  }

  const handleInputs = (e) => {
    const { name, value } = event.target;
    setInputs((prevstate) => ({ ...prevstate, [name]: value }));
  };

  const submit = async () => {
    if (inputs.title.length === 0 || inputs.excerpt.length === 0) {
      return;
    }
    setIsLoading(true);
    const savedData = await editorRef.current.save();
    let tags = [{ tag: "testing" }, { tag: "webapp" }];
    fetch("/api/create/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      method: "POST",
      body: JSON.stringify({
        title: inputs.title,
        excerpt: inputs.excerpt,
        contenido: savedData.blocks,
        tags,
      }),
    })
      .then((output) => {
        setInputs({ title: "", excerpt: "" });
        editorRef.current.blocks.clear();
      })
      .catch((err) => console.log(err))
      .finally(setIsLoading(false));

    return;

    createOnePost(
      inputs.title,
      inputs.excerpt,
      savedData.blocks,
      tags,
      faunaUser.id
    )
      .then((output) => {
        setInputs({ title: "", excerpt: "" });
        editorRef.current.blocks.clear();
        refreshData();
      })
      .catch((err) => {
        console.log(err, "err");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const savePost = async () => {
    if (inputs.title.length === 0 || inputs.excerpt.length === 0) {
      return;
    }
    setIsLoading(true);
    const savedData = await editorRef.current.save();
    const mutation = gql`
      mutation updateOnePostByID(
        $idpost: ID!
        $title: String!
        $excerpt: String!
        $contenido: [BlocksInput]
        $slug: String!
        $updated_at: Date
      ) {
        updatePost(
          id: $idpost
          data: {
            title: $title
            excerpt: $excerpt
            slug: $slug
            content: $contenido
            updated_at: $updated_at
          }
        ) {
          _id
        }
      }
    `;
    const variables = {
      idpost,
      title: inputs.title,
      excerpt: inputs.excerpt,
      contenido: savedData.blocks,
      slug: slugify(inputs.title),
      updated_at: getDateNow(),
    };

    graphQLClient
      .request(mutation, variables)
      .then((output) => {
        console.log(output, "output");
      })
      .catch((err) => {
        console.log(err, "err");
      })
      .finally(() => {
        setIsLoading(false);
        // if (inputs.title !== title) {
        //   refreshData(slugify(inputs.title));
        // }
      });
  };

  return (
    <div className={styles.editorWrapper}>
      {content ? (
        <button className={styles.saveBtn} onClick={savePost}>
          {" "}
          Guardar{" "}
        </button>
      ) : (
        <button className={styles.publishBtn} onClick={submit}>
          {" "}
          Publicar{" "}
        </button>
      )}
      <label> Title</label>
      <input
        name="title"
        value={inputs.title}
        onChange={(e) => handleInputs(e)}
      />
      {/* <textarea
        name="excerpt"
        value={inputs.excerpt}
        onChange={(e) => handleInputs(e)}
      /> */}
      <label>Content</label>
      <div className={styles.wrappEditor}>
        <EditorJs
          tools={EDITOR_JS_TOOLS}
          instanceRef={(instance) => (editorRef.current = instance)}
          data={contenido}
        />
      </div>
    </div>
  );
};

export default EditorJS;
