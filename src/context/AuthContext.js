import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";


export const AuthContext =createContext()
  export const AuthContextProvider =({children})=>{
    const [currentUser, setCurrentUser]= useState({});

    useEffect(() => {
        const unsubs = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user);
          console.log(user);
        });
        
        return () => unsubs(); 
      }, []);
    
    return(
        <AuthContext.Provider value={{currentUser}}>
        {children}
    </AuthContext.Provider>
    );
  }