import { useEffect, useRef } from 'react'
import './modal.css'

const Modal = props => {

    const modalRef = useRef()

    useEffect(() => {
        const clickOutside = (e) => {
            if(e.target === modalRef.current) {
                props.setShow(false)
            }
        }
        window.addEventListener('click', clickOutside)
        return () => {
            window.removeEventListener('click', clickOutside)
        }
    }, [props])

    return (
        <div ref={modalRef} className={`modal ${props.show ? 'active' : ''}`}>
            <div className='modal--content'>
                {props.showCloseButton && <span onClick={() => props.setShow(false)} className='modal--close'>
                    &times;
                </span>}
                
                {props.children}
            </div>
        </div>
    )
}

export default Modal

export const ModalHeader = props => {
    return <div className='modal--header'>
    {props.children}
</div>
}

export const ModalBody = props => {
    return <div className='modal--body'>
    {props.children}
</div>
}

export const ModalFooter = props => {
    return <div className='modal--footer'>
    {props.children}
</div>
}