import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import jwt from "jsonwebtoken";
import { createAnUser } from "../../../graphql/api";
import { graphQLClient } from "../../../lib/graphql-client";
import { useContext } from "react";
import { ContextProvider, ContextState } from "../../../context/global";
import { gql } from "graphql-request";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.SECRET,

  session: {
    jwt: true,
  },
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    secret: process.env.SECRET,
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    encode: async ({ secret, token, maxAge }) => {
      console.log(token, "tknee");
      const jwtClaims = {
        sub: token.sub.toString(),
        name: token.name,
        email: token.email,
        id: token.id,
        picture: token.picture,
        role: "AUTHOR",
        iat: Date.now() / 1000,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      };
      const encodedToken = jwt.sign(jwtClaims, secret, { algorithm: "HS256" });
      return encodedToken;
    },
    decode: async ({ secret, token, maxAge }) => {
      const decodedToken = jwt.verify(token, secret, { algorithms: ["HS256"] });
      return decodedToken;
    },
  },

  pages: {},

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // async signIn(user, account, profile) { return true },
    // async redirect(url, baseUrl) { return baseUrl },

    async session(session, token) {
      const encodedToken = jwt.sign(token, process.env.SECRET, {
        algorithm: "HS256",
      });
      session.id = token.id;
      session.token = encodedToken;
      return Promise.resolve(session);
    },
    async signIn(user, account, profile) {
      const validEmails = [
        "danilockthar@gmail.com",
        "franmoreyra88@gmail.com",
        "dinerapp20@gmail.com",
      ]; /*franmoreyra88@gmail.com*/
      if (validEmails.includes(user.email)) {
        return true;
      } else {
        return "/";
      }
      // const isAllowedToSignIn = true
      // if (isAllowedToSignIn) {
      //   return true
      // } else {
      //   // Return false to display a default error message
      //   return false
      //   // Or you can return a URL to redirect to:
      //   // return '/unauthorized'
      // }
    },
    async jwt(token, user, account, profile, isNewUser) {
      const isUserSignedIn = user ? true : false;
      // make a http call to our graphql api
      if (isUserSignedIn) {
        const response = await createAnUser(
          user.email,
          user.name,
          user.id.toString()
        );

        if (response.data?.data?.createUser?._id) {
          token.id = response.data.data.createUser._id;
        } else {
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
            authId: user.id.toString(),
          };

          const resp = await graphQLClient.request(query, variables);
          if (resp.userByAuthId?._id !== null) {
            token.id = resp.userByAuthId._id;
          }
        }

        // token.id = user.id.toString();
      }
      // token.url = user.image;
      return Promise.resolve(token);
    },
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // Enable debug messages in the console if you are having problems
  debug: true,
});
