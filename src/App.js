import MainContent from "./modules/MainContent/MainContent";
import { io } from 'socket.io-client'
import Header from "./modules/Header/Header";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import Footer from "./modules/Footer/Footer";

export const socket = io('http://localhost:3000')




export const App = function App() {

  // Track current logged in user

  const [currentUser, setCurrentUser] = useState(null)
  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      onAuthStateChanged(auth, user => {
          if(user){
            console.log('User logged in: ', user)
            setCurrentUser(user)
          } else {
            console.log('User logged out');
            setCurrentUser(null)
          }
      })
    }

    return () => { isMounted = false }
  }, [])

  return (
    <div id="app--content">
      <Header 
        currentUser={currentUser}
      />
      <MainContent
        currentUser={currentUser}
      />
      <Footer/>
    </div>
  )
}
