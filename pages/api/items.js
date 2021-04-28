import { gql } from "graphql-request";
import { decode } from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import { useContext } from "react";
import { ContextState } from "../../context/global";
import { graphQLClient } from "../../lib/graphql-client";

export default async function Items(req, res) {
  // let token = req.headers.authorization.split(" ");
  let items = [
    { name: "1" },
    { name: "2" },
    { name: "3" },
    { name: "4" },
    { name: "5" },
    { name: "6" },
  ];
  // var decoded = jwt_decode(token[1]);

  // const query = gql`
  //   query getUserByAuthID($authId: String!) {
  //     userByAuthId(authId: $authId) {
  //       _id
  //       name
  //       email
  //       authId
  //       role
  //       posts {
  //         data {
  //           _id
  //           title
  //           excerpt
  //           content {
  //             type
  //             data {
  //               items
  //               file {
  //                 url
  //               }
  //               withBorder
  //               text
  //               style
  //               stretched
  //               caption
  //               withBackground
  //             }
  //           }
  //           tags {
  //             tag
  //           }
  //           created_at
  //           slug
  //         }
  //       }
  //     }
  //   }
  // `;

  // const variables = {
  //   authId: decoded.sub,
  // };

  // const response = await graphQLClient.request(query, variables);

  res.status(200).json({
    items: [],
  });
  return;

  if (response.userByAuthId && response.userByAuthId.role === "AUTHOR") {
    res.status(200).json({
      items: [],
    });
    // res.status(200).json({
    //   items: response.userByAuthId.posts.data,
    //   userdata: {
    //     id: response.userByAuthId._id,
    //     role: response.userByAuthId.role,
    //   },
    // });
  } else {
    res.status(409).json({ items: [] });
  }
}
