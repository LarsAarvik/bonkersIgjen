import './listingCard.css'
import { useState, useEffect, useRef } from "react";
import Modal, { ModalHeader, ModalBody } from '../Modal/Modal';
import { db, firebase } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { socket } from '../../App';
import { getAuth, onAuthStateChanged } from "firebase/auth";


export default function ListingCard(props) {

    const auth = getAuth();
    const user = auth.currentUser;
    
    const [bidArea, setBidArea] = useState()

    const [timer, setTimer] = useState(null)

    const [showAdInfoModal, setShowAdInfoModal] = useState(false)
    const [currentBid, setCurrentBid] = useState(props.listing.bid)
    const minBid = Math.round(currentBid*1.05)


    const bidInput = useRef()
    
    const endTime = new Date(props.listing.endDate).getTime()


    const updateTimer = (endTime) => {
        const now = new Date().getTime()
        const difference = endTime - now
        console.log(difference) 

        if (difference <= 0) return 'Utløpt'

        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        return(days + ':' + hours + ':' + minutes + ':' + seconds)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimer(updateTimer(endTime))
        }, 1000)
        return () => clearTimeout(timer)
    })

    async function bidOnItem() {
        const bid = bidInput.current.valueAsNumber
        await updateDoc(doc(db, 'listings', props.listing.id), {
            bid: bid,
            highestBidder: user.email
        }).then(() => {
            setCurrentBid(bid)
            const socketObject = {
                id: props.listing.id,
                bid: bid
            }
            socket.emit('new-bid', socketObject)
        })
    }

    
    
        let bidDiv = <h4>Logg inn for å gi bud</h4>
        if (user?.email === props.listing.owner) {
            bidDiv = <h4>Dette er din egen auksjon</h4>}
        

    return (
        <>
        <div className={`listing-container ${props.hidden ? 'hidden' : ''}`}>
            <div className='img-container'>
                <img src={props.listing.imgURL} alt="img" onClick={() => setShowAdInfoModal(true)}/>
            </div>
            <h1 className="listing-title" onClick={() => setShowAdInfoModal(true)}>{props.listing.title}</h1>
            <div className="listing-info" onClick={() => setShowAdInfoModal(true)}>
                <div key={currentBid} className="listing-bid">{currentBid + 'kr'}</div>
                <div className="listing-end">{timer}</div>
            </div>
            <div className={`bid-input ${!(user?.email === props.listing.owner) || 'hidden'}`}>
                <input type='number' key={minBid} placeholder={'Minst ' + minBid + 'kr'} ref={bidInput} />
                <button onClick={bidOnItem}>Gi bud</button>
            </div>
            <div className={`bid-input ${user?.email === props.listing.owner || 'hidden'}`}>
                <h4>Dette er annonsen din</h4>
            </div>
            <div className={`bid-input ${!user || 'hidden'}`}>
                <h4>Logg inn for å gi bud</h4>
            </div>
        </div>
        <Modal
            show={showAdInfoModal}
            setShow={setShowAdInfoModal}
        >
            <ModalBody>
                <img src={props.listing.imgURL} alt="img"></img>   
                <h1>{props.listing.title}</h1>
                <p>{props.listing.description}</p>
            </ModalBody>
        </Modal>
        </>
    );
  }