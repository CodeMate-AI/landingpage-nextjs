'use client'
import React, { createContext, ReactNode, useState } from 'react'

interface ContextValue{
    theme:boolean;
    setTheme:React.Dispatch<React.SetStateAction<boolean>>;
}

export const themeContext = createContext<ContextValue | undefined>(undefined);


function ThemeProvider({children}:any) {
const [theme,setTheme] = useState<boolean>(false);
  return (
      <themeContext.Provider value={{theme,setTheme}}>
        {children}
      </themeContext.Provider>

  )
}

export default ThemeProvider