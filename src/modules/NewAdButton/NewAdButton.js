import './newAdButton.css'
import { addDoc, collection } from 'firebase/firestore'
import React, { useRef, useState } from 'react'
import { db } from '../../firebase'
import { capitaliseFirst } from '../../resources/utilities'
import Modal, { ModalHeader, ModalBody, ModalFooter } from '../Modal/Modal'
import Button from "../Button/Button";
import categories from "../../resources/categories.json"
import areas from "../../resources/areas.json"
import { socket } from '../../App'
import axios from 'axios'

const NewAdButton = (props) => {

    const newAdForm = useRef()

    const [showNewAdModal, setShowNewAdModal] = useState(false)
    
    // Komponenter for registrering
    const areaOptions = areas.map(area => {
        return(
            <option value={area}>{capitaliseFirst(area)}</option>
        )
    })

    const categoryOptions = categories.map(cat => {
        return(
            <option value={cat}>{capitaliseFirst(cat)}</option>
        )
    })
    

    async function uploadImage(image) {

        const form = new FormData()
        form.append('image', image)
          
        
        const URL = axios.post('https://api.imgbb.com/1/upload?expiration=600&key=f46292ff5e4bf3c32e543ac751f68d3b', form)
            .then((response) => {
                return response.data.data.image.url
            })
            .catch((error) => {
                console.log('error', error)
                alert('Bilde kunne ikke lastes opp')
            }) 

        return URL

    }
    
    

    async function registerNewAd() {
        const title = newAdForm.current.title.value
        const description = newAdForm.current.description.value
        const bid = newAdForm.current.startBid.value
        const date = newAdForm.current.endTime.value

        if (title === '' || description === '' || bid === '' || date === '') {
            document.querySelector('.error').style.display = 'block'
            return
        }

        const image = newAdForm.current.image.files[0]
        let imgURL = 'default.png'
        console.log("image:", image);
        if (image) {
            imgURL = await uploadImage(image)
            console.log(imgURL);
        }

        const docRef = await addDoc(collection(db, "listings"), {
            active: true,
            title: title,
            description: description,
            category: newAdForm.current.category.value,
            area: newAdForm.current.area.value,
            endTime: new Date(date),
            bid: bid,
            highestBidder: null,
            owner: props.currentUser.email,
            imgURL: imgURL
        })
        console.log("Document written with ID: ", docRef.id);
        newAdForm.current.reset()
        setShowNewAdModal(false)
        socket.emit('listing-registered', docRef.id)
    }



    return (
        <>
            <Button
                hidden={props.currentUser && false}
                onClick={() => {
                    document.querySelector('.error').style.display = 'none'
                    setShowNewAdModal(true)
                }}
                >
                    Ny auksjon
            </Button>
            <Modal
                show={showNewAdModal}
                setShow={setShowNewAdModal}
            >
                <ModalHeader>
                    Ny auksjon
                </ModalHeader>
                <ModalBody>
                    <form ref={newAdForm}>
                        <label htmlFor='image'>Bilde (valgfri):</label><br/>
                        <input id='image' name='image' type='file' /><br/>

                        <label htmlFor='title'>Tittel:</label><br/>
                        <input id='title' name='title' type='text' /><br/>
                        <label htmlFor='description'>Beskrivelse:</label><br/>
                        <textarea id='description' name='description' /><br/>
                        
                        <label htmlFor='category'>Kategori:</label><br/>
                        <select name='category' id='category'>
                            {categoryOptions}
                        </select><br/>

                        <label htmlFor='area'>Område:</label><br/>
                        <select name='area' id='area'>
                            {areaOptions}
                        </select><br/>

                        <label htmlFor='endTime'>Sluttdato:</label><br/>
                        <input id='endTime' name='endTime' type='datetime-local' /><br/>

                        <label htmlFor='startBid'>Startbud:</label><br/>
                        <input id='startBid' name='startBid' type='number' /><br/>

                        <div className='error'>Vennligst fyll ut alle feltene</div>

                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button hidden={false} onClick={registerNewAd}>Send</Button>
                    <Button hidden={false} onClick={() => {
                        newAdForm.current.reset()
                        document.querySelector('.error').style.display = 'none'}}>
                        Rens
                    </Button>
                </ModalFooter>
            </Modal>
    </>
    )
}

export default NewAdButton