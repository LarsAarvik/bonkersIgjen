import './mainContent.css'
import React, {useEffect, useRef, useState} from "react"
import ListingCard from "../ListingCard/ListingCard.js"
import Filter from "../Filter/Filter.js"
import { socket } from '../../App';

export default function MainContent(props) {
    //
    const [listings, setListings] = useState('No data')
    const [currentListings, setCurrentListings] = useState()



    const searchField = useRef()

    function shouldBeHidden(category, area, description, title, owner) {

        let hidden = false

        // Sjekker søkestring
        const string = description + title
        if(!(string.toLowerCase().includes(searchField.current.value.toLowerCase())) && searchField.current.value !== '' ) hidden = true

        // Sjekker valgt kategori og sted
        const selectedCategory = document.querySelector('input[name="category"]:checked').value
        const selectedArea = document.querySelector('input[name="area"]:checked').value
        if ((selectedCategory !== category) && (selectedCategory !== 'alle')) hidden = true
        if ((selectedArea !== area) && (selectedArea !== 'alle')) hidden = true


        // Sjekker om "kun mine annonser" er valgt
        const selectedMyAds = document.querySelector('input[name="myads"]:checked').value
        if (selectedMyAds === 'ja') {

            console.log(props.currentUser.email);
            // Skjuler annonsen hvis currentuser ikke er annonsens eier
            if (owner !== props.currentUser.email) {
                hidden = true
            }
        }

        return hidden
        
    }

    function displayListings(listings) {

        let cl


        if (listings) {
            console.log('updated:', listings);
            setCurrentListings(listings)
            cl = listings
        }
        else cl = currentListings
        console.log(props.currentUser);
        const l = cl.map((listing) => 
        {   
            return (
                <ListingCard
                    listing={listing}
                    key={listing.id}
                    hidden={shouldBeHidden(listing.category, listing.area, listing.description, listing.title, listing.owner)}
                />
            
            )
        })
        setListings(l)
    }

    function handleChange(){
        displayListings()
    }

    // Socket

    useEffect(() => {
        console.log('useeffect');

        const dbListings = (objects) => {
            console.log('data mottatt fra server')
            displayListings(objects)
        }

        const newListing = (object) => {
            const listings = currentListings
            listings.push(object)
            displayListings(listings)
        }

        const updateCurrentBid = (object) => {
            const index = currentListings.findIndex((obj => obj.id === object.id))
            const newListings = currentListings
            newListings[index].bid = object.bid
            displayListings(newListings)


        }

        socket.on('db-listings', dbListings)
        socket.on('new-listing', newListing)
        socket.on('new-bid', updateCurrentBid)

        return () => {
            socket.off('db-listings', dbListings)
            socket.off('new-listing', newListing)
            socket.off('new-bid', updateCurrentBid)
        }

    }, [currentListings])

    

    return  <div className="main-content">
                <div className="filter-container">
                    <Filter
                        currentUser={props.currentUser}
                        handleChange={handleChange}
                    />
                </div>
                <div className="listings-container">
                    <div className='listings-search'>
                        <h3>Søkefelt</h3>
                        <input type='search' ref={searchField} onChange={handleChange} placeholder='Søketext...'/>
                    </div>
                    {listings}
                </div>
                
                
            </div>
}

