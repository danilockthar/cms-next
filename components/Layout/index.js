import { useState } from "react";
import Head from "next/head";
import Header from "../Header";
import styles from "./styles.module.scss";
import styled, { css } from "styled-components";
import HeaderLogin from "../HeaderLogin";
import HeaderFixed from "../HeaderFixed";

const Layout = ({ children, title, isLogin, grid }) => {
  return (
    <div>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0"
        />
        <meta charSet="utf-8" />
        <meta name="description" content="EDITORS" />
        <meta property="og:site_name" content="Editors" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,400;1,500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link href="/fonts/style.css" rel="stylesheet" />
        <title>{title}</title>
      </Head>
      {isLogin ? <HeaderLogin /> : <HeaderFixed />}
      {isLogin ? (
        <ChildWrapperLogin>{children}</ChildWrapperLogin>
      ) : (
        <Workbench grid={grid}>{children}</Workbench>
      )}
    </div>
  );
};

export default Layout;

export const Workbench = styled.div`
  background: white;
  box-sizing: border-box;
  position: absolute;
  top: 10vh;
  left: 0;
  width: 100%;
  max-height: 90vh;
  min-height: 90vh;
  display: grid;
  ${(props) =>
    props.grid === "publications" &&
    css`
      grid-template-columns: 20vw 1fr;
      grid-template-rows: 12vh 1fr;
      gap: 0px 0px;
      grid-template-areas:
        "header header"
        "side content";
    `}
`;

export const ChildWrapperLogin = styled.div`
  background: white;
  min-height: 76vh;
  padding: 6vh 13vw 0 13vw;
`;
