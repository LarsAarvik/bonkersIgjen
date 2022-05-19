import './header.css'
import {createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        onAuthStateChanged } from 'firebase/auth'
import { useRef, useState } from 'react'
import { auth } from '../../firebase.js'
import Modal, { ModalBody, ModalFooter, ModalHeader } from '../Modal/Modal.js'


export default function Header(props) {
    const signupEmailInput = useRef()
    const signupPasswordInput = useRef()
    const loginEmailInput = useRef()
    const loginPasswordInput = useRef()

    const [errorText, setErrorText] = useState()

    // Modal
    const [showSignupModal, setShowSignupModal] = useState(false)
    const [showLoginModal, setShowLoginModal] = useState(false)


    // Log user out
    function logOut() {
        auth.signOut().catch((err) => {
            console.log(err.message)
        })
    }

    // Log user in
    function logIn() {
        signInWithEmailAndPassword(
            auth,
            loginEmailInput.current.value,
            loginPasswordInput.current.value
        ).then(() => {
            setShowLoginModal(false)
        }).catch((err) => {
            console.log(err.message);
            if(err.message.includes('user-not-found')) 
                setErrorText('Bruker finnes ikke')
            else if(err.message.includes('invalid-email')) 
                setErrorText('Ugyldig email adresse')
            else if(err.message.includes('wrong-password') || loginPasswordInput.current.value === '') 
                setErrorText('Passord stemmer ikke for denne brukeren')
            else setErrorText('Feil opstod')
        })
    }

    // Register new user
    function register() {
        if (signupEmailInput.current.value === "" || signupPasswordInput.current.value === "") {
            setErrorText('Både email og passord må oppgis')
        } else {
            createUserWithEmailAndPassword(
                auth,
                signupEmailInput.current.value,
                signupPasswordInput.current.value
            ).then(() => {
                setShowSignupModal(false)
            }).catch((err) => {
                let errorMessage

                // ugyldig
                if(err.message.includes('weak-password')) 
                    errorMessage = 'Passord må være minst 6 tegn'
                
                else if(err.message.includes('email-already-in-use')) 
                    errorMessage = 'En bruker for denne email er allerede registrert'

                else if(err.message.includes('invalid-email')) 
                    errorMessage = 'Du må bruke en gyldig email adresse'
                    
                else if(err.message.includes('missing-email')) 
                    errorMessage = 'Du må oppgi en email adresse'
                
                else
                    errorMessage = 'Feil opstod'


                setErrorText(errorMessage);
            })
        }
    }


    return (
        <header>
            <div className="header--logo">
                <img src="logo2.png" className='logo'/>
                
            </div>
            <div className="header--content">
                <button 
                    className={`auth-button ${!props.currentUser && 'hidden'}`}
                    onClick={logOut}
                >
                    Logg ut
                </button> 
                <button 
                    className={`auth-button ${props.currentUser && 'hidden'}`}
                    onClick={() => {
                        setErrorText(null)
                        setShowSignupModal(true)
                        }
                    }
                >
                    Registrer deg
                </button>  
                <button 
                    className={`auth-button ${props.currentUser && 'hidden'}`}
                    onClick={() => {
                        setErrorText(null)
                        setShowLoginModal(true)
                        }
                    }
                >
                    Logg inn
                </button> 

                <span
                    className={!props.currentUser && 'hidden'}
                >
                    {props.currentUser && 'Velkommen, ' + props.currentUser.email}
                </span>
                 
            </div>

            {/* Sign up Modal */}
            <Modal
                show={showSignupModal}
                setShow={setShowSignupModal}
            >
                <ModalHeader>
                    Registrer deg
                </ModalHeader>
                <ModalBody>
                    <label>Email:</label><br/>
                    <input type='email' ref={signupEmailInput} /><br/>
                    <label>Passord:</label><br/>
                    <input type='password' ref={signupPasswordInput} /><br/>
                    <div>{errorText}</div>
                </ModalBody>
                <ModalFooter>
                    <input type='submit' onClick={register} />  
                </ModalFooter>
            </Modal>

            {/* Log in Modal */}
            <Modal
                show={showLoginModal}
                setShow={setShowLoginModal}
            >
                <ModalHeader>
                    Logg inn
                </ModalHeader>
                <ModalBody>
                    <label>Email:</label><br/>
                    <input type='email' ref={loginEmailInput} /><br/>
                    <label>Passord</label><br/>
                    <input type='password' ref={loginPasswordInput} /><br/>
                    <div>{errorText}</div>
                </ModalBody>
                <ModalFooter>
                    <input type='submit' onClick={logIn} />  
                </ModalFooter>
            </Modal>
        </header>)
}


