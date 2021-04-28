import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export const ContextState = React.createContext();
export const ContextProvider = (props) => {
  const [faunaUser, setFaunaUser] = useState({ userId: "", role: "" });
  const router = useRouter();

  const refreshData = (route) => {
    if (route) {
      router.replace(router.route.replace("[slug]", route));
    } else {
      router.replace(router.asPath);
    }
  };

  return (
    <ContextState.Provider value={{ faunaUser, setFaunaUser, refreshData }}>
      {props.children}
    </ContextState.Provider>
  );
};
