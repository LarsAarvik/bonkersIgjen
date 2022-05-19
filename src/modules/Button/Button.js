import './button.css'

const Button = props => {
  return (
    <button className={`button ${props.hidden && 'hidden'}`} onClick={props.onClick}>
        {props.children}
    </button>
  )
}

export default Button