import { useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
// import styles from "./index.module.scss";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/client";
import Link from "next/link";
import { useClickAway } from "@geist-ui/react";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";

const Header = () => {
  const [session, loading] = useSession();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const ref = useRef(null);
  const [hideOnScroll, setHideOnScroll] = useState(false);
  console.log(session);
  useScrollPosition(
    ({ prevPos, currPos }) => {
      console.log(currPos);
      setHideOnScroll(currPos.y <= -100);
    },
    [hideOnScroll]
  );

  useClickAway(ref, () => {
    if (isMenuVisible) {
      setIsMenuVisible(false);
    } else {
      return;
    }
  });
  const router = useRouter();

  return (
    <HeaderWrapper>
      <div className={"top-header"}>
        <Link href={"/dashboard"}>
          <picture>
            <img src={"/messiarg.png"} className={"logo"} />
          </picture>
        </Link>
        <ProfileImage
          onClick={() => setIsMenuVisible(true)}
          bg={session?.user?.image ?? ""}
        ></ProfileImage>
        {isMenuVisible && (
          <div ref={ref} className={"menumodal"}>
            <a> Dashboard</a>
            <a
              href={`/api/auth/signout`}
              className={"as"}
              onClick={(e) => {
                e.preventDefault();
                signOut({ callbackUrl: "https://authors.vercel.app/" });
              }}
            >
              Sign out
            </a>
          </div>
        )}
      </div>
      <LowHeader hide={hideOnScroll}>
        <Link href={"/dashboard"}>
          <LogoHidden src={"/messiarg.png"} hide={hideOnScroll} />
        </Link>
        <div className={"menu-low"}>
          <Link href={"/dashboard"}>
            <Atag route={router.asPath === "/dashboard"}>Overview</Atag>
          </Link>
          <Link href={"/dashboard/publicaciones"}>
            <Atag route={router.asPath === "/dashboard/publicaciones"}>
              Publicaciones
            </Atag>
          </Link>
          <Link href={"/historial"}>
            <Atag>Historial</Atag>
          </Link>
        </div>
      </LowHeader>
    </HeaderWrapper>
  );
};

export default Header;

export const HeaderWrapper = styled.div`
  height: 18vh;
  background: white;
  top: 0;
  display: grid;
  z-index: 10;
  grid-template-rows: 10vh 8vh;
  align-items: center;
  padding: 0 13vw;
  width: 100%;
  border-bottom: 1px solid #eaeaea;
  box-sizing: border-box;
  .profileImage {
    cursor: pointer;
    width: 2vw;
    position: relative;
    height: 2vw;
    background: #333;
    border-radius: 50%;
    justify-self: end;
  }
  .top-header {
    position: relative;
    height: 10vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    .menumodal {
      width: 15vw;
      display: flex;
      flex-direction: column;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      height: fit-content;
      background: white;
      top: 8vh;
      right: 0;
      position: absolute;
      a {
        font-family: "Inter", sans-serif;
        position: relative;
        text-decoration: none;
        color: #666;
        font-size: 13px;
        padding: 10px 22px;
        outline: none;
        user-select: none;
        border-bottom: 1px solid #eaeaea;
        &:hover {
          background: #efefefb3;
        }
      }
    }
    picture {
      height: 8vh;
      display: flex;
      align-items: center;
      h1 {
        font-family: "Inter", sans-serif;
      }
      .logo {
        width: 6vw;
      }
    }
  }
`;
export const LowHeader = styled.div`
  ${(props) =>
    props.hide
      ? css`
          position: fixed;
          display: flex;
          align-items: center;
          z-index: 10;
          padding: 0 13vw;
          background: white;
          border-bottom: 1px solid #eaeaea;
          top: 0;
          left: 0;
          height: 9vh;
          justify-content: start;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          width: 100%;
        `
      : css`
          height: 9vh;
          display: flex;
          align-items: center;
          justify-content: start;
        `}
  .menu-low {
    width: fit-content;
    transition: 0.3s;
    grid-auto-flow: column;
    display: grid;
    align-items: center;
    transform: ${(props) =>
      props.hide ? "translate3d(0px,0,0)" : "translate3d(-60px,0,0)"};
  }
`;

export const Atag = styled.a`
  position: relative;
  cursor: pointer;
  height: 9vh;
  padding: 0 14px;
  align-content: center;
  text-decoration: none;
  font-family: "Inter", sans-serif;
  color: #666;

  font-size: 14px;
  display: grid;
  font-weight: 400;
  transition: 0.3s;
  &:hover {
    color: black;
  }
  &::before {
    content: "";
    display: block;
    position: absolute;
    height: 0;
    left: 9px;
    z-index: 12;
    right: 9px;
    bottom: -0.1vh;
    border-bottom: 2.5px solid transparent;
  }
  ${(props) =>
    props.route &&
    css`color: black;
&::before {
  content: "";
  display: block;
  position: absolute;
  height: 0;
  left: 9px;
  z-index: 12;
  right: 9px;
  bottom: 0.2vh;
  border-bottom: 2.5px solid;
        `}
`;
export const ProfileImage = styled.div`
  cursor: pointer;
  width: 2vw;
  position: relative;
  height: 2vw;
  background-image: url("${(props) => props.bg}");
  border-radius: 50%;
  justify-self: end;
  background-position: center;
  background-size: cover;
`;

const appears = keyframes`
 0% { opacity:0 ;}
 100% { opacity: 1; }
`;
const disappears = keyframes`
 0% { opacity:1 ;}
 100% { opacity: 0; }
`;
export const LogoHidden = styled.img`
  animation-name: ${(props) => (props.hide ? appears : disappears)};
  animation-duration: 1s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  transform: ${(props) =>
    props.hide ? "translateZ(0)" : "translate3d(0,-50px,0)"};
  visibility: ${(props) => (props.hide ? "visible" : "hidden")};
  width: 4vw;
  height: 6vh;
  transition: 0.3s;
`;
