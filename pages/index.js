import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession, signIn, signOut, useSession } from "next-auth/client";
import Layout from "../components/Layout";
import styles from "../styles/index.module.scss";
import styled from "styled-components";
import { createAnUser } from "../graphql/api";
import { useRouter } from "next/router";

const Index = () => {
  // const [session, loading] = useSession();
  const router = useRouter();
  // if (loading) {
  //   return (
  //     <Layout>
  //       <div>
  //         <h1>Loading...</h1>
  //       </div>
  //     </Layout>
  //   );
  // }
  // if (session) {
  //   router.push("/dashboard");
  // }

  return (
    <Layout isLogin>
      <LoginBox className={styles.login_box}>
        <h1 className={"label-text"}>Log in to Dashboard Creator</h1>
        <div class="google-btn" onClick={() => signIn("google")}>
          <div class="google-icon-wrapper">
            <img
              class="google-icon"
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            />
          </div>
          <p class="btn-text">
            <b>Continue with Google</b>
          </p>
        </div>
        {/* <button
          type="button"
          className={styles.google_button}
          onClick={() => signIn("google")}
        >
          <span className={styles.google_button__icon}>
            <svg viewBox="0 0 366 372" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M125.9 10.2c40.2-13.9 85.3-13.6 125.3 1.1 22.2 8.2 42.5 21 59.9 37.1-5.8 6.3-12.1 12.2-18.1 18.3l-34.2 34.2c-11.3-10.8-25.1-19-40.1-23.6-17.6-5.3-36.6-6.1-54.6-2.2-21 4.5-40.5 15.5-55.6 30.9-12.2 12.3-21.4 27.5-27 43.9-20.3-15.8-40.6-31.5-61-47.3 21.5-43 60.1-76.9 105.4-92.4z"
                id="Shape"
                fill="#EA4335"
              />
              <path
                d="M20.6 102.4c20.3 15.8 40.6 31.5 61 47.3-8 23.3-8 49.2 0 72.4-20.3 15.8-40.6 31.6-60.9 47.3C1.9 232.7-3.8 189.6 4.4 149.2c3.3-16.2 8.7-32 16.2-46.8z"
                id="Shape"
                fill="#FBBC05"
              />
              <path
                d="M361.7 151.1c5.8 32.7 4.5 66.8-4.7 98.8-8.5 29.3-24.6 56.5-47.1 77.2l-59.1-45.9c19.5-13.1 33.3-34.3 37.2-57.5H186.6c.1-24.2.1-48.4.1-72.6h175z"
                id="Shape"
                fill="#4285F4"
              />
              <path
                d="M81.4 222.2c7.8 22.9 22.8 43.2 42.6 57.1 12.4 8.7 26.6 14.9 41.4 17.9 14.6 3 29.7 2.6 44.4.1 14.6-2.6 28.7-7.9 41-16.2l59.1 45.9c-21.3 19.7-48 33.1-76.2 39.6-31.2 7.1-64.2 7.3-95.2-1-24.6-6.5-47.7-18.2-67.6-34.1-20.9-16.6-38.3-38-50.4-62 20.3-15.7 40.6-31.5 60.9-47.3z"
                fill="#34A853"
              />
            </svg>
          </span>
          <span className={styles.google_button__text}>
            Sign in with Google
          </span>
        </button> */}
      </LoginBox>
    </Layout>
  );
};

export default Index;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session && session.token) {
    context.res.setHeader("Location", `http://localhost:3000/dashboard`);
    context.res.statusCode = 302;
  }

  return {
    props: {
      session,
      data: "",
    },
  };
}

export const LoginBox = styled.div`
  display: grid;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #eaeaea;
  border-radius: 5px;
  padding: 2vw;
  .label-text {
    font-family: "Inter", sans-serif;
    color: #333;
  }
  .google-btn {
    cursor: pointer;
    display: grid;
    grid-column-gap: 1vw;
    justify-self: center;
    grid-auto-flow: column;
    padding: 1vh 0 1vh 0;
    border-radius: 5px;
    width: 340px;
    height: 42px;
    background-color: #4285f4;
    transition: 0.3s;
    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.25);
    .google-icon-wrapper {
      width: 40px;
      height: 40px;
      border-radius: 2px;
      justify-self: right;
      background-color: #fff;
    }
    .google-icon {
      position: absolute;
      margin-top: 11px;
      margin-left: 11px;
      width: 18px;
      height: 18px;
    }
    .btn-text {
      float: right;
      margin: 11px 11px 0 0;
      color: #fff;
      font-size: 14px;
      letter-spacing: 0.2px;
      font-family: "Roboto";
    }
    &:hover {
      background: rgb(66 133 244 / 78%);
    }
    &:active {
      background: #1669f2;
    }
  }
`;
