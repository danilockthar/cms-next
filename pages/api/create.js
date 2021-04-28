import { gql } from "graphql-request";
import { decode } from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import { useContext } from "react";
import { ContextState } from "../../context/global";
import { getDateNow } from "../../lib/getDateNow";
import { graphQLClient } from "../../lib/graphql-client";
import { slugify } from "../../lib/slugify";

export default async function Items(req, res) {
  let token = req.headers.authorization.split(" ");

  var decoded = jwt_decode(token[1]);

  const query = gql`
    query getUserByAuthID($authId: String!) {
      userByAuthId(authId: $authId) {
        _id
        name
        email
      }
    }
  `;

  const variables = {
    authId: decoded.sub,
  };

  const response = await graphQLClient.request(query, variables);

  if (response.userByAuthId._id !== null) {
    const mutation = gql`
      mutation CreateAPost(
        $title: String!
        $excerpt: String!
        $contenido: [BlocksInput]
        $slug: String!
        $tags: [TagInput]
        $created_at: Date
        $authorRef: ID!
      ) {
        createPost(
          data: {
            title: $title
            excerpt: $excerpt
            content: $contenido
            author: { connect: $authorRef }
            slug: $slug
            created_at: $created_at
            tags: $tags
            show: true
          }
        ) {
          _id
        }
      }
    `;
    const variablesmutation = {
      title: req.body.title,
      excerpt: req.body.excerpt,
      contenido: req.body.contenido,
      slug: slugify(req.body.title),
      tags: req.body.tags,
      created_at: getDateNow(),
      authorRef: response.userByAuthId._id,
    };
    const post = await graphQLClient.request(mutation, variablesmutation);

    if (post.createPost._id !== null) {
      res.status(200).json({
        success: true,
      });
      return;
    } else {
      res.status(403).json({
        success: false,
      });
    }
  }
  res.status(403).json({
    success: false,
  });

  //   return;

  //   if (response.userByAuthId && response.userByAuthId.role === "AUTHOR") {
  //     res.status(200).json({
  //       items: [],
  //     });
  //     // res.status(200).json({
  //     //   items: response.userByAuthId.posts.data,
  //     //   userdata: {
  //     //     id: response.userByAuthId._id,
  //     //     role: response.userByAuthId.role,
  //     //   },
  //     // });
  //   } else {
  //     res.status(409).json({ items: [] });
  //   }
}
