import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";

const HeaderLogin = () => {
  return (
    <Header>
      <Logo src={"/messiarg.png"} />
    </Header>
  );
};

export default HeaderLogin;

export const Header = styled.div`
  padding: 0 13vw;
  display: grid;
  width: 100%;
  height: 10vh;
  border-bottom: 1px solid #eaeaea;
  align-items: center;
  box-sizing: border-box;
`;

export const Logo = styled.img`
  width: 6vw;
`;
